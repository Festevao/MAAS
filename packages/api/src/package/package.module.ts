import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { ThemeModule } from 'src/theme/theme.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Package]),
    ThemeModule,
  ],
  controllers: [PackageController],
  providers: [PackageService],
  exports: [PackageService],
})
export class PackageModule {}
