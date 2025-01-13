const invoiceModel = require('../models/modeloFactura');

// Crear una nueva factura
exports.createInvoice = (req, res) => {
    const { idUsuario, idRenta, montoTotal, fechaEmision, estado } = req.body;
    invoiceModel.createInvoice(idUsuario, idRenta, montoTotal, fechaEmision, estado, (err, result) => {
        if (err) {
            console.error(err); // Log para depuración
            return res.status(500).json({ message: 'Error al crear la factura: ' + err.message });
        }
        res.status(201).json({ message: 'Factura creada con éxito', id: result.insertId });
    });
};

// Obtener todas las facturas
exports.getAllInvoices = (req, res) => {
    invoiceModel.getAllInvoices((err, results) => {
        if (err) {
            console.error(err); // Log para depuración
            return res.status(500).json({ message: 'Error al obtener las facturas: ' + err.message });
        }
        res.json(results);
    });
};

// Obtener una factura por ID
exports.getInvoiceById = (req, res) => {
    const id = req.params.id;
    invoiceModel.getInvoiceById(id, (err, results) => {
        if (err) {
            console.error(err); // Log para depuración
            return res.status(500).json({ message: 'Error al obtener la factura: ' + err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: `Factura con ID ${id} no encontrada` });
        }
        res.json(results[0]);
    });
};

// Actualizar una factura
exports.updateInvoice = (req, res) => {
    const id = req.params.id;
    const { idUsuario, idRenta, montoTotal, fechaEmision, estado } = req.body;
    invoiceModel.updateInvoice(id, idUsuario, idRenta, montoTotal, fechaEmision, estado, (err, result) => {
        if (err) {
            console.error(err); // Log para depuración
            return res.status(500).json({ message: 'Error al actualizar la factura: ' + err.message });
        }
        res.json({ message: 'Factura actualizada con éxito' });
    });
};

// Eliminar una factura
exports.deleteInvoice = (req, res) => {
    const id = req.params.id;
    invoiceModel.deleteInvoice(id, (err, result) => {
        if (err) {
            console.error(err); // Log para depuración
            return res.status(500).json({ message: 'Error al eliminar la factura: ' + err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Factura con ID ${id} no encontrada para eliminar` });
        }
        res.json({ message: 'Factura eliminada con éxito' });
    });
};
