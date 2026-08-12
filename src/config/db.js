const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Función para ejecutar el esquema automáticamente
const initDb = async () => {
  try {
    const schemaPath = path.join(__dirname, '../sql/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(sql);
    console.log('Esquema de base de datos cargado/verificado con éxito.');
  } catch (err) {
    console.error('Error inicializando las tablas de la base de datos:', err);
  }
};

pool.on('connect', () => {
  console.log('Conexión establecida con la base de datos VenFlota.');
});

// Inicializamos la estructura de tablas al conectar
initDb();

module.exports = {
  query: (text, params) => pool.query(text, params),
};

