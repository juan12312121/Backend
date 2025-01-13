const MaintenanceTypeModel = require('../models/modeloTipoMantenimiento');

// Obtener todos los tipos de mantenimiento
exports.getAllMaintenanceTypes = (req, res) => {
  MaintenanceTypeModel.getAll((error, types) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(types);
  });
};

// Obtener un tipo de mantenimiento por ID
exports.getMaintenanceTypeById = (req, res) => {
  const { id } = req.params;
  MaintenanceTypeModel.getById(id, (error, type) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!type) {
      return res.status(404).json({ error: 'Tipo de mantenimiento no encontrado.' });
    }
    res.json(type);
  });
};

// Crear un nuevo tipo de mantenimiento
exports.createMaintenanceType = (req, res) => {
  const data = {
    nombre: req.body.nombre, // Ensure this matches the field name in the request
    descripcion: req.body.descripcion || null, // Handle optional fields
    frecuencia_recomendada: req.body.frecuencia_recomendada,
  };

  MaintenanceTypeModel.create(data, (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    // Assuming result contains the new ID, adjust based on your database driver
    res.status(201).json({ message: 'Tipo de mantenimiento creado', id: result.insertId });
  });
};

// Actualizar un tipo de mantenimiento
exports.updateMaintenanceType = (req, res) => {
  const { id } = req.params;
  const data = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion || null,
    frecuencia_recomendada: req.body.frecuencia_recomendada,
  };

  MaintenanceTypeModel.update(id, data, (error, updated) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (updated === 0) {
      return res.status(404).json({ error: 'Tipo de mantenimiento no encontrado.' });
    }
    res.json({ message: 'Tipo de mantenimiento actualizado.' });
  });
};

// Eliminar un tipo de mantenimiento
exports.deleteMaintenanceType = (req, res) => {
  const { id } = req.params;
  MaintenanceTypeModel.delete(id, (error, deleted) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (deleted === 0) {
      return res.status(404).json({ error: 'Tipo de mantenimiento no encontrado.' });
    }
    res.json({ message: 'Tipo de mantenimiento eliminado.' });
  });
};
