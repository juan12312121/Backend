const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/controladorAutenticacion');
const authMiddleware = require('../middlewares/authMiddleware');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware'); // Importa el middleware
const db = require('../config/database'); 

// Rutas públicas
router.post('/registro', AuthController.register);
router.post('/login', AuthController.login);


// Ruta para obtener un usuario por ID (solo el usuario logueado puede acceder a su propio perfil)
router.get('/users/:id', authMiddleware.verifyToken, AuthController.getUserById);

// Rutas para obtener los usuarios de nivel 1 (usuarios regulares) (solo administradores)
router.get('/users/level1', authMiddleware.verifyToken, authMiddleware.isAdmin, AuthController.getAllUsersLevel1);

router.get('/level10', authMiddleware.verifyToken, authMiddleware.isAdmin, AuthController.getAllUsersLevel10);

// Ruta para obtener los choferes (usuarios de rol 2)
router.get('/choferes', authMiddleware.verifyToken, authMiddleware.isAdmin, AuthController.getAllUsersLevel5);

// Ruta para obtener un chofer por ID (solo administradores o el chofer mismo pueden acceder)
router.get('/choferes/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, AuthController.getDriverById);

// Ruta para eliminar un chofer por ID (solo administradores)
router.delete('/users/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, AuthController.deleteDriver);

// Ruta para cambiar la contraseña de un usuario (solo el propio usuario o un administrador)
router.put('/users/:id/password', authMiddleware.verifyToken, AuthController.changePassword);

router.get('/role/:rol', authMiddleware.verifyToken, authMiddleware.isAdmin, AuthController.getUsersByRole);

// Ruta administrativa (solo administradores)
router.get('/admin', authMiddleware.verifyToken, authMiddleware.isAdmin, (req, res) => {
  res.json({ message: 'Bienvenido al área administrativa' });
});

// Ruta para el área de usuario regular (rol 1) (solo usuarios logueados con rol 1)
router.get('/usuario', authMiddleware.verifyToken, authMiddleware.isUser, (req, res) => {
  res.json({ message: 'Bienvenido al área de usuario' });
});

// Ruta para el área de chofer (solo choferes logueados con rol 2)
router.get('/chofer', authMiddleware.verifyToken, authMiddleware.isDriver, (req, res) => {
  res.json({ message: 'Bienvenido al área de chofer' });
});


router.get('/historial/:id', verifyToken, (req, res) => {
  const userId = req.params.id;  // Obtenemos el id del usuario desde los parámetros de la URL

  // Consulta SQL para obtener el detalle de las reservas y reportes del usuario
  const query = `
    SELECT
      r.idreporte,
      r.tipo_reporte,
      r.descripcion,
      r.estado AS estado_reporte,
      r.fecha_generacion AS fecha_reporte,
      res.id_reserva,
      res.fecha_inicio AS fecha_reserva,
      res.fecha_fin,
      res.estado_reserva AS detalles_reserva,
      res.monto_reserva,
      res.tipo_reserva,
      res.estado_pago,
      u.id AS id_usuario,
      u.nombre_completo,
      u.correo,
      car.id AS id_carro,
      car.marca,
      car.modelo,
      car.color
    FROM
      usuarios u
    JOIN
      reservas res ON u.id = res.id_usuario
    LEFT JOIN
      reportes r ON res.id_reserva = r.id_reserva
    JOIN
      carros car ON res.id_carro = car.id
    WHERE
      u.id = ?  -- Filtramos por el id del usuario
    ORDER BY
      res.fecha_inicio DESC, r.fecha_generacion DESC;  -- Ordenamos por fecha de reserva y reporte
  `;

  // Ejecutar la consulta SQL
  db.execute(query, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener el historial del usuario' });
    }

    // Si no se encuentran resultados, retornamos un error 404
    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron datos para el usuario' });
    }

    // Devolvemos el historial con las reservas y reportes encontrados
    res.status(200).json({ historial: result });
  });
});


module.exports = router;
