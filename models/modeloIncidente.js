const db = require('../config/database');

// Modelo para manejar operaciones con incidencias
const IncidentModel = {
  // Crear una nueva incidencia
  createIncidencia: (id_renta, descripcion, fecha_incidencia, estado, callback) => {
    const query = 'INSERT INTO incidencias (id_renta, descripcion, fecha_incidencia, estado) VALUES (?, ?, ?, ?)';
    db.query(query, [id_renta, descripcion, fecha_incidencia, estado], callback);
  },

  // Obtener todas las incidencias (solo para administradores)
  getAllIncidencias: (callback) => {
    const query = 'SELECT * FROM incidencias';
    db.query(query, callback);
  },

  // Obtener incidencias de un usuario por ID de renta (para usuarios)
  getIncidenciasByUserId: (id_usuario, callback) => {
    const query = `
      SELECT i.* 
      FROM incidencias i
      JOIN rentas r ON i.id_renta = r.id_renta
      WHERE r.id_usuario = ?`;
    db.query(query, [id_usuario], callback);
  },

  // Obtener una incidencia por ID
  getIncidenciaById: (id_incidencia, callback) => {
    const query = 'SELECT * FROM incidencias WHERE id_incidencia = ?';
    db.query(query, [id_incidencia], callback);
  },

  // Actualizar una incidencia
  updateIncidencia: (id_incidencia, descripcion, estado, callback) => {
    const query = `
      UPDATE incidencias 
      SET descripcion = ?, estado = ?
      WHERE id_incidencia = ?`;
    db.query(query, [descripcion, estado, id_incidencia], callback);
  },

  // Eliminar una incidencia
  deleteIncidencia: (id_incidencia, callback) => {
    const query = 'DELETE FROM incidencias WHERE id_incidencia = ?';
    db.query(query, [id_incidencia], callback);
  }
};

module.exports = IncidentModel;
