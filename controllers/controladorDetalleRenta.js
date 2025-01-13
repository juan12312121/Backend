const DetalleRenta = require('../models/modeloDetalleRenta');

// Crear un nuevo detalle de renta
exports.createDetalleRenta = (req, res) => {
    const { id_usuario, id_carro, fecha_inicio, fecha_fin, precio_total, metodo_pago } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!id_usuario || !id_carro || !fecha_inicio || !fecha_fin || !precio_total || !metodo_pago) {
        return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    DetalleRenta.create(req.body, (error, results) => {
        if (error) {
            console.error("Error al crear detalle de renta:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(201).json({ id_renta: results.insertId, ...req.body });
    });
};

// Obtener todos los detalles de renta (solo para administradores)
exports.getAllDetalles = (req, res) => {
    DetalleRenta.getAll((error, results) => {
        if (error) {
            console.error("Error al obtener detalles de renta:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json(results);
    });
};

// Obtener todos los detalles de renta para el usuario autenticado
exports.getAllDetallesByUser = (req, res) => {
    const userId = req.user.id; // Asumiendo que el middleware `verifyToken` establece `req.user`
    
    DetalleRenta.getAllByUser(userId, (error, results) => {
        if (error) {
            console.error("Error al obtener detalles de renta:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No se encontraron detalles de renta para este usuario" });
        }
        res.status(200).json(results);
    });
};

// Obtener detalles de renta por ID de usuario (solo para administradores)
exports.getDetallesByUserId = (req, res) => {
    const userId = req.params.userId; // Obtener userId de los parámetros de la ruta
    DetalleRenta.getAllByUser(userId, (error, results) => {
        if (error) {
            console.error("Error al obtener detalles de renta:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No se encontraron detalles de renta para este usuario" });
        }
        res.status(200).json(results);
    });
};

// Actualizar un detalle de renta
exports.updateDetalleRenta = (req, res) => {
    const detalleId = req.params.id;

    DetalleRenta.update(detalleId, req.body, (error, results) => {
        if (error) {
            console.error("Error al actualizar detalle de renta:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Detalle de renta no encontrado' });
        }
        res.status(200).json({ message: 'Detalle de renta actualizado con éxito' });
    });
};

// Eliminar un detalle de renta
exports.deleteDetalleRenta = (req, res) => {
    const detalleId = req.params.id;

    DetalleRenta.delete(detalleId, (error, results) => {
        if (error) {
            console.error("Error al eliminar detalle de renta:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Detalle de renta no encontrado' });
        }
        res.status(200).json({ message: 'Detalle de renta eliminado con éxito' });
    });
};
