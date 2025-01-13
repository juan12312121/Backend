const db = require('../config/database');

// Modelo para manejar operaciones con seguros
const InsuranceModel = {
  // Crear un nuevo seguro
  createInsurance: (nombre, tipo, costo, callback) => {
    const query = 'INSERT INTO seguros (nombre, tipo, costo) VALUES (?, ?, ?)';
    db.query(query, [nombre, tipo, costo], callback);
  },

  // Obtener todos los seguros
  getAllInsurances: (callback) => {
    const query = 'SELECT * FROM seguros';
    db.query(query, callback);
  },

  // Obtener un seguro por ID
  getInsuranceById: (id, callback) => {
    const query = 'SELECT * FROM seguros WHERE id_seguro = ?';
    db.query(query, [id], callback);
  },

  // Actualizar un seguro
  updateInsurance: (id, nombre, tipo, costo, callback) => {
    const query = 'UPDATE seguros SET nombre = ?, tipo = ?, costo = ? WHERE id_seguro = ?';
    db.query(query, [nombre, tipo, costo, id], callback);
  },

  // Eliminar un seguro
  deleteInsurance: (id, callback) => {
    const query = 'DELETE FROM seguros WHERE id_seguro = ?';
    db.query(query, [id], callback);
  }
};

module.exports = InsuranceModel;
