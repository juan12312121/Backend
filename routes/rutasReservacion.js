const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/controladorReservacion');
const { verifyToken, isAdmin, isDriver } = require('../middlewares/authMiddleware');
const db = require('../config/database')

// Rutas relacionadas con las reservas
router.post('/', verifyToken, reservaController.createReservation);

router.get('/tipos-reservas', verifyToken, reservaController.getReservationTypes);
router.get('/', verifyToken, isAdmin, reservaController.getAllReservations);
router.get('/usuario/:id_usuario', verifyToken, reservaController.getReservationByUserId);

router.put('/:id_reserva/estado', verifyToken, isAdmin, reservaController.updateReservationStatus);
router.put('/reserva/:id_reserva/cambiar-estado', verifyToken, isDriver, reservaController.updateDeliveryStatus);

router.put('/:id_reserva/asignar', verifyToken, isAdmin, reservaController.assignDriverToReservation);

router.get('/chofer/:id_chofer', verifyToken, isDriver, reservaController.getReservationsByDriverId);

router.delete('/:id_reserva', verifyToken, isAdmin, reservaController.deleteReservation);

router.put('/:id_reserva/cancelar', verifyToken, reservaController.cancelReservation);

router.put('/:id_reserva/completar', verifyToken, reservaController.completeReservation);

router.put('/:id_reserva/aceptar', verifyToken, reservaController.acceptReservation);

router.put('/:id_reserva/Rechazar', verifyToken, reservaController.rejectReservation); 

router.get('/reservas/:id_reserva', verifyToken, reservaController.getReservationDetails);

router.put('/return/:id_reserva', verifyToken,  reservaController.returnReservation);

router.put('/cambiar-estado-pago', (req, res) => {
    const { id_reserva } = req.body;

    if (!id_reserva) {
        return res.status(400).json({ message: 'El ID de la reserva es obligatorio.' });
    }

    const querySelect = `
        SELECT estado_pago 
        FROM reservas 
        WHERE id_reserva = ?;
    `;

    const queryUpdate = `
        UPDATE reservas 
        SET estado_pago = 'Reembolso' 
        WHERE id_reserva = ? AND estado_pago != 'Reembolso';
    `;

    db.query(querySelect, [id_reserva], (err, results) => {
        if (err) {
            console.error('Error al verificar el estado actual:', err);
            return res.status(500).json({ message: 'Error al verificar el estado actual', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }

        const estadoActual = results[0].estado_pago;

        if (estadoActual === 'Reembolso') {
            return res.status(400).json({ message: 'El estado ya es Reembolso.' });
        }

        db.query(queryUpdate, [id_reserva], (errUpdate, updateResults) => {
            if (errUpdate) {
                console.error('Error al cambiar el estado de pago:', errUpdate);
                return res.status(500).json({ message: 'Error al cambiar el estado de pago', error: errUpdate });
            }

            if (updateResults.affectedRows === 0) {
                return res.status(400).json({ message: 'No se pudo actualizar el estado de pago.' });
            }

            res.status(200).json({ success: true, message: 'Estado de pago actualizado a Reembolso.' });
        });
    });
});

// Ruta para actualizar el estado de recogida
router.put('/estado-recogida/:id_reserva', verifyToken, reservaController.updateRecogidaStatus);

router.get('/estado-recogida/enum', (req, res) => {
    // Consulta para obtener los valores del ENUM 'estado_recogida_usuario'
    const query = "SHOW COLUMNS FROM reservas LIKE 'estado_recogida_usuario';";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los valores del ENUM estado_recogida_usuario:', err);
            return res.status(500).json({ message: 'Error al obtener los valores del ENUM', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Columna estado_recogida_usuario no encontrada.' });
        }

        // Extraer los valores del ENUM del campo 'estado_recogida_usuario'
        const enumValues = results[0].Type;

        // Usamos una expresión regular para extraer los valores entre comillas
        const regex = /'([^']+)'/g;
        let match;
        const validValues = [];
        while ((match = regex.exec(enumValues)) !== null) {
            validValues.push(match[1]);
        }

        // Enviar los valores del ENUM al cliente
        res.status(200).json({ validValues });
    });
});



router.get('/lugar-devolucion/enum', (req, res) => {
    // Consulta para obtener los valores del ENUM 'lugar_devolucion'
    const query = "SHOW COLUMNS FROM reservas LIKE 'lugar_devolucion';";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los valores del ENUM lugar_devolucion:', err);
            return res.status(500).json({ message: 'Error al obtener los valores del ENUM', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Columna lugar_devolucion no encontrada.' });
        }

        // Extraer los valores del ENUM del campo 'lugar_devolucion'
        const enumValues = results[0].Type;

        // Usamos una expresión regular para extraer los valores entre comillas
        const regex = /'([^']+)'/g;
        let match;
        const validValues = [];
        while ((match = regex.exec(enumValues)) !== null) {
            validValues.push(match[1]);
        }

        // Enviar los valores del ENUM al cliente
        res.status(200).json({ validValues });
    });
});

// Paso 2: Actualizar el lugar de devolución
router.put('/lugar-devolucion/:reservationId', verifyToken, (req, res) => {
    const reservationId = req.params.reservationId;
    const { devolucion } = req.body;

    // Validar que tanto 'reservationId' como 'devolucion' sean enviados
    if (!reservationId || !devolucion) {
        return res.status(400).json({ message: 'El ID de la reserva y el estado del lugar de devolución son necesarios.' });
    }

    // Validar que el valor 'devolucion' sea uno de los valores permitidos
    const validValues = ['Oficina', 'Aeropuerto', 'Pendiente'];  // Aquí van los valores posibles

    if (!validValues.includes(devolucion)) {
        return res.status(400).json({ message: `El valor "${devolucion}" no es válido. Los valores posibles son: ${validValues.join(', ')}` });
    }

    // Actualizar el lugar de devolución en la base de datos
    const updateQuery = "UPDATE reservas SET lugar_devolucion = ? WHERE id_reserva = ?";
    
    db.query(updateQuery, [devolucion, reservationId], (err, result) => {
        if (err) {
            console.error('Error al actualizar el lugar de devolución:', err);
            return res.status(500).json({ message: 'Error al actualizar el lugar de devolución.', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }

        res.status(200).json({ message: 'Lugar de devolución actualizado con éxito.' });
    });
});

router.put('/recogida/:id_reserva', verifyToken , reservaController.updatePickupStatus)

module.exports = router;
