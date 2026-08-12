const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('Conexión establecida con la base de datos VenFlota.');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
