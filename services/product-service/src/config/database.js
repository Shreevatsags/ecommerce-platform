const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool (like a phone line to database)
const pool = new Pool({
  host: process.env.DB_HOST,      // Where is the database? (localhost)
  port: process.env.DB_PORT,      // Which door? (5432)
  database: process.env.DB_NAME,  // Which database? (products_db)
  user: process.env.DB_USER,      // Username (postgres)
  password: process.env.DB_PASSWORD, // Password (postgres123)
});

// Log when connected
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

// Log errors
pool.on('error', (err) => {
  console.error('❌ Database error:', err);
});

// Export so other files can use it
module.exports = pool;