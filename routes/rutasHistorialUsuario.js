const express = require('express');
const router = express.Router();
const userHistoryController = require('../controllers/controladorHistorialUsuario');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para crear un registro en el historial de usuarios (solo admins)
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, userHistoryController.createUserHistory);

// Ruta para obtener todos los registros del historial de usuarios (solo admins)
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, userHistoryController.getAllUserHistory);

// Ruta para obtener un registro del historial de usuarios por ID (admins y usuarios)
router.get('/:id', authMiddleware.verifyToken, userHistoryController.getUserHistoryById);

// Ruta para obtener el historial del usuario autenticado
router.get('/mi-historial', authMiddleware.verifyToken, userHistoryController.getUserHistoryByUserId);

// Ruta para actualizar un registro en el historial de usuarios (solo admins)
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, userHistoryController.updateUserHistory);

// Ruta para eliminar un registro del historial de usuarios (solo admins)
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, userHistoryController.deleteUserHistory);

module.exports = router;
