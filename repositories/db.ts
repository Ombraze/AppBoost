import 'dotenv';
import { createPool, Pool } from 'mysql2/promise';

const connection = createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'yboost_j2'
});

export const pool: Pool = connection;

