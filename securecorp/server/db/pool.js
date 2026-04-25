const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'securecorp',
});

// Test connection on startup
pool.query('SELECT NOW()')
  .then(() => console.log('✓ PostgreSQL connected successfully'))
  .catch((err) => console.error('✗ PostgreSQL connection error:', err.message));

module.exports = pool;
