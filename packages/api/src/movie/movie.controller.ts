import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { TokenPayload } from 'src/core/annotations/TokenPayload';
import { JWTPayload } from 'src/auth/types/JwtPayload';
import { PaginationTypeMovieWatch, PaginationTypeResult } from './dto/pagination-response.dto';
import { MovieMarkDTO } from './dto/mark-film.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async getItems(
    @Query('themes') themes: string[],
    @Query('pageSize') pageSize: string = '10',
    @Query('page') page: string = '1',
    @TokenPayload() payload: JWTPayload,
  ): Promise<PaginationTypeResult> {
    const pageSizeNumber = parseInt(pageSize);
    if (isNaN(pageSizeNumber)) {
      throw new BadRequestException('pageSize param must be a number.');
    }
    const pageNumber = parseInt(page);
    if (isNaN(pageNumber)) {
      throw new BadRequestException('page param must be a number.');
    }

    const result = await this.movieService.getPaginated(payload.sub, themes, pageSizeNumber, pageNumber);

    return result;
  }

  @Post('mark-view')
  async markFilmView(
    @Body() movieMarkDTO: MovieMarkDTO,
    @TokenPayload() payload: JWTPayload,
  ) {
    await this.movieService.markViewMovie(payload.sub, movieMarkDTO.movieIds);
  }

  @Post('unmark-view')
  async unmarkFilmView(
    @Body() movieMarkDTO: MovieMarkDTO,
    @TokenPayload() payload: JWTPayload,
  ) {
    await this.movieService.unmarkViewMovie(payload.sub, movieMarkDTO.movieIds)
  }

  @Get('view')
  async getUserWatchedMovies(
    @Query('pageSize') pageSize: string = '10',
    @Query('page') page: string = '1',
    @TokenPayload() payload: JWTPayload,
  ): Promise<PaginationTypeMovieWatch> {
    const pageSizeNumber = parseInt(pageSize);
    if (isNaN(pageSizeNumber)) {
      throw new BadRequestException('pageSize param must be a number.');
    }
    const pageNumber = parseInt(page);
    if (isNaN(pageNumber)) {
      throw new BadRequestException('page param must be a number.');
    }

    return await this.movieService.getUserWatchedMovies(
      payload.sub,
      pageNumber,
      pageSizeNumber,
    );
  }
}
