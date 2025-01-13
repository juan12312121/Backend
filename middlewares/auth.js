// auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Función para generar el token con nombre de usuario
exports.generateToken = (user) => {
  // Incluir el nombre de usuario en el payload
  const payload = {
    id: user.id,
    username: user.username,  // Aquí añades el nombre de usuario
    rol: user.rol
  };

  // Generar el token con la clave secreta y un tiempo de expiración (1 hora)
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  return token;
};

// Función para verificar el token
exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null; // Si el token es inválido o expirado, retorna null
  }
};
