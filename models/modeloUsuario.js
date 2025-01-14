const db = require('../config/database');

const userModel = {
  // Crear un nuevo usuario
const userModel = {
  // Crear un nuevo usuario
  createUser: (nombreCompleto, nombreUsuario, correo, hashedPassword, rol, numeroLicencia) => {
    const query = 'INSERT INTO usuarios (nombre_completo, nombre_usuario, correo, contrasena, rol, numero_licencia) VALUES (?, ?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        // Verificar el rol
        let params;
        if (rol === 5) {
            // Solo los usuarios de rol 5 necesitan el número de licencia
            params = [nombreCompleto, nombreUsuario, correo, hashedPassword, rol, numeroLicencia];
        } else if (rol === 1 || rol === 10) {
            // Los usuarios de rol 1 y 10 no necesitan número de licencia
            params = [nombreCompleto, nombreUsuario, correo, hashedPassword, rol, null];
        } else {
            // Si el rol no es 5, 1, o 10, también pasamos null como número de licencia
            params = [nombreCompleto, nombreUsuario, correo, hashedPassword, rol, null];
        }
  
        db.query(query, params, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
},
  
  // Encontrar un usuario por su nombre de usuario
  findUserByUsername: (nombreUsuario) => {
    const query = 'SELECT * FROM usuarios WHERE nombre_usuario = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [nombreUsuario], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  // Obtener todos los usuarios de nivel 1
  getAllUsersLevel1: () => {
    const query = 'SELECT * FROM usuarios WHERE rol = 1';
    return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  // Obtener todos los usuarios de nivel 10 (administradores)
  getAllUsersLevel10: () => {
    const query = 'SELECT * FROM usuarios WHERE rol = 10';
    return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  // Buscar un usuario por ID
  findUserById: (id) => {
    const query = 'SELECT * FROM usuarios WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  // Obtener un usuario por su ID sin la contraseña
  findUserDetailsById: (id) => {
    const query = 'SELECT id, nombre_completo, nombre_usuario, correo, rol FROM usuarios WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  // Obtener usuarios por rol
  getUsersByRole: (rol) => {
    const query = 'SELECT * FROM usuarios WHERE rol = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [rol], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  // Actualizar los datos del usuario
  updateUserData: (id, nombreCompleto, nombreUsuario, correo, rol) => {
    const query = 'UPDATE usuarios SET nombre_completo = ?, nombre_usuario = ?, correo = ?, rol = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [nombreCompleto, nombreUsuario, correo, rol, id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  // Cambiar la contraseña del usuario
  changePassword: (id, newHashedPassword) => {
    const query = 'UPDATE usuarios SET contrasena = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [newHashedPassword, id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  // Eliminar un usuario por ID
  deleteUserById: (id) => {
    const query = 'DELETE FROM usuarios WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  getAllUsersLevel5: () => {
    const query = 'SELECT * FROM usuarios WHERE rol = 5';  // Asumiendo que el rol 5 es para choferes
    return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },
};

module.exports = userModel;
