const db = require('../config/db');

const iniciarGuardia = async (req, res) => {
  const { chofer_id, vehiculo_placa, turno, km_inicial, litros_combustible, ruta_asignada } = req.body;
  try {
    const text = `
      INSERT INTO guardias(chofer_id, vehiculo_placa, turno, km_inicial, litros_combustible, ruta_asignada)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [chofer_id, vehiculo_placa, turno, km_inicial, litros_combustible, ruta_asignada];
    const result = await db.query(text, values);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error al iniciar guardia:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

const sincronizarGPS = async (req, res) => {
  const { guardia_id, logs } = req.body;
  try {
    await db.query('BEGIN');
    for (const log of logs) {
      const text = `
        INSERT INTO gps_logs(guardia_id, latitud, longitud, velocidad, timestamp_log)
        VALUES($1, $2, $3, $4, $5)
      `;
      const values = [guardia_id, log.lat, log.lng, log.velocidad, log.timestamp];
      await db.query(text, values);
    }
    await db.query('COMMIT');
    res.status(200).json({ success: true, message: 'Telemetría sincronizada' });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error sincronizando GPS:', error);
    res.status(500).json({ success: false, error: 'Fallo al sincronizar' });
  }
};

module.exports = { iniciarGuardia, sincronizarGPS };
