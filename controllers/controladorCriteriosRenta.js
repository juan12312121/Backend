const CriteriosRenta = require('../models/modeloCriteriosRenta');

// Obtener todos los criterios de renta
exports.getAllCriterios = (req, res) => {
    CriteriosRenta.getAll((error, results) => {
        if (error) {
            console.error("Error al obtener criterios de renta:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json(results);
    });
};

// Crear un nuevo criterio de renta
exports.createCriterio = (req, res) => {
    const { descripcion, min_valoraciones, max_incidencias } = req.body;

    // Validar que los campos requeridos no sean nulos
    if (!descripcion || typeof descripcion !== 'string') {
        return res.status(400).json({ message: 'El campo "descripcion" es requerido y debe ser una cadena.' });
    }
    if (min_valoraciones === undefined || typeof min_valoraciones !== 'number') {
        return res.status(400).json({ message: 'El campo "min_valoraciones" es requerido y debe ser un número.' });
    }
    if (max_incidencias === undefined || typeof max_incidencias !== 'number') {
        return res.status(400).json({ message: 'El campo "max_incidencias" es requerido y debe ser un número.' });
    }

    const newCriterio = {
        descripcion,
        min_valoraciones,
        max_incidencias,
    };

    CriteriosRenta.create(newCriterio, (error, results) => {
        if (error) {
            console.error("Error al crear criterio de renta:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(201).json({ id_criterio: results.insertId, ...newCriterio });
    });
};

// Obtener un criterio de renta por ID
exports.getCriterioById = (req, res) => {
    const criterioId = req.params.id;

    // Validar que el ID sea un número
    if (isNaN(criterioId)) {
        return res.status(400).json({ message: 'El ID del criterio debe ser un número.' });
    }

    CriteriosRenta.getById(criterioId, (error, results) => {
        if (error) {
            console.error("Error al obtener criterio de renta:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Criterio de renta no encontrado' });
        }
        res.status(200).json(results[0]);
    });
};

// Actualizar un criterio de renta
exports.updateCriterio = (req, res) => {
    const criterioId = req.params.id;

    // Validar que el ID sea un número
    if (isNaN(criterioId)) {
        return res.status(400).json({ message: 'El ID del criterio debe ser un número.' });
    }

    // Validar campos requeridos
    const { descripcion, min_valoraciones, max_incidencias } = req.body;

    if (descripcion && typeof descripcion !== 'string') {
        return res.status(400).json({ message: 'El campo "descripcion" debe ser una cadena.' });
    }
    if (min_valoraciones !== undefined && typeof min_valoraciones !== 'number') {
        return res.status(400).json({ message: 'El campo "min_valoraciones" debe ser un número.' });
    }
    if (max_incidencias !== undefined && typeof max_incidencias !== 'number') {
        return res.status(400).json({ message: 'El campo "max_incidencias" debe ser un número.' });
    }

    // Crear el objeto para actualizar
    const updatedCriterio = {
        descripcion,
        min_valoraciones,
        max_incidencias
    };

    CriteriosRenta.update(criterioId, updatedCriterio, (error, results) => {
        if (error) {
            console.error("Error al actualizar criterio de renta:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Criterio de renta no encontrado' });
        }
        res.status(200).json({ message: 'Criterio de renta actualizado con éxito' });
    });
};

// Eliminar un criterio de renta
exports.deleteCriterio = (req, res) => {
    const criterioId = req.params.id;

    // Validar que el ID sea un número
    if (isNaN(criterioId)) {
        return res.status(400).json({ message: 'El ID del criterio debe ser un número.' });
    }

    CriteriosRenta.delete(criterioId, (error, results) => {
        if (error) {
            console.error("Error al eliminar criterio de renta:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Criterio de renta no encontrado' });
        }
        res.status(200).json({ message: 'Criterio de renta eliminado con éxito' });
    });
};
