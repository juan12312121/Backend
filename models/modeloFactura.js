const db = require('../config/database');

// Modelo para manejar operaciones con facturas
const InvoiceModel = {
  // Crear una nueva factura
  createInvoice: (idUsuario, idRenta, montoTotal, fechaEmision, estado, callback) => {
    const query = 'INSERT INTO facturacion (idusuario, idrenta, monto_total, fecha_emision, estado) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [idUsuario, idRenta, montoTotal, fechaEmision, estado], callback);
  },

  // Obtener todas las facturas
  getAllInvoices: (callback) => {
    const query = 'SELECT * FROM facturacion';
    db.query(query, callback);
  },

  // Obtener una factura por ID
  getInvoiceById: (id, callback) => {
    const query = 'SELECT * FROM facturacion WHERE idfactura = ?';
    db.query(query, [id], callback);
  },

  // Actualizar una factura
  updateInvoice: (id, idUsuario, idRenta, montoTotal, fechaEmision, estado, callback) => {
    const query = 'UPDATE facturacion SET idusuario = ?, idrenta = ?, monto_total = ?, fecha_emision = ?, estado = ? WHERE idfactura = ?';
    db.query(query, [idUsuario, idRenta, montoTotal, fechaEmision, estado, id], callback);
  },

  // Eliminar una factura
  deleteInvoice: (id, callback) => {
    const query = 'DELETE FROM facturacion WHERE idfactura = ?';
    db.query(query, [id], callback);
  }
};

module.exports = InvoiceModel;
