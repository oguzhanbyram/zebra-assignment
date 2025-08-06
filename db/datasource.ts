import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

const includeTsPaths = process.env.TS_NODE === 'true';

const extGroup = includeTsPaths ? '{ts,js}' : '{js}';

const glob = (suffix: string) => `dist/**/*/*.${suffix}.${extGroup}`;

const entities = [glob('entity')];
const subscribers = [glob('subscriber')];

const migrations = ['db/migrations/**/*{.ts,.js}'];

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'zebra',
  schema: process.env.DB_SCHEMA || 'public',
  entities,
  subscribers,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  logger: 'advanced-console',
  migrations,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
