const pgp = require('pg-promise')();
require('dotenv').config();

// Database configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'aptitude_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres'
};

// Create database instance
const db = pgp(config);

// Test database connection
db.connect()
  .then(obj => {
    console.log('Database connection successful');
    obj.done(); // success, release the connection
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });

module.exports = db;
