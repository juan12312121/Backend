const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/controladorPromocion');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Rutas de promociones
router.post('/', verifyToken, isAdmin, promotionController.createPromotion);
router.get('/', verifyToken, isAdmin, promotionController.getAllPromotions);
router.get('/:id', verifyToken, isAdmin, promotionController.getPromotionById);
router.put('/:id', verifyToken, isAdmin, promotionController.updatePromotion);
router.delete('/:id', verifyToken, isAdmin, promotionController.deletePromotion);
// Aplicar una renta a un carro
router.put('/apply/:idCarro/:idPromocion', verifyToken, isAdmin, promotionController.applyPromotionToCar);

// Actualizar el estado de una promoción
router.put('/activar/:id_promocion',verifyToken,promotionController.activatePromotion);

// Desactivar promoción
router.post('/desactivar',  verifyToken, promotionController.deactivatePromotion );

router.post('/apply-promotion', verifyToken, promotionController.applyPromotion);

router.get('/descuento/:id_promocion', verifyToken, (req, res, next) => {
    console.log('ID Promoción recibido:', req.params.id_promocion);
    next(); // Pasar el control al controlador
  }, promotionController.getPromotionDiscount);


module.exports = router;
