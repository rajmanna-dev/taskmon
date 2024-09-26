import pg from 'pg';
import env from 'dotenv';

env.config();

// CONNECTION TO DATABASE
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
});
db.connect();

export default db;
