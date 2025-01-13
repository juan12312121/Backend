const Reportes = require('../models/modeloReporte');

// Crear un nuevo reporte
exports.createReporte = (req, res) => {
    Reportes.create(req.body, (error, results) => {
        if (error) {
            console.error("Error al crear reporte:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(201).json({ id_reporte: results.insertId, ...req.body });
    });
};

// Obtener todos los reportes (solo para administradores)
exports.getAllReportes = (req, res) => {
    Reportes.getAll((error, results) => {
        if (error) {
            console.error("Error al obtener reportes:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json(results);
    });
};

// Obtener reportes por ID de usuario
exports.getReportesByUser = (req, res) => {
    const userId = req.user.id; // Asumiendo que tienes la información del usuario en req.user
    Reportes.getByUser(userId, (error, results) => {
        if (error) {
            console.error("Error al obtener reportes del usuario:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json(results);
    });
};

// Eliminar un reporte
exports.deleteReporte = (req, res) => {
    Reportes.delete(req.params.id, (error, results) => {
        if (error) {
            console.error("Error al eliminar reporte:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.status(200).json({ message: 'Reporte eliminado con éxito' });
    });
};
