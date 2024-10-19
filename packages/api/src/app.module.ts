import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import typeORMConfig from 'db/typeORMConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PackageModule } from './package/package.module';
import { ThemeModule } from './theme/theme.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeORMConfig],
      envFilePath: '../../../.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeORMConfig'),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dbName: configService.get('MONGODB_DB') ?? "test",
        uri: `mongodb://${configService.get('MONGODB_USER')}:${configService.get('MONGODB_PASSWORD')}@${configService.get('MONGODB_HOST')}:${configService.get('MONGODB_PORT')}`,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    UserModule,
    PackageModule,
    ThemeModule,
    MovieModule,
  ],
})
export class AppModule {
  constructor() {}  
}
