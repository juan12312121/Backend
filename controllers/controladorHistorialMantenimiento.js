const HistorialMantenimiento = require('../models/modeloHistorialMantenimiento'); // Modelo de mantenimiento
const db = require('../config/database'); // Conexión a la base de datos

// Crear un nuevo mantenimiento
exports.createMantenimiento = (req, res) => {
    const { id_carro, fecha_mantenimiento, descripcion, costo } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!id_carro || !fecha_mantenimiento || !descripcion || !costo) {
        return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    HistorialMantenimiento.create(req.body, (error, results) => {
        if (error) {
            console.error("Error al crear mantenimiento:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(201).json({ id_mantenimiento: results.insertId, ...req.body });
    });
};

// Obtener todos los mantenimientos
exports.getAllMantenimientos = (req, res) => {
    HistorialMantenimiento.getAll((error, results) => {
        if (error) {
            console.error("Error al obtener mantenimientos:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json(results);
    });
};

// Obtener mantenimiento por ID
exports.getMantenimientoById = (req, res) => {
    const mantenimientoId = req.params.id;

    HistorialMantenimiento.getById(mantenimientoId, (error, results) => {
        if (error) {
            console.error("Error al obtener mantenimiento:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Mantenimiento no encontrado' });
        }
        res.status(200).json(results[0]);
    });
};

// Actualizar un mantenimiento
exports.updateMantenimiento = (req, res) => {
    const mantenimientoId = req.params.id;

    HistorialMantenimiento.update(mantenimientoId, req.body, (error, results) => {
        if (error) {
            console.error("Error al actualizar mantenimiento:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Mantenimiento no encontrado' });
        }
        res.status(200).json({ message: 'Mantenimiento actualizado con éxito' });
    });
};

// Eliminar un mantenimiento
exports.deleteMantenimiento = (req, res) => {
    const mantenimientoId = req.params.id;

    HistorialMantenimiento.delete(mantenimientoId, (error, results) => {
        if (error) {
            console.error("Error al eliminar mantenimiento:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Mantenimiento no encontrado' });
        }
        res.status(200).json({ message: 'Mantenimiento eliminado con éxito' });
    });
};

// Obtener el total de gastos
exports.getTotalGastos = (req, res) => {
    // Consulta SQL para calcular el total de gastos
    const sql = "SELECT SUM(gastos) AS total_gastos FROM mantenimiento";

    db.query(sql, (error, results) => {
        if (error) {
            console.error("Error al calcular el total de gastos:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        // Si no hay registros, aseguramos que el total sea 0
        const totalGastos = results[0]?.total_gastos || 0;

        // Enviar la respuesta con el total de gastos
        res.status(200).json({ total_gastos: totalGastos });
    });
};
