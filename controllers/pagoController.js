const db = require('../config/database');  // Asumiendo que la configuración de la base de datos está en este archivo


// Crear un nuevo pago
exports.createPago = (req, res) => {
  const pagoData = req.body;  // Recibe los datos del pago

  // Log: Verificar qué datos estamos recibiendo
  console.log('Datos recibidos del pago:', pagoData);

  // Validación básica: asegurarse de que los campos necesarios estén presentes
  if (!pagoData.reserva_id || !pagoData.monto || !pagoData.tipo) {
    console.error('Faltan datos requeridos:', {
      reserva_id: pagoData.reserva_id,
      monto: pagoData.monto,
      tipo: pagoData.tipo
    });
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  // Si la fecha_pago es un string ISO, convertimos al formato MySQL
  let fechaPago = pagoData.fecha_pago ? new Date(pagoData.fecha_pago).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ');

  // Si todos los datos son válidos, procedemos con la inserción
  console.log('Datos válidos para insertar en la base de datos:', {
    reserva_id: pagoData.reserva_id,
    monto: pagoData.monto,
    metodo_pago: pagoData.tipo,  // Aquí usamos "tipo" como método de pago
    fecha_pago: fechaPago // Fecha de pago convertida al formato correcto
  });

  // Realizamos la consulta directamente aquí
  const query = `
    INSERT INTO pagos (id_renta, monto, metodo_pago, fecha_pago)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [
    pagoData.reserva_id,     // El id de la reserva
    pagoData.monto,         // Monto del pago
    pagoData.tipo,          // Método de pago (usamos 'tipo' como método de pago)
    fechaPago               // Fecha de pago (ahora en formato correcto para MySQL)
  ], (err, results) => {
    if (err) {
      console.error('Error al crear el pago:', err);
      return res.status(500).json({ message: 'Error al crear el pago', error: err });
    }

    // Si la inserción fue exitosa, respondemos con los resultados
    console.log('Pago creado exitosamente, resultado de la operación:', results);
    res.status(201).json({ message: 'Pago creado exitosamente', data: results });
  });
};

// Ejecutar el pago después de la autorización de PayPal
exports.executePagoPayPal = (req, res) => {
  const { paymentId, PayerID } = req.query;  // Recibimos los parámetros desde la URL

  // Verificamos que los parámetros estén presentes
  if (!paymentId || !PayerID) {
    return res.status(400).json({ message: 'Faltan parámetros del pago.' });
  }

  // Crear el objeto para ejecutar el pago
  const execute_payment_json = {
    payer_id: PayerID
  };

  // Ejecutar el pago a través de PayPal
  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      console.error('Error al ejecutar el pago:', error);
      return res.status(500).json({ message: 'Hubo un error al ejecutar el pago.', error });
    }

    // Si el pago fue aprobado
    if (payment.state === 'approved') {
      console.log('Pago aprobado:', payment);

      // Extraer la información relevante del pago para almacenarla en la base de datos
      const pagoData = {
        id_renta: req.body.reserva_id,  // ID de la reserva, que debes enviar desde el frontend
        monto: payment.transactions[0].amount.total,  // Monto total del pago
        metodo_pago: 'paypal',  // El método de pago es PayPal
        fecha_pago: new Date(),  // Fecha de pago (actual)
      };

      // Insertar los datos del pago en la base de datos
      PagoModel.createPago(pagoData)
        .then(result => {
          console.log('Pago almacenado exitosamente en la base de datos:', result);
          res.json({
            message: 'Pago realizado con éxito y almacenado en la base de datos',
            payment: payment
          });
        })
        .catch(err => {
          console.error('Error al almacenar el pago en la base de datos:', err);
          res.status(500).json({ message: 'Error al almacenar el pago en la base de datos', error: err });
        });
    } else {
      res.status(400).json({ message: 'El pago no fue aprobado.' });
    }
  });
};
