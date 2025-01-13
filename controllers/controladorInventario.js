

const Inventory = require('../models/modeloInventario');

// Create a new inventory item
exports.createInventory = (req, res) => {
    const { idcarro, estado, ubicacion, en_mantenimiento } = req.body;

    // Validate required fields
    if (!idcarro || !estado || !ubicacion) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }

    Inventory.create(req.body, (error, results) => {
        if (error) {
            console.error("Error creating inventory:", error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json({ idinventario: results.insertId, ...req.body });
    });
};

// Get all inventory items
exports.getInventories = (req, res) => {
    Inventory.getAll((error, results) => {
        if (error) {
            console.error("Error getting inventories:", error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json(results);
    });
};

// Get an inventory item by ID
exports.getInventoryById = (req, res) => {
    const inventoryId = req.params.id;
    
    Inventory.getById(inventoryId, (error, results) => {
        if (error) {
            console.error("Error getting inventory:", error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json(results[0]);
    });
};

// Update an inventory item
exports.updateInventory = (req, res) => {
    const inventoryId = req.params.id;

    Inventory.update(inventoryId, req.body, (error, results) => {
        if (error) {
            console.error("Error updating inventory:", error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json({ message: 'Inventory item updated successfully' });
    });
};

// Delete an inventory item
exports.deleteInventory = (req, res) => {
    const inventoryId = req.params.id;

    Inventory.delete(inventoryId, (error, results) => {
        if (error) {
            console.error("Error deleting inventory:", error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json({ message: 'Inventory item deleted successfully' });
    });
};
