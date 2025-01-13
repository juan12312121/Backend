const db = require('../config/database');

const UserHistoryModel = {
    // Crear un nuevo registro en el historial
    create: (data, callback) => {
        const query = 'INSERT INTO historial_usuarios (id_usuario, accion, fecha) VALUES (?, ?, ?)';
        db.query(query, [data.id_usuario, data.accion, data.fecha], callback);
    }
    ,
    
    // Obtener todos los registros del historial
    getAll: (callback) => {
        const query = 'SELECT * FROM historial_usuarios';
        db.query(query, callback);
    },
    
    // Obtener un registro del historial por ID
    getById: (id, callback) => {
        const query = 'SELECT * FROM historial_usuarios WHERE id_historial = ?';
        db.query(query, [id], callback);
    },

    // Método para obtener el historial por ID de usuario
    getByUserId: (userId, callback) => {
        const sql = 'SELECT * FROM historial_usuarios WHERE id_usuario = ?';
        db.query(sql, [userId], callback);
    },

    // Actualizar un registro en el historial
    update: (id, data, callback) => {
        const query = 'UPDATE historial_usuarios SET id_usuario = ?, accion = ? WHERE id_historial = ?';
        db.query(query, [data.id_usuario, data.accion, id], callback);
    },
    
    // Eliminar un registro del historial
    delete: (id, callback) => {
        const query = 'DELETE FROM historial_usuarios WHERE id_historial = ?';
        db.query(query, [id], callback);
    },
};

module.exports = UserHistoryModel;
