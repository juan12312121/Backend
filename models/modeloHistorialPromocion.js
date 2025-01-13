const db = require('../config/database');

const PromotionHistoryModel = {
    // Obtener todas las promociones aplicadas a las rentas del usuario
    getUserPromotions: (userId, callback) => {
        const sql = `
            SELECT hp.id_historial_promo, 
                   p.descripcion AS promocion_descripcion, 
                   p.descuento, 
                   r.fecha_inicio, 
                   r.fecha_fin, 
                   hp.fecha_aplicacion, 
                   c.id AS carro_id, 
                   c.descripcion AS carro_descripcion,
                   c.marca, 
                   c.modelo, 
                   c.color
            FROM historial_promociones hp
            JOIN promociones p ON hp.id_promocion = p.id_promocion
            JOIN detalle_renta r ON hp.id_renta = r.id
            JOIN carros c ON r.id_carro = c.id
            WHERE hp.id_usuario = ?
        `;
        db.query(sql, [userId], callback);
    },

    // Obtener un registro del historial de promociones por ID
    getById: (id, callback) => {
        const sql = `
            SELECT hp.id_historial_promo, 
                   p.descripcion AS promocion_descripcion, 
                   p.descuento, 
                   r.fecha_inicio, 
                   r.fecha_fin, 
                   hp.fecha_aplicacion, 
                   c.id AS carro_id, 
                   c.descripcion AS carro_descripcion,
                   c.marca, 
                   c.modelo, 
                   c.color
            FROM historial_promociones hp
            JOIN promociones p ON hp.id_promocion = p.id_promocion
            JOIN detalle_renta r ON hp.id_renta = r.id
            JOIN carros c ON r.id_carro = c.id
            WHERE hp.id_historial_promo = ?
        `;
        db.query(sql, [id], callback);
    },

    // Insertar un nuevo registro en el historial de promociones
    insert: (id_promocion, id_usuario, id_renta, fecha_aplicacion, callback) => {
        const sql = `
            INSERT INTO historial_promociones (id_promocion, id_usuario, id_renta, fecha_aplicacion) 
            VALUES (?, ?, ?, ?)
        `;
        db.query(sql, [id_promocion, id_usuario, id_renta, fecha_aplicacion], callback);
    },

    // Eliminar un registro del historial de promociones
    deleteById: (id, callback) => {
        const sql = 'DELETE FROM historial_promociones WHERE id_historial_promo = ?';
        db.query(sql, [id], callback);
    },

    // Obtener todas las promociones aplicadas (accesible para administradores)
    getAllPromotions: (callback) => {
        const sql = `
            SELECT hp.id_historial_promo, 
                   p.descripcion AS promocion_descripcion, 
                   p.descuento, 
                   r.fecha_inicio, 
                   r.fecha_fin, 
                   hp.fecha_aplicacion, 
                   c.id AS carro_id, 
                   c.descripcion AS carro_descripcion,
                   c.marca, 
                   c.modelo, 
                   c.color,
                   u.id AS usuario_id, 
                   u.nombre_completo AS usuario_nombre  -- Cambiado a nombre_completo
            FROM historial_promociones hp
            JOIN promociones p ON hp.id_promocion = p.id_promocion
            JOIN detalle_renta r ON hp.id_renta = r.id
            JOIN carros c ON r.id_carro = c.id
            JOIN usuarios u ON hp.id_usuario = u.id
        `;
        db.query(sql, callback);
    }
};

module.exports = PromotionHistoryModel;
