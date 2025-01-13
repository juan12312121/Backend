const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Middleware para verificar si el usuario está autenticado
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Obtener el token del encabezado

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    // Guardar información del usuario en el request
    req.user = decoded;
    next();
  });
};

// Middleware para verificar si el usuario es administrador
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 10) {  // Verificar que el rol sea 10 (administrador)
    return res.status(403).json({ message: 'No tienes permisos de administrador para acceder a este recurso' });
  }
  next();
};

// Middleware para verificar si el usuario es chofer
exports.isDriver = (req, res, next) => {
  if (!req.user || req.user.rol !== 5) {  // Verificar que el rol sea 2 (chofer)
    return res.status(403).json({ message: 'No tienes permisos de chofer para acceder a este recurso' });
  }
  next();
};

// Middleware para verificar si el usuario es de rol 1 (usuario regular)
exports.isUser = (req, res, next) => {
  if (!req.user || req.user.rol !== 1) {
    return res.status(403).json({ message: 'Acceso denegado para usuarios no autorizados' });
  }
  next();
};
