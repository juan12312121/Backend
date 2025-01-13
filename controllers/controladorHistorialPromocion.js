const PromotionHistoryModel = require('../models/modeloHistorialPromocion');

// Obtener todas las promociones de un usuario
exports.getUserPromotions = (req, res) => {
    const userId = req.user.id; // Obtén el ID del usuario desde el token
    PromotionHistoryModel.getUserPromotions(userId, (err, results) => {
        if (err) {
            console.error('Error obteniendo promociones:', err);
            return res.status(500).json({ message: 'Error obteniendo promociones', error: err.message });
        }
        res.json(results); // Asegúrate de que esta respuesta incluya todos los campos nuevos
    });
};

// Obtener una promoción por ID
exports.getPromotionById = (req, res) => {
    const { id } = req.params;
    PromotionHistoryModel.getById(id, (err, results) => {
        if (err) {
            console.error('Error obteniendo promoción:', err);
            return res.status(500).json({ message: 'Error obteniendo promoción', error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Promoción no encontrada' });
        }
        res.json(results[0]); // Asegúrate de que esta respuesta incluya todos los campos nuevos
    });
};

// Insertar una nueva promoción en el historial
exports.insertPromotion = (req, res) => {
    const { id_promocion, id_usuario, id_renta } = req.body;

    // Validar que los campos necesarios no sean nulos
    if (!id_promocion || !id_usuario || !id_renta) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Formatear la fecha de aplicación
    const fechaAplicacion = new Date().toISOString().slice(0, 19).replace('T', ' '); // '2024-10-08 10:00:00'

    // Inserta el historial de la promoción
    PromotionHistoryModel.insert(id_promocion, id_usuario, id_renta, fechaAplicacion, (err, result) => {
        if (err) {
            console.error('Error al insertar la promoción:', err);
            return res.status(500).json({ message: 'Error al insertar la promoción', error: err.message });
        }
        res.status(201).json({ message: 'Promoción insertada exitosamente', id_historial_promo: result.insertId });
    });
};

// Eliminar un historial de promociones por ID (sólo administrador)
exports.deletePromotionById = (req, res) => {
    const { id } = req.params;
    PromotionHistoryModel.deleteById(id, (err) => {
        if (err) {
            console.error('Error al eliminar la promoción:', err);
            return res.status(500).json({ message: 'Error al eliminar la promoción', error: err.message });
        }
        res.json({ message: 'Promoción eliminada exitosamente' });
    });
};

// Obtener todas las promociones
exports.getAllPromotions = (req, res) => {
    PromotionHistoryModel.getAllPromotions((err, results) => {
        if (err) {
            console.error('Error obteniendo promociones:', err);
            return res.status(500).json({ message: 'Error obteniendo promociones', error: err.message });
        }
        res.json(results); // Asegúrate de que esta respuesta incluya todos los campos nuevos
    });
};
