const IncidentModel = require('../models/modeloIncidente');

// Función para manejar errores de manera uniforme
const handleError = (res, err, customMessage) => {
    console.error(err);
    const message = customMessage || 'Ocurrió un error inesperado';
    return res.status(500).json({ message });
};

// Crear una nueva incidencia
exports.createIncidencia = (req, res) => {
    const { id_renta, descripcion, fecha_incidencia, estado } = req.body;

    // Validación de campos obligatorios
    if (!id_renta || !descripcion || !fecha_incidencia || !estado) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Crear la incidencia
    IncidentModel.createIncidencia(id_renta, descripcion, fecha_incidencia, estado, (err, result) => {
        if (err) {
            return handleError(res, err, 'Error al crear la incidencia');
        }
        return res.status(201).json({ message: 'Incidencia creada con éxito', data: result });
    });
};

// Obtener todas las incidencias (solo para administradores)
exports.getAllIncidencias = (req, res) => {
    IncidentModel.getAllIncidencias((err, incidencias) => {
        if (err) {
            return handleError(res, err, 'Error al obtener las incidencias');
        }
        return res.status(200).json({ data: incidencias });
    });
};

// Obtener incidencias de un usuario por ID de usuario
exports.getIncidenciasByUserId = (req, res) => {
    const userId = req.user.id;

    IncidentModel.getIncidenciasByUserId(userId, (err, incidencias) => {
        if (err) {
            return handleError(res, err, 'Error al obtener las incidencias del usuario');
        }
        return res.status(200).json({ data: incidencias });
    });
};

// Obtener una incidencia por ID
exports.getIncidenciaById = (req, res) => {
    const { id } = req.params;

    IncidentModel.getIncidenciaById(id, (err, incidencia) => {
        if (err) {
            return handleError(res, err, 'Error al obtener la incidencia');
        }
        if (!incidencia) {
            return res.status(404).json({ message: 'Incidencia no encontrada' });
        }
        return res.status(200).json({ data: incidencia });
    });
};
