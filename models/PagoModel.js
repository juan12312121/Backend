const db = require('../config/database');

// Modelo para manejar operaciones con pagos
const PagoModel = {

  // Crear un pago
  createPago: (pagoData) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO pagos (id_renta, monto, metodo_pago, fecha_pago)
        VALUES (?, ?, ?, ?)
      `;
      db.query(query, [
        pagoData.id_renta,      // id de la renta asociada al pago
        pagoData.monto,         // monto del pago
        pagoData.metodo_pago,   // metodo de pago (Tarjeta de Crédito, Efectivo)
        pagoData.fecha_pago     // fecha de pago (actual, por defecto)
      ], (err, results) => {
        if (err) return reject(err);
        resolve(results);  // Devuelve el resultado de la operación (ID generado, etc.)
      });
    });
  },

 // Crear un pago
 createPago: (pagoData) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO pagos (id_renta, monto, metodo_pago, fecha_pago)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      // Ejecutar la consulta para insertar el pago
      db.query(query, [
        pagoData.id_renta,        // ID de la reserva asociada al pago
        pagoData.monto,           // Monto del pago
        pagoData.metodo_pago,     // Método de pago (Paypal)
        pagoData.fecha_pago,      // Fecha del pago
      ], (err, results) => {
        if (err) return reject(err);
        resolve(results);  // Devuelve el resultado de la operación (ID generado, etc.)
      });
    });
  },


  

};

module.exports = PagoModel;
