const express = require('express');
const cors = require('cors');
require('dotenv').config();

const guardiaRoutes = require('./src/routes/guardiaRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/guardias', guardiaRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor VenFlota operativo' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor VenFlota corriendo en el puerto ${PORT}`);
});
