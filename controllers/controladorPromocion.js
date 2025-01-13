const PromotionModel = require('../models/modeloPromocion');
const db = require('../config/database')



// Crear una nueva promoción
exports.createPromotion = (req, res) => {
    const { codigo_promocion, descripcion, descuento, fecha_inicio, fecha_fin } = req.body;

    // Calcular estado basado en las fechas
    const today = new Date();
    const estado = (new Date(fecha_inicio) <= today && new Date(fecha_fin) >= today) ? 'activo' : 'expirado';

    PromotionModel.createPromotion(codigo_promocion, descripcion, descuento, fecha_inicio, fecha_fin, estado, (error, results) => {
        if (error) {
            console.error('Error al crear promoción:', error);
            return res.status(500).json({ message: 'Error al crear promoción', error: error.message });
        }
        res.status(201).json({
            id_promocion: results.insertId, 
            codigo_promocion, 
            descripcion, 
            descuento, 
            fecha_inicio, 
            fecha_fin, 
            estado
        });
    });
};

// Obtener todas las promociones
exports.getAllPromotions = (req, res) => {
    PromotionModel.getAllPromotions((error, results) => {
        if (error) {
            console.error('Error al obtener promociones:', error);
            return res.status(500).json({ message: 'Error al obtener promociones', error: error.message });
        }
        res.status(200).json(results);
    });
};

// Obtener una promoción por ID
exports.getPromotionById = (req, res) => {
    const { id } = req.params;
    PromotionModel.getPromotionById(id, (error, results) => {
        if (error) {
            console.error('Error al obtener promoción:', error);
            return res.status(500).json({ message: 'Error al obtener promoción', error: error.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Promoción no encontrada' });
        }
        res.status(200).json(results[0]);
    });
};

// Actualizar una promoción
exports.updatePromotion = (req, res) => {
    const { id } = req.params;
    const { codigo_promocion, descripcion, descuento, fecha_inicio, fecha_fin } = req.body;

    // Calcular estado basado en las fechas
    const today = new Date();
    const estado = (new Date(fecha_inicio) <= today && new Date(fecha_fin) >= today) ? 'activo' : 'expirado';

    PromotionModel.updatePromotion(id, codigo_promocion, descripcion, descuento, fecha_inicio, fecha_fin, estado, (error, results) => {
        if (error) {
            console.error('Error al actualizar promoción:', error);
            return res.status(500).json({ message: 'Error al actualizar promoción', error: error.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Promoción no encontrada' });
        }
        res.status(200).json({ message: 'Promoción actualizada exitosamente' });
    });
};

// Eliminar una promoción
exports.deletePromotion = (req, res) => {
    const { id } = req.params;
    PromotionModel.deletePromotion(id, (error, results) => {
        if (error) {
            console.error('Error al eliminar promoción:', error);
            return res.status(500).json({ message: 'Error al eliminar promoción', error: error.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Promoción no encontrada' });
        }
        res.status(204).send(); // 204 No Content
    });
};

// Controller for applying a promotion to a car
exports.applyPromotionToCar = (req, res) => {
    const { idCarro, idPromocion } = req.body;  // assuming you pass these in the request body

    PromotionModel.applyPromotionToCar(idCarro, idPromocion, (error, results) => {
        if (error) {
            console.error('Error al aplicar promoción al carro:', error);
            return res.status(500).json({ message: 'Error al aplicar promoción', error: error.message });
        }
        res.status(200).json({ message: 'Promoción aplicada exitosamente al carro' });
    });
};


// Función para activar una promoción



exports.activatePromotion = (req, res) => {
    const { id_promocion } = req.params;

    console.log('Activando promoción con ID:', id_promocion);

    if (!id_promocion || isNaN(id_promocion)) {
        return res.status(400).json({ message: 'El id_promocion no es válido.' });
    }

    const query = 'UPDATE promociones SET estado = "activo" WHERE id_promocion = ? AND estado = "desactivado"';

    db.query(query, [id_promocion], (error, results) => {
        if (error) {
            console.error('Error al activar la promoción:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
        }

        if (results.affectedRows === 0) {
            return res.status(400).json({ message: 'No se encontró la promoción o ya está activa.' });
        }

        res.status(200).json({ message: 'Promoción activada exitosamente.' });
    });
};


exports.deactivatePromotion = (req, res) => {
    const { idPromocion } = req.body;
  
    // Validar que el parámetro idPromocion está presente
    if (!idPromocion) {
      return res.status(400).json({ message: 'Falta el parámetro obligatorio: idPromocion.' });
    }
  
    console.log('Desactivando promoción con id:', idPromocion);
  
    // Llamar al modelo para desactivar la promoción y actualizar los carros
    PromotionModel.deactivatePromotion(idPromocion, (error, result) => {
      if (error) {
        console.error('Error al desactivar promoción o actualizar carros:', error);
        return res.status(500).json({
          message: 'Error al desactivar la promoción o actualizar los carros',
          error: error.message,
        });
      }
  
      res.status(200).json({
        message: 'Promoción desactivada correctamente y carros actualizados',
        result,
      });
    });
  };
  
exports.applyPromotion = async (req, res) => {
    try {
        const { idCarro, idPromocion } = req.body;

        if (!idCarro || !idPromocion) {
            return res.status(400).json({
                error: 'El ID del carro y el ID de la promoción son obligatorios.',
            });
        }

        if (!Number.isInteger(idCarro) || !Number.isInteger(idPromocion)) {
            return res.status(400).json({
                error: 'El ID del carro y el ID de la promoción deben ser números enteros válidos.',
            });
        }

        PromotionModel.updateCarPriceWithPromotion(idCarro, idPromocion, (err, results) => {
            if (err) {
                console.error('Error al aplicar la promoción:', err);
                return res.status(500).json({
                    error: 'Ocurrió un error al aplicar la promoción.',
                    details: err.message,  // Send the error message for debugging
                });
            }
        
            if (results.affectedRows === 0) {
                // No rows affected, which means either the car wasn't found or the promotion wasn't applied
                return res.status(404).json({
                    message: 'No se encontró el carro especificado o no se pudo aplicar la promoción.',
                });
            }
        
            // If everything is successful
            res.status(200).json({
                message: 'La promoción se aplicó correctamente al carro.',
                results,  // Send the results of the update operation back to the client
            });
        });
        




    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).json({
            error: 'Ocurrió un error inesperado.',
            details: error.message,
        });
    }
};


exports.getPromotionDiscount = (req, res) => {
    const { id_promocion } = req.params;
  
    console.log('ID Promoción en el controlador:', id_promocion); // Log de depuración
  
    PromotionModel.getDiscountById(id_promocion, (err, descuento) => {
      if (err) {
        console.error('Error al obtener el descuento:', err.message);
        return res.status(404).json({ message: err.message });
      }
  
      console.log('Descuento obtenido:', descuento); // Log del resultado exitoso
      res.json({ id_promocion, descuento });
    });
  };

