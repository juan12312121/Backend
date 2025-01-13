const db = require('../config/database'); // Asegúrate de que esta ruta sea correcta

// Obtener todos los seguros
exports.getAllInsurances = (req, res) => {
    const query = 'SELECT * FROM seguros';
    db.query(query, (error, results) => {
        if (error) {
            console.error("Error al obtener seguros:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json(results);
    });
};

// Crear un nuevo seguro
exports.createInsurance = (req, res) => {
    const { compania_seguro, tipo_seguro, monto_seguro, fecha_inicio, fecha_fin, estado_seguro } = req.body;

    // Validar que se pasen todos los campos requeridos
    if (!compania_seguro || !tipo_seguro || !monto_seguro || !fecha_inicio || !fecha_fin || !estado_seguro) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const query = 'INSERT INTO seguros (compania_seguro, tipo_seguro, monto_seguro, fecha_inicio, fecha_fin, estado_seguro) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [compania_seguro, tipo_seguro, monto_seguro, fecha_inicio, fecha_fin, estado_seguro], (error, results) => {
        if (error) {
            console.error("Error al crear seguro:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(201).json({ id_seguro: results.insertId, ...req.body });
    });
};

// Obtener un seguro por ID
exports.getInsuranceById = (req, res) => {
    const query = 'SELECT * FROM seguros WHERE id_seguro = ?';
    db.query(query, [req.params.id], (error, results) => {
        if (error) {
            console.error("Error al obtener seguro:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Seguro no encontrado' });
        }
        res.status(200).json(results[0]);
    });
};

// Actualizar un seguro
exports.updateInsurance = (req, res) => {
    const { compania_seguro, tipo_seguro, monto_seguro, fecha_inicio, fecha_fin, estado_seguro } = req.body;

    // Validar que se pasen todos los campos requeridos
    if (!compania_seguro || !tipo_seguro || !monto_seguro || !fecha_inicio || !fecha_fin || !estado_seguro) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const query = 'UPDATE seguros SET compania_seguro = ?, tipo_seguro = ?, monto_seguro = ?, fecha_inicio = ?, fecha_fin = ?, estado_seguro = ? WHERE id_seguro = ?';
    db.query(query, [compania_seguro, tipo_seguro, monto_seguro, fecha_inicio, fecha_fin, estado_seguro, req.params.id], (error, results) => {
        if (error) {
            console.error("Error al actualizar seguro:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Seguro no encontrado' });
        }
        res.status(200).json({ message: 'Seguro actualizado con éxito' });
    });
};

// Eliminar un seguro
exports.deleteInsurance = (req, res) => {
    const query = 'DELETE FROM seguros WHERE id_seguro = ?';
    db.query(query, [req.params.id], (error, results) => {
        if (error) {
            console.error("Error al eliminar seguro:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Seguro no encontrado' });
        }
        res.status(200).json({ message: 'Seguro eliminado con éxito' });
    });
};
