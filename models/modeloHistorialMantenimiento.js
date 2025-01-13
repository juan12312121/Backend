const db = require('../config/database'); 

const HistorialMantenimiento = {
    create: (data, callback) => {
        const query = `INSERT INTO historial_mantenimiento (id_carro, fecha_mantenimiento, descripcion, costo) VALUES (?, ?, ?, ?)`;
        db.query(query, [data.id_carro, data.fecha_mantenimiento, data.descripcion, data.costo], callback);
    },

    getAll: (callback) => {
        const query = `SELECT * FROM historial_mantenimiento`;
        db.query(query, callback);
    },

    getById: (id, callback) => {
        const query = `SELECT * FROM historial_mantenimiento WHERE id_mantenimiento = ?`;
        db.query(query, [id], callback);
    },

    update: (id, data, callback) => {
        const query = `UPDATE historial_mantenimiento SET id_carro = ?, fecha_mantenimiento = ?, descripcion = ?, costo = ? WHERE id_mantenimiento = ?`;
        db.query(query, [data.id_carro, data.fecha_mantenimiento, data.descripcion, data.costo, id], callback);
    },

    // Eliminar un mantenimiento
    delete: (id, callback) => {
        const query = `DELETE FROM historial_mantenimiento WHERE id_mantenimiento = ?`;
        db.query(query, [id], callback);
    },
};

module.exports = HistorialMantenimiento;
