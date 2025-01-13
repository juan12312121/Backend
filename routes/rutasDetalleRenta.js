const express = require('express');
const router = express.Router();
const rentalDetailController = require('../controllers/controladorDetalleRenta');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Crear un nuevo detalle de renta
router.post('/', verifyToken, rentalDetailController.createDetalleRenta); 

// Obtener todos los detalles de renta para el usuario autenticado
router.get('/', verifyToken, rentalDetailController.getAllDetallesByUser); 

// Obtener detalles de renta por ID de usuario (solo para administradores)
router.get('/usuario/:usuarioId', verifyToken, isAdmin, rentalDetailController.getDetallesByUserId); 

// Obtener todos los detalles de renta (solo para administradores)
router.get('/admin', verifyToken, isAdmin, rentalDetailController.getAllDetalles); 

// Actualizar un detalle de renta (solo administradores)
router.put('/:id', verifyToken, isAdmin, rentalDetailController.updateDetalleRenta); 

// Eliminar un detalle de renta (solo administradores)
router.delete('/:id', verifyToken, isAdmin, rentalDetailController.deleteDetalleRenta); 

module.exports = router;
