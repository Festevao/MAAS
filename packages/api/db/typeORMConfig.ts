import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from "path";

dotenvConfig({ path: '../../.env' });

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  port: Number(process.env.DB_PORT ?? 5432),
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  entities: [path.join(__dirname, "../src") + '**/*/entities/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: process.env.NODE_ENV !== 'production',
  migrations: [__dirname + "/typeORM_migrations/*{.ts,.js}"],
  retryAttempts: 10,
  logging:
    process.env.NODE_ENV !== 'production'
      ? ['query', 'error']
      : [],
  ssl: false
}

export default registerAs('typeORMConfig', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);
