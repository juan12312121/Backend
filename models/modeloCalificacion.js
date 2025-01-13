const db = require('../config/database');

// Modelo para manejar operaciones con valoraciones
const RatingModel = {
  // Crear una nueva valoración (ya no necesitamos id_renta)
  createValoracion: (id_usuario, id_carro, valoracion, comentario, callback) => {
    const query = 'INSERT INTO valoraciones (id_usuario, id_carro, valoracion, comentario) VALUES (?, ?, ?, ?)';
    db.query(query, [id_usuario, id_carro, valoracion, comentario], callback);
  },

  // Obtener todas las valoraciones
  getAllValoraciones: (callback) => {
    const query = `
      SELECT v.*, u.nombre_usuario
      FROM valoraciones v
      JOIN usuarios u ON v.id_usuario = u.id
    `;
    db.query(query, callback);
  },

  // Obtener una valoración por ID
  getValoracionById: (id, callback) => {
    const query = 'SELECT * FROM valoraciones WHERE id_valoracion = ?';
    db.query(query, [id], callback);
  },

  // Actualizar una valoración (ya no necesitamos id_renta)
  updateValoracion: (id, id_usuario, id_carro, valoracion, comentario, callback) => {
    const query = 'UPDATE valoraciones SET id_usuario = ?, id_carro = ?, valoracion = ?, comentario = ? WHERE id_valoracion = ?';
    db.query(query, [id_usuario, id_carro, valoracion, comentario, id], callback);
  },

  // Eliminar una valoración
 // Eliminar una valoración
deleteValoracion: (id, callback) => {
  const query = 'DELETE FROM valoraciones WHERE id_valoracion = ?';
  db.query(query, [id], callback);
}

};

module.exports = RatingModel;
