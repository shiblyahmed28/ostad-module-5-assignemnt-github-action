import dotenv from 'dotenv';
dotenv.config();   // <== load .env immediately

console.log("DB CONFIG:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  url: process.env.DATABASE_URL,
});

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
  process.exit(-1);
});

pool.query('SELECT NOW()')
  .then(res => console.log('✅ Database connected successfully at:', res.rows[0].now))
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });

export const query = (text, params) => pool.query(text, params);
export { pool };
