const db = require('../config/database');

const UserHistoryModel = {
    // Crear un nuevo registro
    create: (data, callback) => {
        const query = 'INSERT INTO historial_usuarios SET ?';
        db.query(query, data, callback);
    },

    // Obtener todos los registros
    getAll: (callback) => {
        const query = 'SELECT * FROM historial_usuarios';
        db.query(query, callback);
    },

    // Obtener un registro por ID
    getById: (id, callback) => {
        const query = 'SELECT * FROM historial_usuarios WHERE id_historial = ?';
        db.query(query, [id], callback);
    },

    // Obtener historial de usuarios por ID de usuario
    getByUserId: (userId, callback) => {
        const query = 'SELECT * FROM historial_usuarios WHERE id_usuario = ?';
        db.query(query, [userId], callback);
    },

    // Actualizar un registro
    update: (id, data, callback) => {
        const query = 'UPDATE historial_usuarios SET ? WHERE id_historial = ?';
        db.query(query, [data, id], callback);
    },

    // Eliminar un registro
    delete: (id, callback) => {
        const query = 'DELETE FROM historial_usuarios WHERE id_historial = ?';
        db.query(query, [id], callback);
    }
};

module.exports = UserHistoryModel;
