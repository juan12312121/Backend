const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const {
  crearValoracion,
  getAllValoraciones,
  getValoracionById,
  deleteValoracion
} = require('../controllers/controladorCalificacion');

// Ruta para crear una nueva valoración (solo usuarios autenticados)
router.post('/', verifyToken, crearValoracion);

// Ruta para obtener todas las valoraciones (solo administradores o usuarios autenticados)
router.get('/', verifyToken, getAllValoraciones);

// Ruta para obtener una valoración por ID (solo administradores o el usuario propietario de la valoración)
router.get('/valoraciones/:id', verifyToken, getValoracionById);

// Ruta para eliminar una valoración (solo administradores)
router.delete('/:id', verifyToken, isAdmin, deleteValoracion);

module.exports = router;
