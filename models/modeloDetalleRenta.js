const db = require('../config/database');

const DetalleRenta = {
    create: (data, callback) => {
        const query = 'INSERT INTO detalle_renta (id_usuario, id_carro, fecha_inicio, fecha_fin, precio_total, metodo_pago, estado_renta, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [data.id_usuario, data.id_carro, data.fecha_inicio, data.fecha_fin, data.precio_total, data.metodo_pago, data.estado_renta, data.observaciones], callback);
    },
    getAllByUser: (userId, callback) => {
        const query = 'SELECT * FROM detalle_renta WHERE id_usuario = ?';
        db.query(query, [userId], callback);
    },
    getAll: (callback) => {
        const query = 'SELECT * FROM detalle_renta';
        db.query(query, callback);
    },
    getById: (id, callback) => {
        const query = 'SELECT * FROM detalle_renta WHERE id = ?'; 
        db.query(query, [id], callback);
    },
    update: (id, data, callback) => {
        const query = 'UPDATE detalle_renta SET fecha_fin = ?, estado_renta = ? WHERE id = ?'; 
        db.query(query, [data.fecha_fin, data.estado_renta, id], callback);
    },
    delete: (id, callback) => {
        const query = 'DELETE FROM detalle_renta WHERE id = ?';
        db.query(query, [id], callback);
    },
};

module.exports = DetalleRenta;
