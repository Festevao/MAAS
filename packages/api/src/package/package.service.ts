import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base.service';
import { Package } from './entities/package.entity';
import { Repository } from 'typeorm';
import { CreatePackageDTO } from './dto/create-package.dto';
import { ThemeService } from 'src/theme/theme.service';

@Injectable()
export class PackageService extends BaseService<Package> {
  constructor(
    @InjectRepository(Package)
    protected readonly repository: Repository<Package>,
    private themeService: ThemeService,
  ) {
    super(repository, Package);
  }

  async getAllByUser(userId: string) {
    return await this.repository.find({
      where: {
        userId,
      }
    });
  }

  async createByUser(userId: string, dto: CreatePackageDTO) {
    const themes = await this.themeService.findAll();

    dto.themes = dto.themes.reduce((acc, theme) => {
      const themeName = themes.find(({ name }) => name.toLowerCase() === theme.toLowerCase())?.name
      
      if (!themeName) {
        throw new UnprocessableEntityException('One of themes is invalid.');
      }

      acc.push(themeName);

      return acc;
    }, []);

    const entity = this.repository.create({
      ...dto,
      userId,
    });
    return await this.repository.save(entity);
  }
}
