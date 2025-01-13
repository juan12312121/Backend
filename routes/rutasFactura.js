const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/controladorFactura');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Rutas de facturas
router.post('/', verifyToken, isAdmin, invoiceController.createInvoice);
router.get('/', verifyToken, isAdmin, invoiceController.getAllInvoices);
router.get('/:id', verifyToken, isAdmin, invoiceController.getInvoiceById);
router.put('/:id', verifyToken, isAdmin, invoiceController.updateInvoice);
router.delete('/:id', verifyToken, isAdmin, invoiceController.deleteInvoice);

module.exports = router;
