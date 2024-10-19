import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { PackageModule } from 'src/package/package.module';
import { ThemeModule } from 'src/theme/theme.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieView, MovieViewSchema } from './schemas/movieView.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MovieView.name, schema: MovieViewSchema }]),
    PackageModule,
    ThemeModule,
  ],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}
