// routes/inventoryRoutes.js

const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/controladorInventario');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Create a new inventory item (only for administrators)
router.post('/', verifyToken, isAdmin, inventoryController.createInventory); 

// Get all inventory items (only for administrators)
router.get('/', verifyToken, isAdmin, inventoryController.getInventories); 

// Get an inventory item by ID (only for administrators)
router.get('/:id', verifyToken, isAdmin, inventoryController.getInventoryById); 

// Update an inventory item (only for administrators)
router.put('/:id', verifyToken, isAdmin, inventoryController.updateInventory); 

// Delete an inventory item (only for administrators)
router.delete('/:id', verifyToken, isAdmin, inventoryController.deleteInventory); 

module.exports = router; 
