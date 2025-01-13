const UserHistoryModel = require('../models/modeloHistorialUsuario');

// Crear un nuevo registro en el historial de usuarios
exports.createUserHistory = (req, res) => {
    const { id_usuario, accion, fecha } = req.body; // Desestructuración para mayor claridad

    // Verificar que se reciban los datos necesarios
    if (!id_usuario || !accion || !fecha) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    const newHistory = { id_usuario, accion, fecha };

    UserHistoryModel.create(newHistory, (error, results) => {
        if (error) {
            console.error("Error al crear el historial de usuario:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(201).json({ id_historial: results.insertId, ...newHistory });
    });
};

// Obtener todos los registros del historial de usuarios (solo admins)
exports.getAllUserHistory = (req, res) => {
    UserHistoryModel.getAll((error, results) => {
        if (error) {
            console.error("Error al obtener el historial de usuarios:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json(results);
    });
};

// Obtener un registro del historial de usuarios por ID (admins y usuarios)
exports.getUserHistoryById = (req, res) => {
    const { id } = req.params; // Desestructuración para mayor claridad

    UserHistoryModel.getById(id, (error, results) => {
        if (error) {
            console.error("Error al obtener el historial de usuario:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.status(200).json(results[0]);
    });
};

// Obtener el historial del usuario autenticado
exports.getUserHistoryByUserId = (req, res) => {
    const userId = req.user.id; // Obtener el ID del usuario desde el token

    UserHistoryModel.getByUserId(userId, (error, results) => {
        if (error) {
            console.error("Error al obtener el historial de usuario:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json(results);
    });
};

// Actualizar un registro en el historial de usuarios (solo admins)
exports.updateUserHistory = (req, res) => {
    const { id } = req.params; // Desestructuración para mayor claridad

    UserHistoryModel.update(id, req.body, (error, results) => {
        if (error) {
            console.error("Error al actualizar el historial de usuario:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.status(200).json({ message: 'Registro actualizado con éxito' });
    });
};

// Eliminar un registro del historial de usuarios (solo admins)
exports.deleteUserHistory = (req, res) => {
    const { id } = req.params; // Desestructuración para mayor claridad

    UserHistoryModel.delete(id, (error, results) => {
        if (error) {
            console.error("Error al eliminar el historial de usuario:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.status(200).json({ message: 'Registro eliminado con éxito' });
    });
};
