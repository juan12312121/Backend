const db = require('../config/database');

const MaintenanceTypeModel = {
    // Crear un nuevo tipo de mantenimiento
    create: (data, callback) => {
        const query = 'INSERT INTO tipos_mantenimiento (nombre, descripcion, frecuencia_recomendada) VALUES (?, ?, ?)';
        db.query(query, [data.nombre, data.descripcion || null, data.frecuencia_recomendada], callback);
    },
    
    // Obtener todos los tipos de mantenimiento
    getAll: (callback) => {
        const query = 'SELECT * FROM tipos_mantenimiento';
        db.query(query, callback);
    },
    
    // Obtener un tipo de mantenimiento por ID
    getById: (id, callback) => {
        const query = 'SELECT * FROM tipos_mantenimiento WHERE id_tipo_mantenimiento = ?';
        db.query(query, [id], callback);
    },
    
    // Actualizar un tipo de mantenimiento
    update: (id, data, callback) => {
        const query = 'UPDATE tipos_mantenimiento SET nombre = ?, descripcion = ?, frecuencia_recomendada = ? WHERE id_tipo_mantenimiento = ?';
        db.query(query, [data.nombre, data.descripcion || null, data.frecuencia_recomendada, id], callback);
    },
    
    // Eliminar un tipo de mantenimiento
    delete: (id, callback) => {
        const query = 'DELETE FROM tipos_mantenimiento WHERE id_tipo_mantenimiento = ?';
        db.query(query, [id], callback);
    },
};

module.exports = MaintenanceTypeModel;
