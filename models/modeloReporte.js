const db = require('../config/database'); 

const Reportes = {
    create: (data, callback) => {
        const sql = `
            INSERT INTO reportes (idusuario, tipo_reporte, descripcion, fecha_generacion)
            VALUES (?, ?, ?, ?)
        `;
        db.query(sql, [data.idusuario, data.tipo_reporte, data.descripcion, new Date()], callback);
    },

    getAll: (callback) => {
        const sql = `SELECT * FROM reportes`;
        db.query(sql, callback);
    },

    getByUser: (userId, callback) => {
        const sql = `SELECT * FROM reportes WHERE idusuario = ?`;
        db.query(sql, [userId], callback);
    },

    delete: (id, callback) => {
        const sql = `DELETE FROM reportes WHERE idreporte = ?`;
        db.query(sql, [id], callback);
    },
};

module.exports = Reportes;
