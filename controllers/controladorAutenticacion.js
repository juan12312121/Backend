const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/modeloUsuario');
const dotenv = require('dotenv');
dotenv.config();

// Registro de usuario
exports.register = async (req, res) => {
  const { nombreCompleto, nombreUsuario, correo, password, rol, numeroLicencia } = req.body;

  console.log(req.body);  // Agregar este log para ver qué datos se reciben

  if (!nombreCompleto || !nombreUsuario || !correo || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const userRole = rol || 1;

  if (userRole === 5 && !numeroLicencia) {
    return res.status(400).json({ message: 'El número de licencia es requerido para usuarios de nivel 5' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.createUser(nombreCompleto, nombreUsuario, correo, hashedPassword, userRole, numeroLicencia);
    const token = jwt.sign({ username: nombreUsuario, rol: userRole }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(201).json({ message: 'Usuario registrado con éxito', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};


// Login de usuario
// Login de usuario
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Validación de los campos
  if (!username || !password) {
    return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos' });
  }

  try {
    const results = await userModel.findUserByUsername(username);
    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.contrasena);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Crear el token de acceso según el rol
    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

    // Redirigir a rutas diferentes según el rol
    if (user.rol === 5) {
      return res.json({ message: 'Login exitoso, bienvenido chofer', token, refreshToken, redirect: '/choferes' });
    } else if (user.rol === 10) {
      return res.json({ message: 'Login exitoso, bienvenido administrador', token, refreshToken, redirect: '/admin' });
    }

    res.json({ message: 'Login exitoso', token, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

// Obtener todos los usuarios de nivel 1
exports.getAllUsersLevel1 = async (req, res) => {
  try {
    const results = await userModel.getAllUsersLevel1();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Obtener todos los usuarios de nivel 10 (administradores)
exports.getAllUsersLevel10 = async (req, res) => {
  try {
    const results = await userModel.getAllUsersLevel10();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Obtener todos los usuarios de nivel 5 (choferes)
exports.getAllUsersLevel5 = async (req, res) => {
  try {
    const results = await userModel.getUsersByRole(5);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener choferes' });
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const userIdFromToken = req.user.id;  // Asumimos que estás adjuntando la información del usuario al request

  try {
    if (req.user.rol === 10 || userIdFromToken === parseInt(id)) {
      const result = await userModel.findUserById(id);
      if (!result) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(result);
    } else {
      res.status(403).json({ message: 'Acceso denegado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};



// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ID de usuario requerido' });
  }

  try {
    const result = await userModel.deleteUserById(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario eliminado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

// Actualizar datos de usuario
exports.updateUserData = async (req, res) => {
  const { id } = req.params;
  const { nombreCompleto, username, correo, rol } = req.body;

  if (!nombreCompleto || !username || !correo || !rol) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  if (req.user.rol !== 10 && req.user.id !== parseInt(id)) {
    return res.status(403).json({ message: 'Acceso denegado' });
  }

  try {
    const result = await userModel.updateUserData(id, nombreCompleto, username, correo, rol);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Datos del usuario actualizados con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: 'Nueva contraseña es requerida' });
  }

  if (req.user.id !== parseInt(id) && req.user.rol !== 10) {
    return res.status(403).json({ message: 'Acceso denegado' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await userModel.changePassword(id, hashedPassword);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Contraseña cambiada con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al cambiar la contraseña' });
  }
};

exports.getDriverById = async (req, res) => {
  const { id } = req.params;
  const userIdFromToken = req.user.id;

  try {
    if (req.user.rol === 10 || userIdFromToken === parseInt(id)) {
      const result = await userModel.findUserById(id);
      if (!result) {
        return res.status(404).json({ message: 'Chofer no encontrado' });
      }
      res.status(200).json(result);
    } else {
      res.status(403).json({ message: 'Acceso denegado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el chofer' });
  }
};

// Eliminar un chofer por ID (solo administradores)
exports.deleteDriver = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await userModel.deleteUserById(id);  // Asegúrate de tener un método en el modelo para eliminar choferes
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Chofer no encontrado' });
    }
    res.status(200).json({ message: 'Chofer eliminado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el chofer' });
  }
};

exports.getUsersByRole = async (req, res) => {
  const { rol } = req.params;  // Obtenemos el rol desde los parámetros de la URL

  try {
    // Consultamos los usuarios por rol usando el modelo
    const results = await userModel.getUsersByRole(rol);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios con ese rol' });
    }
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los usuarios por rol' });
  }
};
