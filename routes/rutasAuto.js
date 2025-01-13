const express = require('express');
const router = express.Router();
const carController = require('../controllers/controladorAuto');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/uploadConfig'); // Import multer for image handling

// Ruta para obtener todos los carros (admins)
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, carController.getAllCars);

// Ruta para obtener carros visibles para usuarios
router.get('/usuario', carController.getUserCars);

router.get('/relacionados', authMiddleware.verifyToken, carController.getRelatedCars);


// Ruta para crear un nuevo carro (admins)
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, upload.single('imagen'), carController.createCar);

// Ruta para actualizar un carro (admins)
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, upload.single('imagen'), carController.updateCar);

// Ruta para eliminar un carro (admins)
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, carController.deleteCar);

    router.get('/:id', authMiddleware.verifyToken, carController.getCarById);





module.exports = router;
