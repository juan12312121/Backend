const Maintenance = require('../models/modeloMantenimiento');
const MaintenanceTypes = require('../constants/mantenimientoConstants'); // Importar las constantes
const db = require('../config/database');


// Crear un nuevo mantenimiento
exports.createMaintenance = (req, res) => {
    const { id_carro, tipo_mantenimiento, costo, fecha_mantenimiento } = req.body;

    // Validar que tipo_mantenimiento sea uno de los valores permitidos
    if (!Object.values(MaintenanceTypes).includes(tipo_mantenimiento)) {
        return res.status(400).json({ message: 'Tipo de mantenimiento inválido' });
    }

    // Hacer el JOIN para obtener la marca y modelo del carro
    const query = `
        SELECT marca, modelo 
        FROM carros 
        WHERE id = ?`;

    db.query(query, [id_carro], (err, results) => {
        if (err) {
            console.error("Error al obtener datos del carro:", err);
            return res.status(500).json({ message: 'Error interno del servidor al obtener datos del carro' });
        }

        // Si no se encuentra el carro con el id proporcionado
        if (results.length === 0) {
            return res.status(404).json({ message: 'Carro no encontrado' });
        }

        // Extraemos la marca y el modelo del carro
        const { marca, modelo } = results[0];

        // Creamos el objeto de datos para el mantenimiento
        const maintenanceData = {
            id_carro,
            tipo_mantenimiento,
            costo,
            fecha_mantenimiento,
            marca,
            modelo
        };

        // Ahora insertamos el mantenimiento en la base de datos
        const insertQuery = `
            INSERT INTO mantenimiento (id_carro, tipo_mantenimiento, costo, fecha_mantenimiento, marca, modelo)
            VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(insertQuery, [
            maintenanceData.id_carro,
            maintenanceData.tipo_mantenimiento,
            maintenanceData.costo,
            maintenanceData.fecha_mantenimiento,
            maintenanceData.marca,
            maintenanceData.modelo
        ], (error, results) => {
            if (error) {
                console.error("Error al crear mantenimiento:", error);
                return res.status(500).json({ message: 'Error interno del servidor al crear mantenimiento' });
            }

            res.status(201).json({
                id_mantenimiento: results.insertId,
                ...maintenanceData
            });
        });
    });
};

// Obtener todos los mantenimientos
exports.getAllMaintenances = (req, res) => {
    Maintenance.getAll((error, results) => {
        if (error) {
            console.error("Error al obtener mantenimientos:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json(results);
    });
};

// Obtener mantenimiento por ID
exports.getMaintenanceById = (req, res) => {
    const { id } = req.params;
    Maintenance.getById(id, (error, result) => {
        if (error) {
            console.error("Error al obtener mantenimiento:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (!result) {
            return res.status(404).json({ message: 'Mantenimiento no encontrado' });
        }
        res.status(200).json(result);
    });
};

// Actualizar un mantenimiento
exports.updateMaintenance = (req, res) => {
    const { id } = req.params;
    const { tipo_mantenimiento } = req.body;

    // Validar que tipo_mantenimiento sea uno de los valores permitidos
    if (tipo_mantenimiento && !Object.values(MaintenanceTypes).includes(tipo_mantenimiento)) {
        return res.status(400).json({ message: 'Tipo de mantenimiento inválido' });
    }

    Maintenance.update(id, req.body, (error, results) => {
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
exports.deleteMaintenance = (req, res) => {
    const { id } = req.params;
    Maintenance.delete(id, (error, results) => {
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


exports.getTotalGastosMantenimiento = (req, res) => {
    console.log("Solicitud recibida para obtener el total de los gastos de mantenimiento");

    // Llamamos al modelo para obtener el total de los gastos
    Maintenance.getGastosMantenimientoTotales((err, result) => {
        if (err) {
            console.error("Error al obtener el total de los gastos de mantenimiento:", err);
            return res.status(500).json({ message: 'Error interno del servidor al obtener el total de los gastos' });
        }

        console.log("Resultado obtenido en el modelo:", result); // Log de los resultados devueltos

        // Verificamos si el resultado contiene el total de los gastos
        if (result && result.total_gastos_suma !== undefined) {
            console.log("Enviando respuesta con el total de los gastos:", result.total_gastos_suma);
            return res.status(200).json(result); // Devolvemos el total de los gastos
        } else {
            console.log("No se encontraron gastos de mantenimiento");
            return res.status(404).json({ message: 'No se encontraron gastos de mantenimiento o el total es nulo' });
        }
    });
};

exports.updateMaintenanceEstado = (req, res) => {
    const { id_carro } = req.params; // Obtener el ID del carro de los parámetros
    const { estado_mantenimiento } = req.body; // Obtener el estado del cuerpo de la solicitud

    // Log para verificar los datos recibidos
    console.log("ID del carro recibido:", id_carro);
    console.log("Estado de mantenimiento recibido:", estado_mantenimiento);

    // Validar que se envíe un estado válido
    if (!estado_mantenimiento) {
        console.error("El estado del mantenimiento no fue proporcionado.");
        return res.status(400).json({ message: 'El estado del mantenimiento es obligatorio' });
    }

    // Validar si el estado de mantenimiento tiene un valor correcto
    const validStates = ['En mantenimiento', 'Mantenimiento terminado']; // Estados válidos según la base de datos
    if (!validStates.includes(estado_mantenimiento)) {
        console.error("Estado de mantenimiento inválido recibido:", estado_mantenimiento);
        return res.status(400).json({ message: 'Estado de mantenimiento inválido' });
    }

    // Llamar al modelo para actualizar el estado del mantenimiento
    console.log("Llamando al modelo para actualizar el estado del mantenimiento...");
    Maintenance.updateEstadoByCarId(id_carro, estado_mantenimiento, (err, results) => {
        if (err) {
            console.error("Error al actualizar el estado del mantenimiento:", err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        // Verificar si se actualizó alguna fila
        if (results.affectedRows === 0) {
            console.warn("No se encontró mantenimiento para el ID del carro:", id_carro);
            return res.status(404).json({ message: 'Mantenimiento no encontrado para este ID de carro' });
        }

        // Enviar una respuesta de éxito
        console.log("Estado del mantenimiento actualizado con éxito para el carro ID:", id_carro);
        res.status(200).json({ message: 'Estado del mantenimiento actualizado con éxito' });
    });
};


