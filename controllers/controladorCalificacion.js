const RatingModel = require('../models/modeloCalificacion'); // Asegúrate de importar el modelo correctamente

// Crear una nueva valoración (solo usuarios autenticados)
exports.crearValoracion = (req, res) => {
  const { id_carro, valoracion, comentario } = req.body;

  // Asegurarse de que se proporcionen los campos requeridos
  if (!id_carro || !valoracion) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  // Validar que el ID de usuario esté presente (establecido por el middleware de token)
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }

  // Crear la valoración con el ID del usuario autenticado
  RatingModel.createValoracion(req.user.id, id_carro, valoracion, comentario, (err, result) => {
    if (err) {
      console.error('Error al crear la valoración:', err);
      return res.status(500).json({ message: 'Error al crear la valoración', error: err });
    }
    return res.status(201).json({ message: 'Valoración creada con éxito', data: result });
  });
};

// Obtener todas las valoraciones (solo disponible para usuarios autenticados y administradores)
exports.getAllValoraciones = (req, res) => {
  // Solo los administradores o usuarios autenticados pueden ver las valoraciones
  if (!req.user || (!req.user.isAdmin && !req.user.id)) {
    return res.status(403).json({ message: 'Acceso denegado' });
  }

  RatingModel.getAllValoraciones((err, valoraciones) => {
    if (err) {
      console.error('Error al obtener las valoraciones:', err);
      return res.status(500).json({ message: 'Error al obtener las valoraciones', error: err });
    }
    return res.status(200).json({ data: valoraciones });
  });
};

// Obtener una valoración por ID (solo disponible para usuarios autenticados)
exports.getValoracionById = (req, res) => {
  const { id } = req.params;

  // Validar si el usuario está autenticado o si es administrador
  if (!req.user || (!req.user.isAdmin && req.user.id !== id)) {
    return res.status(403).json({ message: 'Acceso denegado' });
  }

  RatingModel.getValoracionById(id, (err, valoracion) => {
    if (err) {
      console.error('Error al obtener la valoración:', err);
      return res.status(500).json({ message: 'Error al obtener la valoración', error: err });
    }
    if (!valoracion) {
      return res.status(404).json({ message: 'Valoración no encontrada' });
    }
    return res.status(200).json({ data: valoracion });
  });
};

// Eliminar una valoración (solo disponible para administradores)
exports.deleteValoracion = (req, res) => {
  const { id } = req.params;

  console.log('Usuario en deleteValoracion:', req.user); // Log para verificar el usuario y su rol

  // Verificar si el rol del usuario es 10 (Administrador)
  if (!req.user || req.user.rol !== 10) {
    console.log('Acceso denegado: el usuario no es administrador');
    return res.status(403).json({ message: 'Acceso denegado' });
  }

  // Llamar al modelo para eliminar la valoración
  RatingModel.deleteValoracion(id, (err, result) => {
    if (err) {
      console.error('Error al eliminar la valoración:', err);
      return res.status(500).json({ message: 'Error al eliminar la valoración', error: err });
    }

    // Si no se ha eliminado ninguna fila, devolver un mensaje de error
    if (result.affectedRows === 0) {
      console.log('Valoración no encontrada');
      return res.status(404).json({ message: 'Valoración no encontrada' });
    }

    console.log('Valoración eliminada con éxito');
    return res.status(200).json({ message: 'Valoración eliminada con éxito' });
  });
};
