const db = require('../config/database');

// Modelo para manejar operaciones con promociones
const PromotionModel = {
  // Crear una nueva promoción
  createPromotion: (codigo_promocion, descripcion, descuento, fecha_inicio, fecha_fin, estado, callback) => {
    const query = 'INSERT INTO promociones (codigo_promocion, descripcion, descuento, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [codigo_promocion, descripcion, descuento, fecha_inicio, fecha_fin, estado], callback);
  },

  // Obtener todas las promociones
  getAllPromotions: (callback) => {
    const query = 'SELECT * FROM promociones';
    db.query(query, callback);
  },

  // Obtener una promoción por ID
  getPromotionById: (id, callback) => {
    const query = 'SELECT * FROM promociones WHERE id_promocion = ?';
    db.query(query, [id], callback);
  },

  // Actualizar una promoción
  updatePromotion: (id, codigo_promocion, descripcion, descuento, fecha_inicio, fecha_fin, estado, callback) => {
    const query = 'UPDATE promociones SET codigo_promocion = ?, descripcion = ?, descuento = ?, fecha_inicio = ?, fecha_fin = ?, estado = ? WHERE id_promocion = ?';
    db.query(query, [codigo_promocion, descripcion, descuento, fecha_inicio, fecha_fin, estado, id], callback);
  },

  // Eliminar una promoción
  deletePromotion: (id, callback) => {
    const query = 'DELETE FROM promociones WHERE id_promocion = ?';
    db.query(query, [id], callback);
  },

  // Función para aplicar una promoción a un carro
  applyPromotionToCar: (idCarro, idPromocion, callback) => {
    // Primero verificamos si la promoción existe
    const query = 'SELECT * FROM promociones WHERE id_promocion = ?';
    db.query(query, [idPromocion], (err, results) => {
      if (err) {
        return callback(err);
      }
      if (results.length === 0) {
        return callback(new Error('Promoción no encontrada'));
      }

      // Si la promoción existe, actualizamos el carro
      const updateQuery = 'UPDATE catalogo SET id_promocion = ? WHERE idauto = ?';
      db.query(updateQuery, [idPromocion, idCarro], callback);
    });
  },

  // Función para actualizar el estado de la promoción
  updatePromotionStatus: (id, estado, callback) => {
    const query = 'UPDATE promociones SET estado = ? WHERE id_promocion = ?';
    db.query(query, [estado, id], callback);
  },
  
  activatePromotion : (idPromocion, callback) => {
    const queryCheck = `SELECT estado FROM promociones WHERE id_promocion = ?`;

    // Primero verificar si la promoción ya está activa
    db.query(queryCheck, [idPromocion], (error, results) => {
        if (error) {
            console.error('Error al verificar el estado de la promoción:', error);
            return callback(error);
        }

        if (results.length === 0) {
            return callback(null, { affectedRows: 0 });
        }

        const estadoActual = results[0].estado;

        // Si la promoción ya está activa, no se hace nada
        if (estadoActual === 'activo') {
            return callback(null, { affectedRows: 0 });
        }

        // Si no está activa, proceder con el UPDATE
        const query = `
            UPDATE promociones
            SET estado = 'activo'
            WHERE id_promocion = ?
        `;

        db.query(query, [idPromocion], (error, results) => {
            callback(error, results);
        });
    });
},

deactivatePromotion: (idPromocion, callback) => {
  // Iniciar la transacción
  const queryTransactionStart = 'START TRANSACTION;';
  const queryRollback = 'ROLLBACK;';
  const queryCommit = 'COMMIT;';

  // Query para actualizar el precio diario a precio original antes de desactivar la promoción
  const queryUpdateCarPrice = `
    UPDATE carros
    SET precio_diaro = precio_original
    WHERE id_promocion = ?;
  `;

  // Query para desactivar la promoción
  const queryDeactivatePromotion = `
    UPDATE promociones
    SET estado = 'desactivado'
    WHERE id_promocion = ?;
  `;

  // Query para actualizar los carros afectados (quitar la promoción)
  const queryUpdateCarsPromotion = `
    UPDATE carros
    SET id_promocion = NULL, promocion = 'Sin promoción'
    WHERE id_promocion = ?;
  `;

  // Iniciar la transacción
  db.query(queryTransactionStart, (error) => {
    if (error) {
      console.error('Error al iniciar la transacción:', error);
      return callback(error);
    }

    // Primero, actualizar los precios de los carros afectados
    db.query(queryUpdateCarPrice, [idPromocion], (error, priceUpdateResults) => {
      if (error) {
        console.error('Error al actualizar los precios de los carros:', error);
        // Si ocurre un error, revertir la transacción
        return db.query(queryRollback, () => callback(error));
      }

      // Desactivar la promoción
      db.query(queryDeactivatePromotion, [idPromocion], (error, results) => {
        if (error) {
          console.error('Error al desactivar la promoción:', error);
          return db.query(queryRollback, () => callback(error));
        }

        // Actualizar los carros que tenían la promoción
        db.query(queryUpdateCarsPromotion, [idPromocion], (error, updateResults) => {
          if (error) {
            console.error('Error al actualizar los carros:', error);
            return db.query(queryRollback, () => callback(error));
          }

          // Hacer commit de la transacción si todo salió bien
          db.query(queryCommit, (error) => {
            if (error) {
              console.error('Error al hacer commit de la transacción:', error);
              return callback(error);
            }

            // Retornar los resultados al callback
            callback(null, { 
              affectedRows: results.affectedRows, 
              updateAffectedRows: updateResults.affectedRows,
              priceUpdatedRows: priceUpdateResults.affectedRows
            });
          });
        });
      });
    });
  });
},





updateCarPriceWithPromotion: (idCarro, idPromocion, callback) => {
  // Consulta para obtener el descuento de la promoción
  const getPromotionQuery = `
      SELECT descuento, estado FROM promociones WHERE id_promocion = ?
  `;

  db.query(getPromotionQuery, [idPromocion], (err, promotionResults) => {
      if (err) {
          return callback(err);
      }

      if (promotionResults.length === 0) {
          return callback(new Error('Promoción no encontrada.'));
      }

      const promocion = promotionResults[0];
      
      // Verifica si la promoción está activa
      if (promocion.estado !== 'activo') {
          return callback(new Error('La promoción no está activa.'));
      }

      const descuento = promocion.descuento;

      // Consulta para actualizar el precio del carro con el descuento
      const updateCarPriceQuery = `
          UPDATE carros
          SET 
              precio_original = IF(precio_original IS NULL, precio_diaro, precio_original), 
              precio_diaro = CASE 
                  WHEN precio_diaro - (precio_diaro * ? / 100) < 0 THEN 0 
                  ELSE ROUND(precio_diaro - (precio_diaro * ? / 100), 0) -- Redondeo sin centavos
              END,
              promocion = 'En promoción',
              id_promocion = ?  -- Asignar el id_promocion al carro
          WHERE id = ?
      `;

      db.query(updateCarPriceQuery, [descuento, descuento, idPromocion, idCarro], (err, results) => {
          if (err) {
              return callback(err);
          }

          // Actualizar la promoción a 'activo' si no lo está
          const updatePromotionQuery = `
              UPDATE promociones 
              SET estado = 'activo' 
              WHERE id_promocion = ?
          `;
          
          db.query(updatePromotionQuery, [idPromocion], (err) => {
              if (err) {
                  return callback(err);
              }

              // Consulta para obtener el estado actualizado del carro
              const getCarStatusQuery = `
                  SELECT id, marca, modelo, precio_diaro, promocion, id_promocion
                  FROM carros
                  WHERE id = ?
              `;

              db.query(getCarStatusQuery, [idCarro], (err, carResults) => {
                  if (err) {
                      return callback(err);
                  }

                  if (carResults.length === 0) {
                      return callback(new Error('Carro no encontrado.'));
                  }

                  // Formatear el precio como moneda SIN centavos
                  const formatCurrencyWithoutCents = (value) => {
                      return new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: 'MXN',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                      }).format(value);
                  };

                  const updatedCar = carResults[0];
                  updatedCar.precio_diaro = formatCurrencyWithoutCents(updatedCar.precio_diaro); // Formatea como MX$383 (sin centavos)

                  // Retorna el estado actualizado del carro
                  callback(null, {
                      message: 'El precio del carro y el estado de la promoción se actualizaron correctamente.',
                      carro: updatedCar
                  });
              });
          });
      });
  });
},



getDiscountById: (idPromocion, callback) => {
  const query = `
    SELECT descuento
    FROM promociones
    WHERE id_promocion = ? AND estado = 'activo'
  `;

  console.log('Consulta SQL:', query); // Log de la consulta
  console.log('Parámetros enviados:', idPromocion); // Log del parámetro

  db.query(query, [idPromocion], (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL:', err);
      return callback(err);
    }

    console.log('Resultados de la consulta:', results); // Log de los resultados

    if (results.length === 0) {
      return callback(new Error('Promoción no encontrada o no activa.'));
    }

    const descuento = results[0].descuento;
    callback(null, descuento);
  });
}




};




module.exports = PromotionModel;
