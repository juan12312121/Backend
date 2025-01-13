const Devoluciones = require('../models/modeloDevoluciones');

// Crear una nueva devolución
exports.createDevolucion = (req, res) => {
    Devoluciones.create(req.body, (error, results) => {
        if (error) {
            console.error("Error al crear devolución:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(201).json({ id_devolucion: results.insertId, ...req.body });
    });
};

// Obtener todas las devoluciones de un usuario
exports.getAllDevolucionesByUser = (req, res) => {
    const userId = req.user.id; // Asumiendo que tienes la información del usuario en req.user
    Devoluciones.getAllByUser(userId, (error, results) => {
        if (error) {
            console.error("Error al obtener devoluciones:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json(results);
    });
};

// Obtener todas las devoluciones (solo para administradores)
exports.getAllDevoluciones = (req, res) => {
    Devoluciones.getAll((error, results) => {
        if (error) {
            console.error("Error al obtener devoluciones:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json(results);
    });
};

// Eliminar una devolución
exports.deleteDevolucion = (req, res) => {
    Devoluciones.delete(req.params.id, (error, results) => {
        if (error) {
            console.error("Error al eliminar devolución:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Devolución no encontrada' });
        }
        res.status(200).json({ message: 'Devolución eliminada con éxito' });
    });
};
