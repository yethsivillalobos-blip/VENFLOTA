const express = require('express');
const router = express.Router();
const guardiaController = require('../controllers/guardiaController');

router.post('/iniciar', guardiaController.iniciarGuardia);
router.post('/sync-gps', guardiaController.sincronizarGPS);

module.exports = router;
