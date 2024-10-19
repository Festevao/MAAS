import { Injectable, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import axios, { AxiosHeaders } from 'axios';
import { PackageService } from 'src/package/package.service';
import { Theme } from 'src/theme/schemas/theme.schema';
import { ThemeService } from 'src/theme/theme.service';
import { MoviesResponse, Result } from './dto/movies-response.dto';
import { PaginationType, PaginationTypeMovieWatch } from './dto/pagination-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieView } from './schemas/movieView.schema';
import { MovieDetailResponseDTO } from './dto/movie-detail-response.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieView.name)
    private moveviewModel: Model<MovieView>,
    private packageService: PackageService,
    private themeService: ThemeService,
  ) {}

  async getPaginated(
    userId: string,
    themes: string[],
    pageSize: number,
    page: number,
  ): Promise<PaginationType<Result>> {
    const packagesEntities = await this.packageService.getAllByUser(userId);
    if (!packagesEntities || packagesEntities.length === 0) {
      throw new NotFoundException(`Can't find user packages`);
    }

    const allowedThemes = (await this.themeService.findAll()).reduce((acc, theme) => {
      const userHasTheme = packagesEntities.some((packageEntity) =>
        packageEntity.themes.some((themeName) =>
          themeName.toLowerCase() === theme.name.toLowerCase()
        )
      );
      if (userHasTheme) {
        acc.push(theme);
      }
      return acc;
    }, [] as Theme[]);

    const themesFiltered = themes.reduce((acc, theme) => {
      const themeId = allowedThemes.find(({ name }) => name.toLowerCase() === theme.toLowerCase())?.externalId;
      if (themeId) {
        acc.push(themeId);
      }
      return acc;
    }, [] as string[]);

    const totalUrl = `${process.env.MOVIE_DATABASE_URL}/3/discover/movie?with_genres=${themesFiltered.join('%7C')}&sort_by=popularity.desc&page=1`;
    const totalResponse = await axios.get<MoviesResponse>(totalUrl, {
      headers: new AxiosHeaders({
        Authorization: `Bearer ${process.env.MOVIE_DATABASE_TOKEN}`,
      }),
    });

    const totalResults = totalResponse.data.total_results;
    const totalPagesExternal = Math.min(Math.ceil(totalResults / 20), 500);

    const totalPagesToFetch = Math.ceil(pageSize / 20);

    const startIndex = (page - 1) * pageSize;

    if (page > Math.ceil(totalResults / pageSize)) {
      return {
        data: [],
        pagination: {
          pageNumber: page,
          pageSize: pageSize,
          totalPages: Math.ceil(totalResults / pageSize),
          lastPage: true,
          firstPage: page === 1,
        },
      };
    }

    const paginatedResults: Result[] = [];
    
    for (let i = 0; i < totalPagesToFetch && (i + 1) <= totalPagesExternal; i++) {
      const pageIndex = Math.floor(startIndex / 20) + 1 + i;
      try {
        const url = `${process.env.MOVIE_DATABASE_URL}/3/discover/movie?with_genres=${themesFiltered.join('%7C')}&sort_by=popularity.desc&page=${pageIndex}`;
        const response = await axios.get<MoviesResponse>(url, {
          headers: new AxiosHeaders({
            Authorization: `Bearer ${process.env.MOVIE_DATABASE_TOKEN}`,
          }),
        });

        paginatedResults.push(...response.data.results);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          throw new InternalServerErrorException({
            status: e.response?.status || 500,
            message: e.response?.data ? `Movies API error: ${JSON.stringify(e.response?.data)}` : 'Erro ao obter dados da API.',
          });
        }

        throw new InternalServerErrorException('Erro interno do servidor.');
      }
    }

    const finalResults = paginatedResults.slice(startIndex % 20, (startIndex % 20) + pageSize);

    return {
      data: finalResults,
      pagination: {
        pageNumber: page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalResults / pageSize),
        lastPage: page >= Math.ceil(totalResults / pageSize),
        firstPage: page === 1,
      },
    };
  }

  async markViewMovie(userId: string, movieIds: number[]) {
    const packagesEntities = await this.packageService.getAllByUser(userId);
    if (!packagesEntities || packagesEntities.length === 0) {
      throw new NotFoundException(`Can't find user packages.`);
    }

    const allThemes = await this.themeService.findAll();
    const allowedThemes = allThemes.filter((theme) => {
      return packagesEntities.some((packageEntity) => {
        return packageEntity.themes.some((themeName) => {
          return themeName.toLowerCase() === theme.name.toLowerCase();
        });
      });
    });

    const moviesInfos = await Promise.all(movieIds.map(async (movieId) => {
      const url = `${process.env.MOVIE_DATABASE_URL}/3/movie/${movieId}`;
      const response = await axios.get<MovieDetailResponseDTO>(url, {
        headers: new AxiosHeaders({
          Authorization: `Bearer ${process.env.MOVIE_DATABASE_TOKEN}`,
        }),
      });

      const movieIsAllowed = response.data.genres.some((genre) => {
        return allowedThemes.some((theme) => {
          return parseInt(theme.externalId) === genre.id;
        });
      });
  
      if (!movieIsAllowed) {
        throw new UnauthorizedException('The user does not have one of the packages required to watch this film.');
      }

      return new this.moveviewModel({
        externalId: response.data.id,
        userId,
      });
    }));

    await this.moveviewModel.insertMany(moviesInfos);
  }

  async unmarkViewMovie(userId: string, movieIds: number[]) {
    await this.moveviewModel.deleteMany({
      userId: userId,
      externalId: { $in: movieIds },
    });
  }

  async getUserWatchedMovies(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<PaginationTypeMovieWatch> {
    const totalMovies = await this.moveviewModel.countDocuments({ userId });
    if (totalMovies === 0) {
      throw new NotFoundException('No watched movies found for the user.');
    }

    const totalPages = Math.ceil(totalMovies / pageSize);
    const skip = (page - 1) * pageSize;

    const movies = await this.moveviewModel
      .find({ userId })
      .skip(skip)
      .limit(pageSize)
      .exec();

    return {
      data: movies.map(({ externalId, userId }) => {
        return {
          userId,
          externalId: parseInt(externalId),
        };
      }),
      pagination: {
        pageNumber: page,
        pageSize: pageSize,
        totalPages: totalPages,
        lastPage: page >= totalPages,
        firstPage: page === 1,
      },
    };
  }
}
