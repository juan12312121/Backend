const HistorialIncidenciasModel = require('../models/modeloHistorialIncidente');

// Obtener todas las incidencias (solo para administradores)
exports.getAllIncidencias = (req, res) => {
    HistorialIncidenciasModel.getAllIncidencias((err, incidencias) => {
        if (err) {
            console.error('Error al obtener las incidencias:', err);
            return res.status(500).json({ message: 'Error al obtener las incidencias' });
        }

        // Guardar en historial_incidencias para cada incidencia obtenida
        incidencias.forEach(incidencia => {
            HistorialIncidenciasModel.insertHistorialIncidencia(
                incidencia.id_usuario,  // Asegúrate de tener esta propiedad en tu resultado
                incidencia.id_renta,    // Asegúrate de tener esta propiedad en tu resultado
                incidencia.id_incidencia,
                incidencia.fecha_incidencia,
                (err) => {
                    if (err) {
                        console.error('Error al insertar en historial_incidencias:', err);
                    }
                }
            );
        });

        return res.status(200).json({ data: incidencias });
    });
};

// Obtener incidencias por ID de usuario
exports.getIncidenciasByUserId = (req, res) => {
    const userId = req.user.id; // Asegúrate de que el ID del usuario esté disponible en el token
    HistorialIncidenciasModel.getIncidenciasByUserId(userId, (err, incidencias) => {
        if (err) {
            console.error('Error al obtener las incidencias del usuario:', err);
            return res.status(500).json({ message: 'Error al obtener las incidencias' });
        }

        // Guardar en historial_incidencias para cada incidencia obtenida
        incidencias.forEach(incidencia => {
            HistorialIncidenciasModel.insertHistorialIncidencia(
                userId,                // ID del usuario autenticado
                incidencia.id_renta,    // Asegúrate de tener esta propiedad en tu resultado
                incidencia.id_incidencia,
                incidencia.fecha_incidencia,
                (err) => {
                    if (err) {
                        console.error('Error al insertar en historial_incidencias:', err);
                    }
                }
            );
        });

        return res.status(200).json({ data: incidencias });
    });
};

// Obtener una incidencia por ID
exports.getIncidenciaById = (req, res) => {
    const { id } = req.params;
    HistorialIncidenciasModel.getIncidenciaById(id, (err, incidencia) => {
        if (err) {
            console.error('Error al obtener la incidencia:', err);
            return res.status(500).json({ message: 'Error al obtener la incidencia' });
        }
        if (!incidencia) {
            return res.status(404).json({ message: 'Incidencia no encontrada' });
        }

        // Guardar en historial_incidencias
        HistorialIncidenciasModel.insertHistorialIncidencia(
            incidencia.id_usuario,   // Asegúrate de tener esta propiedad en tu resultado
            incidencia.id_renta,     // Asegúrate de tener esta propiedad en tu resultado
            incidencia.id_incidencia,
            incidencia.fecha_incidencia,
            (err) => {
                if (err) {
                    console.error('Error al insertar en historial_incidencias:', err);
                }
            }
        );

        return res.status(200).json({ data: incidencia });
    });
};
