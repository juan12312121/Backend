const db = require('../config/database'); 

const Inventory = {
    create: (inventoryData, callback) => {
        const { idcarro, estado, ubicacion, en_mantenimiento } = inventoryData;
        const query = 'INSERT INTO inventario (idcarro, estado, ubicacion, en_mantenimiento) VALUES (?, ?, ?, ?)';
        db.query(query, [idcarro, estado, ubicacion, en_mantenimiento], callback);
    },

    getAll: (callback) => {
        const query = 'SELECT * FROM inventario';
        db.query(query, callback);
    },

    getById: (id, callback) => {
        const query = 'SELECT * FROM inventario WHERE idinventario = ?';
        db.query(query, [id], callback);
    },

    update: (id, inventoryData, callback) => {
        const { idcarro, estado, ubicacion, en_mantenimiento } = inventoryData;
        const query = 'UPDATE inventario SET idcarro = ?, estado = ?, ubicacion = ?, en_mantenimiento = ? WHERE idinventario = ?';
        db.query(query, [idcarro, estado, ubicacion, en_mantenimiento, id], callback);
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM inventario WHERE idinventario = ?';
        db.query(query, [id], callback);
    }
};

module.exports = Inventory;
