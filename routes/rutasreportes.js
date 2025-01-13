const express = require('express');
const router = express.Router();
const db = require('../config/database');  // Asumiendo que config/database.js exporta la conexión DB
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware'); // Importa el middleware

// Ruta para crear el reporte
router.post('/', verifyToken, (req, res) => {
  const { id_reserva, tipo_reporte, descripcion } = req.body;

  // Verifica que los parámetros estén presentes
  if (!id_reserva || !tipo_reporte || !descripcion) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  // Validación del valor del tipo_reporte (comprobar que es uno de los valores del ENUM)
  const tiposPermitidos = ['Incidencia', 'Mantenimiento', 'Observación', 'Otro', 'Devolucion'];
  if (!tiposPermitidos.includes(tipo_reporte)) {
    return res.status(400).json({ message: 'Tipo de reporte inválido' });
  }

  const userId = req.user.id;  // Obtener el ID del usuario desde el JWT decodificado

  // Consulta SQL para insertar el reporte en la base de datos
  const query = `INSERT INTO reportes (id_reserva, tipo_reporte, descripcion, id) 
                 VALUES (?, ?, ?, ?)`; 

  db.execute(query, [id_reserva, tipo_reporte, descripcion, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al crear el reporte' });
    }

    res.status(201).json({ message: 'Reporte creado exitosamente', idreporte: result.insertId });
  });
});

// Ruta para obtener todos los reportes
router.get('/', verifyToken, (req, res) => {
    const query = `SELECT * FROM reportes`;
  
    db.execute(query, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al obtener los reportes' });
      }
  
      res.status(200).json({ reportes: result });
    });
  });
  

  // Ruta para cambiar el estado del reporte a "Arreglado"
router.put('/arreglar/:id', verifyToken, (req, res) => {
    const reporteId = req.params.id;
    
    // Verifica si el reporte existe antes de intentar actualizarlo
    const checkQuery = `SELECT * FROM reportes WHERE idreporte = ?`;
    
    db.execute(checkQuery, [reporteId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al verificar el reporte' });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'Reporte no encontrado' });
      }
  
      // Verifica si el reporte ya está marcado como 'Arreglado'
      const reporte = result[0];
      if (reporte.estado === 'Arreglado') {
        return res.status(400).json({ message: 'El reporte ya está cerrado' });
      }
  
      // Actualiza el estado del reporte a 'Arreglado'
      const updateQuery = `UPDATE reportes SET estado = ? WHERE idreporte = ?`;
  
      db.execute(updateQuery, ['Arreglado', reporteId], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error al actualizar el estado del reporte' });
        }
  
        res.status(200).json({ message: 'Reporte marcado como arreglado exitosamente' });
      });
    });
  });


  router.get('/:id', verifyToken, (req, res) => {
    const reporteId = req.params.id;  // Obtenemos el id del reporte de los parámetros de la URL
  
    // Consulta SQL para obtener el detalle del reporte junto con los datos de reserva, usuario y carro
    const query = `
      SELECT
        r.idreporte,
        r.tipo_reporte,
        r.descripcion,
        r.estado,
        r.fecha_generacion AS fecha_reporte,
        res.id_reserva,
        res.fecha_inicio AS fecha_reserva,
        res.estado_reserva AS detalles_reserva,
        u.id AS id_usuario,
        u.nombre_completo,
        u.correo,
        car.id AS id_carro,
        car.marca,
        car.modelo,
        car.color
      FROM
        reportes r
      JOIN
        reservas res ON r.id_reserva = res.id_reserva
      JOIN
        usuarios u ON r.id = u.id
      JOIN
        carros car ON res.id_carro = car.id
      WHERE
        r.idreporte = ?`;  // Filtramos por el id del reporte específico
  
    // Ejecutar la consulta SQL
    db.execute(query, [reporteId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al obtener el reporte' });
      }
  
      // Si no se encuentra el reporte, retornamos un error 404
      if (result.length === 0) {
        return res.status(404).json({ message: 'Reporte no encontrado' });
      }
  
      // Devolvemos el reporte encontrado con los detalles
      res.status(200).json({ reporte: result[0] });
    });
  });
  
  module.exports = router;
  


