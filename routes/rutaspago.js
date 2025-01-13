const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const { verifyToken, isUser, isAdmin } = require('../middlewares/authMiddleware');
const PagoModel = require('../models/PagoModel'); // Asegúrate de que la ruta sea correcta según la estructura de tu proyecto
const db = require('../config/database'); // Tu configuración de base de datos
const paypal = require('../config/paypal'); // Asegúrate de tener correctamente configurado PayPal

// Ruta para crear un pago (inicia el pago)
router.post('/', verifyToken, pagoController.createPago);

// Ruta para ejecutar el pago de PayPal después de la autorización
router.get('/execute', verifyToken, pagoController.executePagoPayPal);

// Ruta para verificar las credenciales de PayPal
router.get('/verify-paypal', (req, res) => {
  paypal.payment.list({ 
    count: 1,   // Número de pagos a recuperar
    start_index: 0 // Índice de inicio
  }, function (error, payments) {  
    if (error) {
      console.error('Error al verificar las credenciales de PayPal: ', error);
      return res.status(500).json({ message: 'Error en la configuración de PayPal', error: error.response });
    } else {
      return res.status(200).json({
        message: 'Configuración de PayPal verificada correctamente',
        payments: payments
      });
    }
  });
});

// Ruta para crear un pago de PayPal
router.post('/create-paypal-payment', (req, res) => {
  const pagoData = req.body;  // Recibe los datos del pago desde el frontend

  const paymentJson = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: 'http://localhost:3500/pago/execute-payment',  // URL donde PayPal redirigirá después de la aprobación
      cancel_url: 'http://localhost:3500/pago/cancel-payment',   // URL donde se redirige si el usuario cancela el pago
    },
    transactions: [{
      amount: {
        total: pagoData.monto,   // Monto total del pago (desde el frontend)
        currency: 'MXN',         // Puedes cambiar la moneda si es necesario
      },
      description: 'Pago por reserva', // Descripción del pago
    }]
  };

  // Realiza la solicitud de pago a PayPal
  paypal.payment.create(paymentJson, (error, payment) => {
    if (error) {
      console.error('Error al crear el pago de PayPal: ', error);
      return res.status(500).json({ message: 'Error al crear el pago de PayPal', error });
    }

    // Busca el approval_url y redirige
    const approvalUrl = payment.links.find(link => link.rel === 'approval_url');

    if (!approvalUrl) {
      return res.status(400).json({ message: 'No se encontró la URL de aprobación.' });
    }

    // Si todo va bien, redirige a PayPal para que el usuario lo apruebe
    return res.json({ approval_url: approvalUrl.href });
  });
});


// Ruta para ejecutar el pago de PayPal
router.get('/execute-payment', (req, res) => {
  // Registro de parámetros recibidos
  console.log('Parámetros recibidos en /execute-payment:', req.query);

  // Extraer parámetros de la consulta (query params)
  const { paymentId, PayerID, token } = req.query;

  // Validar si faltan parámetros
  if (!paymentId || !PayerID || !token) {
    console.error('Error: Faltan parámetros de pago');
    return res.status(400).send('Faltan parámetros de pago');
  }

  // Si todo está bien, realizar la ejecución del pago con PayPal
  paypal.payment.execute(paymentId, {
    payer_id: PayerID,
    transactions: [{
      amount: {
        total: '4500.00',  // Este monto debe ser el recibido del frontend o base de datos
        currency: 'MXN',   // Asegúrate de que la moneda esté configurada correctamente
      },
    }],
  }, (error, payment) => {
    if (error) {
      console.error('Error al ejecutar el pago:', error.response || error);
      return res.status(500).json({
        message: 'Error en la ejecución del pago',
        details: error.response || error,
      });
    }

    // Registro del estado del pago
    console.log('Estado del pago:', payment.state);

    if (payment.state === 'approved') {
      const pagoData = {
        id_renta: 6,  // Este valor debe ser dinámico según el pago
        monto: '4500.00',  // Este valor también debe provenir de la solicitud o la base de datos
        metodo_pago: 'PayPal',  // Siempre 'PayPal' en este caso
        fecha_pago: new Date().toISOString(),  // Puedes usar la fecha actual si es necesario
        paymentId: paymentId || null,  // Si no se pasa, se usa null
        token: token || null,  // Si no se pasa, se usa null
        payerId: PayerID || null  // Si no se pasa, se usa null
      };

      console.log('Datos de pago a insertar en la base de datos:', pagoData);

      // Consulta SQL para insertar los datos
      const sql = `
        INSERT INTO pagos (id_renta, monto, metodo_pago, fecha_pago, paymentId, token, payerId)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      // Pasar los valores de pagoData
      const values = [
        pagoData.id_renta,
        pagoData.monto,
        pagoData.metodo_pago,
        pagoData.fecha_pago,
        pagoData.paymentId,  // Puede ser null
        pagoData.token,      // Puede ser null
        pagoData.payerId     // Puede ser null
      ];

      // Usar db para insertar los datos en la base de datos
      db.query(sql, values, (error, results) => {
        if (error) {
          console.error('Error al insertar el pago en la base de datos:', error);
          return res.status(500).json({ message: 'Error al registrar el pago', error });
        }

        console.log('Pago registrado exitosamente en la base de datos');

        // Actualizar el estado de la venta/renta a "pagado"
        const updateVentaSql = `
          UPDATE reservas
          SET estado_pago = 'Pagado'
          WHERE id_reserva = ?
        `;

        // Usar db para actualizar el estado de la venta o renta
        db.query(updateVentaSql, [pagoData.id_renta], (error, results) => {
          if (error) {
            console.error('Error al actualizar el estado de la venta:', error);
            return res.status(500).json({ message: 'Error al actualizar el estado de la venta', error });
          }

          console.log('Estado de la venta actualizado a "pagado"');
          res.status(200).send('Pago aprobado, registrado y venta cerrada');
        });
      });
    } else {
      console.error('Pago no aprobado');
      res.status(400).send('Pago no aprobado');
    }
  });
});

// Ruta para obtener los pagos (JOIN con reservas, autos y usuarios)
router.get('/ver-pagos', (req, res) => {
  const query = `
      SELECT 
          p.id AS pago_id, 
          p.monto, 
          p.metodo_pago, 
          p.fecha_pago, 
          r.id_reserva,  -- Agregado id_reserva
          r.id_carro, 
          r.id_usuario, 
          r.estado_pago,  -- Estado del pago
          r.estado_reserva,  -- Estado de la reserva agregado aquí
          a.marca AS auto_marca, 
          a.modelo AS auto_modelo, 
          a.descripcion AS auto_descripcion, 
          u.nombre_completo AS usuario_nombre, 
          u.correo AS usuario_email 
      FROM 
          pagos p
      JOIN 
          reservas r ON p.id_renta = r.id_reserva  -- Relaciona pagos con reservas
      JOIN 
          carros a ON r.id_carro = a.id  -- Relaciona reservas con carros
      JOIN 
          usuarios u ON r.id_usuario = u.id;  -- Relaciona reservas con usuarios
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error al obtener los pagos:', err);
          return res.status(500).json({ message: 'Error al obtener los pagos', error: err });
      }

      // Si la consulta es exitosa, devolver los resultados
      res.status(200).json(results);
  });
});


  

module.exports = router;
