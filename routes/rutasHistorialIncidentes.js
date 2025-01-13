const express = require('express');
const router = express.Router();
const HistorialIncidenciasController = require('../controllers/controladorHistorialIncidentes');
const { verifyToken, isUser, isAdmin } = require('../middlewares/authMiddleware');

// Obtener todas las incidencias (solo para administradores)
router.get('/', verifyToken, isAdmin, HistorialIncidenciasController.getAllIncidencias);

// Obtener incidencias del usuario autenticado
router.get('/user', verifyToken, isUser, HistorialIncidenciasController.getIncidenciasByUserId);

// Obtener una incidencia por ID
router.get('/:id', verifyToken, HistorialIncidenciasController.getIncidenciaById);

module.exports = router;
