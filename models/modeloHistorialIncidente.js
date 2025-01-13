const db = require('../config/database');

// Obtener todas las incidencias
exports.getAllIncidencias = (callback) => {
    const sql = `
        SELECT 
            i.id_incidencia, i.descripcion AS descripcion_incidencia, i.fecha_incidencia, i.estado, i.fecha_creacion,
            u.nombre_completo AS nombre_usuario, 
            c.marca, c.modelo, c.anio, 
            r.fecha_inicio, r.fecha_fin
        FROM 
            incidencias i
        JOIN 
            detalle_renta r ON i.id_renta = r.id
        JOIN 
            usuarios u ON r.id_usuario = u.id
        JOIN 
            carros c ON r.id_carro = c.id
    `;
    db.query(sql, callback);
};

// Obtener incidencias por ID de usuario
exports.getIncidenciasByUserId = (userId, callback) => {
    const sql = `
        SELECT 
            i.id_incidencia, i.descripcion AS descripcion_incidencia, i.fecha_incidencia, i.estado, i.fecha_creacion,
            u.nombre_completo AS nombre_usuario, 
            c.marca, c.modelo, c.anio, 
            r.fecha_inicio, r.fecha_fin
        FROM 
            incidencias i
        JOIN 
            detalle_renta r ON i.id_renta = r.id
        JOIN 
            usuarios u ON r.id_usuario = u.id
        JOIN 
            carros c ON r.id_carro = c.id
        WHERE 
            u.id = ?
    `;
    db.query(sql, [userId], callback);
};

// Obtener una incidencia por ID
exports.getIncidenciaById = (id, callback) => {
    const sql = `
        SELECT 
            i.id_incidencia, i.descripcion AS descripcion_incidencia, i.fecha_incidencia, i.estado, i.fecha_creacion,
            u.nombre_completo AS nombre_usuario, 
            c.marca, c.modelo, c.anio, 
            r.fecha_inicio, r.fecha_fin
        FROM 
            incidencias i
        JOIN 
            detalle_renta r ON i.id_renta = r.id
        JOIN 
            usuarios u ON r.id_usuario = u.id
        JOIN 
            carros c ON r.id_carro = c.id
        WHERE 
            i.id_incidencia = ?
    `;
    db.query(sql, [id], callback);
};

// Insertar historial de incidencias
exports.insertHistorialIncidencia = (userId, rentaId, incidenciaId, fechaIncidencia, callback) => {
    const sql = `INSERT INTO historial_incidencias (id_usuario, id_renta, id_incidencia, fecha_incidencia) VALUES (?, ?, ?, ?)`;
    db.query(sql, [userId, rentaId, incidenciaId, fechaIncidencia], callback);
};
