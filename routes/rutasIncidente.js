const express = require('express');
const router = express.Router();
const IncidentController = require('../controllers/controladorIncidente');

const { verifyToken, isUser, isAdmin } = require('../middlewares/authMiddleware');

// Crear una nueva incidencia (solo para usuarios autenticados)
router.post('/', verifyToken, isUser, IncidentController.createIncidencia); 

// Obtener todas las incidencias (solo para administradores)
router.get('/', verifyToken, isAdmin, IncidentController.getAllIncidencias);

// Obtener las incidencias de un usuario (solo para usuarios)
router.get('/user', verifyToken, isUser, IncidentController.getIncidenciasByUserId);

// Obtener una incidencia por ID (disponible para administradores o usuarios que la crearon)
router.get('/:id', verifyToken, IncidentController.getIncidenciaById);

module.exports = router;