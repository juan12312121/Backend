const db = require('../config/database');

const Reservation = {
  createReservation: async (req, res) => {
    const {
      id_usuario,
      id_carro,
      fecha_inicio,
      fecha_fin,
      monto_reserva,
      tipo_reserva,
      estado_reserva,
      estado_pago,
      entrega,
      direccion_entrega, // Nuevo campo para la dirección de entrega
    } = req.body;
  
    const connection = await db.promise().getConnection();
  
    try {
      // Iniciar la transacción
      await connection.beginTransaction();
  
      // Verificar si el carro ya está reservado en el rango de fechas proporcionado,
      // excluyendo las reservas rechazadas
      const checkQuery = `
        SELECT * FROM reservas
        WHERE id_carro = ? 
        AND estado_reserva != 'Cancelada' 
        AND (estado_reserva != 'Rechazada' OR estado_reserva IS NULL)
        AND (
            (fecha_inicio BETWEEN ? AND ?) OR  // Si la nueva fecha de inicio se cruza
            (fecha_fin BETWEEN ? AND ?) OR    // Si la nueva fecha de fin se cruza
            (fecha_inicio <= ? AND fecha_fin >= ?)  // Para cubrir casos en los que las fechas se crucen parcialmente
        )
      `;
  
      const [checkResult] = await connection.query(checkQuery, [
        id_carro, fecha_inicio, fecha_fin, fecha_inicio, fecha_fin, fecha_inicio, fecha_fin
      ]);
  
      if (checkResult.length > 0) {
        return res.status(400).json({
          message: 'Este carro ya está reservado o tiene una reserva activa.',
        });
      }
  
      // Actualizar la disponibilidad del carro a 'Rentado' antes de crear la reserva
      const updateQuery = `
        UPDATE carros
        SET disponibilidad = 'Rentado'
        WHERE id = ?
      `;
      await connection.query(updateQuery, [id_carro]);
  
      // Insertar la nueva reserva
      const query = `
        INSERT INTO reservas (
            id_usuario, 
            id_carro, 
            fecha_inicio, 
            fecha_fin, 
            monto_reserva, 
            tipo_reserva, 
            estado_reserva, 
            estado_pago, 
            entrega,
            direccion_entrega
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      const [insertResult] = await connection.query(query, [
        id_usuario,
        id_carro,
        fecha_inicio,
        fecha_fin,
        monto_reserva,
        tipo_reserva,
        estado_reserva,
        estado_pago,
        entrega,
        direccion_entrega,
      ]);
  
      // Confirmar la transacción
      await connection.commit();
  
      // Devolver respuesta exitosa
      return res.status(201).json({
        message: 'Reserva creada exitosamente',
        id_reserva: insertResult.insertId,
      });
  
    } catch (err) {
      // Si ocurre un error, revertir la transacción
      await connection.rollback();
  
      console.error('Error:', err);
      return res.status(500).json({
        message: 'Ocurrió un error al procesar la reserva',
        error: err.message,
      });
    } finally {
      // Liberar la conexión
      connection.release();
    }
  },
  
  
  

  getAll: (callback) => {
    const query = `
      SELECT 
          r.id_reserva, 
          r.id_usuario, 
          r.id_chofer, 
          r.id_carro, 
          c.marca, 
          c.modelo, 
          c.color, 
          r.tipo_reserva, 
          r.fecha_inicio, 
          r.fecha_fin, 
          r.estado_reserva, 
          r.entrega, 
          r.monto_reserva, 
          r.fecha_creacion, 
          r.estado_pago,
          r.estado_recogida_usuario, -- Campo adicional
          r.lugar_devolucion,        -- Campo adicional
          r.direccion_entrega,       -- Incluir direccion_entrega
          u.nombre_completo AS usuario
      FROM reservas r
      LEFT JOIN usuarios u ON r.id_usuario = u.id
      LEFT JOIN carros c ON r.id_carro = c.id
    `;
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error al obtener todas las reservas:', err);
        return callback(err, null);
      }
      callback(null, result);
    });
  },
  



  getByUserId: (userId, callback) => {
    const query = `
      SELECT 
          r.id_reserva, 
          r.id_usuario, 
          r.id_chofer, 
          r.id_carro, 
          c.marca, 
          c.modelo, 
          c.color, 
          c.imagen, 
          r.tipo_reserva, 
          r.fecha_inicio, 
          r.fecha_fin, 
          r.estado_reserva, 
          r.entrega, 
          r.monto_reserva, 
          r.fecha_creacion, 
          r.estado_pago,
          r.estado_recogida_usuario,   
          r.direccion_entrega,
          r.lugar_devolucion,         
          u.nombre_completo AS usuario
      FROM reservas r
      LEFT JOIN usuarios u ON r.id_usuario = u.id
      LEFT JOIN carros c ON r.id_carro = c.id
      WHERE r.id_usuario = ?;
  `;

    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Error al obtener las reservas del usuario:', err);
        return callback(err, null);
      }
      callback(null, result);
    });
  },



  updateStatus: (reservationId, status, callback) => {
    const query = `
      UPDATE reservas 
      SET estado_reserva = ?
      WHERE id_reserva = ?
    `;
    db.query(query, [status, reservationId], (err, result) => {
      if (err) {
        console.error('Error al actualizar el estado de la reserva:', err);
        return callback(err, null);
      }
      callback(null, result);
    });
  },

  delete: (reservationId, callback) => {
    const query = `
      DELETE FROM reservas
      WHERE id_reserva = ?
    `;
    db.query(query, [reservationId], (err, result) => {
      if (err) {
        console.error('Error al eliminar la reserva:', err);
        return callback(err, null);
      }
      callback(null, result);
    });
  },

  getReservationTypes: (req, res) => {
    console.log("Obteniendo tipos de reserva...");

    if (!req || !res) {
      console.error('Request or Response is undefined');
      return;
    }

    const query = `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'reservas' AND COLUMN_NAME = 'tipo_reserva'`;

    db.query(query, (err, result) => {
      if (err) {
        console.error('Error al obtener los tipos de reserva:', err);
        return res.status(500).json({ message: 'Error al obtener los tipos de reserva', error: err.message });
      }

      if (result.length > 0) {
        const enumValues = result[0].COLUMN_TYPE
          .replace("enum(", "")
          .replace(")", "")
          .replace(/'/g, "")
          .split(",");

        console.log("Valores de enum:", enumValues);
        return res.status(200).json(enumValues);
      }

      console.log("No se encontraron tipos de reserva.");
      return res.status(404).json({ message: "No se encontraron tipos de reserva." });
    });
  },

  cancelReservation: (reservationId, callback) => {
    const query = `
      UPDATE reservas 
      SET estado_reserva = 'Cancelada'
      WHERE id_reserva = ?
    `;
    db.query(query, [reservationId], (err, result) => {
      if (err) {
        console.error('Error al cancelar la renta:', err);
        return callback(err, null);
      }
      callback(null, {
        message: 'Reserva cancelada exitosamente',
        affectedRows: result.affectedRows
      });
    });
  },

  // Nuevo método para aceptar una reserva
  acceptReservation: (reservationId, callback) => {
    const query = `
      UPDATE reservas 
      SET estado_reserva = 'Aceptada'
      WHERE id_reserva = ?
    `;
    db.query(query, [reservationId], (err, result) => {
      if (err) {
        console.error('Error al aceptar la reserva:', err);
        return callback(err, null);
      }
      callback(null, {
        message: 'Reserva aceptada exitosamente',
        affectedRows: result.affectedRows
      });
    });
  },

  assignDriver: (reservationId, driverId, callback) => {
    const query = `
      UPDATE reservas 
      SET id_chofer = ? 
      WHERE id_reserva = ?
    `;
    db.query(query, [driverId, reservationId], (err, result) => {
      if (err) {
        console.error('Error al asignar un chofer a la reserva:', err);
        return callback(err, null);
      }

      // Después de asignar el chofer, actualizamos el estado_recogida_usuario
      const updateEstadoQuery = `
        UPDATE reservas 
        SET estado_recogida_usuario = 'En camino'
        WHERE id_reserva = ? AND id_chofer IS NOT NULL
      `;
      db.query(updateEstadoQuery, [reservationId], (err, updateResult) => {
        if (err) {
          console.error('Error al actualizar estado_recogida_usuario:', err);
          return callback(err, null);
        }

        callback(null, {
          message: 'Chofer asignado y estado actualizado exitosamente',
          affectedRows: result.affectedRows
        });
      });
    });
  },



  // Modelo para actualizar el estado de entrega de la reserva
  updateCarDeliveryStatus: (reservationId, deliveryStatus, callback) => {
    // Validar que los parámetros sean correctos
    if (!reservationId || !deliveryStatus) {
      return callback(new Error('El ID de reserva y el estado de entrega son obligatorios'), null);
    }

    // Comprobar que el estado de entrega esté dentro de los valores permitidos
    const validStatuses = ['Pendiente', 'Entregado', 'Devuelto'];
    if (!validStatuses.includes(deliveryStatus)) {
      return callback(new Error('El estado de entrega no es válido'), null);
    }

    // Consulta SQL para actualizar el estado de entrega
    const query = `
      UPDATE reservas 
      SET estado_entrega = ? 
      WHERE id_reserva = ?
    `;

    // Ejecutar la consulta
    db.query(query, [deliveryStatus, reservationId], (err, result) => {
      if (err) {
        // Log del error con más detalles
        console.error('Error al actualizar el estado de entrega del carro:', err);
        return callback(err, null);
      }

      // Si no se encontraron filas afectadas, devolver un error
      if (result.affectedRows === 0) {
        return callback(new Error('No se encontró la reserva con el ID especificado'), null);
      }

      // Si todo fue exitoso, devolver el mensaje de éxito
      callback(null, {
        message: 'Estado de entrega actualizado exitosamente',
        affectedRows: result.affectedRows
      });
    });
  },



  // Método para obtener detalles de una reserva (incluyendo el chofer asignado)
  getReservationDetails: (reservationId, callback) => {
    const query = `
      SELECT 
        r.id_reserva, 
        r.estado_reserva, 
        r.fecha_inicio, 
        r.fecha_fin, 
        r.monto_reserva, 
        r.tipo_reserva, 
        r.estado_entrega,
        c.marca, 
        c.modelo, 
        c.color, 
        c.placas, 
        u.nombre_completo AS usuario,
        d.nombre_completo AS chofer
      FROM reservas r
      JOIN usuarios u ON r.id_usuario = u.id
      JOIN carros c ON r.id_carro = c.id
      LEFT JOIN choferes d ON r.id_chofer = d.id
      WHERE r.id_reserva = ?
    `;
    db.query(query, [reservationId], (err, result) => {
      if (err) {
        console.error('Error al obtener detalles de la reserva:', err);
        return callback(err, null);
      }
      if (result.length === 0) {
        return callback(null, { message: 'No se encontró la reserva' });
      }
      callback(null, result[0]); // Retornar la reserva encontrada
    });
  },

  getByDriverId: (driverId, callback) => {
    const query = `
      SELECT 
        r.id_reserva,
        u.nombre_completo AS usuario,  -- Cambiado a 'nombre_usuario'
        c.marca,
        c.modelo,
        c.color,
        r.tipo_reserva,
        r.fecha_inicio,
        r.fecha_fin,
        r.estado_reserva,
        r.monto_reserva,
        r.entrega  -- Incluir columna entrega
      FROM reservas r
      JOIN usuarios u ON r.id_usuario = u.id
      JOIN carros c ON r.id_carro = c.id  -- Relación correcta entre reservas y carros
      WHERE r.id_chofer = ?
    `;

    db.query(query, [driverId], (err, result) => {
      if (err) {
        console.error('Error al obtener reservas asignadas al chofer:', err);
        return callback(err, null);
      }
      callback(null, result);
    });
  },

  getReservationById: (reservationId, callback) => {
    const query = `
    SELECT 
      r.id_reserva, 
      u.nombre_completo AS usuario, 
      r.monto_reserva, 
      r.fecha_inicio, 
      r.fecha_fin, 
      r.tipo_reserva, 
      c.marca, 
      c.modelo, 
      c.color, 
      c.placas 
    FROM reservas r
    JOIN usuarios u ON r.id_usuario = u.id
    JOIN carros c ON r.id_carro = c.id
    WHERE r.id_reserva = ?
  `;

    db.query(query, [reservationId], (err, result) => {
      if (err) {
        console.error('Error al obtener los detalles de la reserva:', err);
        return callback(err, null);
      }

      // Si no se encuentra ninguna reserva con ese ID
      if (result.length === 0) {
        return callback(null, { message: 'No se encontró la reserva con el ID especificado' });
      }

      // Si se encuentra la reserva, retornar el primer resultado
      callback(null, result[0]);
    });
  },


};

module.exports = Reservation;
