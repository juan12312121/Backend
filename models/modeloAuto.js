const db = require('../config/database');

// Modelo para manejar operaciones con carros
const CarModel = {
  getAllCars: (callback) => {
    const query = 'SELECT * FROM carros';
    db.query(query, callback);
  },

  getUserCars: (callback) => {
    const query = `
      SELECT 
        c.id,
        c.marca,
        c.modelo,
        c.categoria,
        c.anio,
        c.color,
        c.tipo_combustible,
        c.precio_original,
        c.precio_diaro,
        c.disponibilidad,
        c.promocion,
        c.kilometraje,
        c.descripcion,
        c.imagen,
        p.id_promocion,
        p.descuento
      FROM 
        carros c
      LEFT JOIN 
        promociones p ON c.id_promocion = p.id_promocion;
    `;
    db.query(query, callback);
  },
  
  
  
  createCar: (carData) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO carros (marca, modelo, categoria, anio, color, tipo_combustible, precio_diaro, disponibilidad, kilometraje, descripcion, imagen, puertas, pasajeros) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.query(query, [
        carData.marca,
        carData.modelo,
        carData.categoria,
        carData.anio,
        carData.color,
        carData.tipo_combustible,
        carData.precio_diaro,
        carData.disponibilidad,
        carData.kilometraje,
        carData.descripcion,
        carData.imagen,
        carData.puertas,
        carData.pasajeros
      ], (err, results) => {
        if (err) return reject(err);
  
        // Obtener el ID del nuevo registro insertado
        const carId = results.insertId;
  
        // Actualizar el campo precio_original con el valor de precio_diaro
        const updateQuery = `
          UPDATE carros
          SET precio_original = precio_diaro
          WHERE id = ?
        `;
        
        db.query(updateQuery, [carId], (errUpdate, resultsUpdate) => {
          if (errUpdate) return reject(errUpdate);
          resolve(results); // Responder con el resultado de la inserción
        });
      });
    });
  },
  
  updateCar: (id, carData, callback) => {
    const query = `
      UPDATE carros 
      SET 
        marca = ?, 
        modelo = ?, 
        categoria = ?, 
        anio = ?, 
        color = ?, 
        tipo_combustible = ?, 
        precio_diaro = ?, 
        precio_original = precio_diaro, 
        disponibilidad = ?, 
        kilometraje = ?, 
        descripcion = ?, 
        imagen = ?, 
        puertas = ?, 
        pasajeros = ? 
      WHERE id = ?
    `;
    db.query(query, [
      carData.marca, 
      carData.modelo, 
      carData.categoria, 
      carData.anio, 
      carData.color, 
      carData.tipo_combustible, 
      carData.precio_diaro, // Solo se pasa una vez
      carData.disponibilidad, 
      carData.kilometraje, 
      carData.descripcion, 
      carData.imagen,
      carData.puertas,
      carData.pasajeros,
      id
    ], callback);
  },
  

  deleteCar: (id, callback) => {
    // Primero eliminamos las referencias en la tabla "reservas"
    const deleteReservasQuery = 'DELETE FROM reservas WHERE id_carro = ?';
    db.query(deleteReservasQuery, [id], (error, results) => {
      if (error) {
        console.error('Error al eliminar las reservas:', error);
        return callback(
          new Error('No se puede eliminar el carro porque está relacionado con reservas.')
        );
      }

      // Luego eliminamos el carro de la tabla "carros"
      const deleteCarQuery = 'DELETE FROM carros WHERE id = ?';
      db.query(deleteCarQuery, [id], (error, results) => {
        if (error) {
          console.error('Error al eliminar el carro:', error);
          return callback(error);
        }

        // Si el carro se eliminó correctamente, devolvemos el resultado
        if (results.affectedRows === 0) {
          return callback(new Error('El carro con ese ID no existe.'));
        }

        callback(null, results);
      });
    });
  },

  getCarById: (id, callback) => {
    const query = `
      SELECT c.*, p.descuento
      FROM carros c
      LEFT JOIN promociones p ON c.id_promocion = p.id_promocion
      WHERE c.id = ?
    `;
    db.query(query, [id], callback);
  },
  
  // Nuevo método para obtener carros relacionados por marca
  getRelatedCars: (marca, callback) => {
    // Eliminar posibles espacios o caracteres invisibles
    const marcaTrimmed = marca.trim().replace(/\n|\r/g, '').toLowerCase();

    // Validar que la marca no esté vacía ni sea inválida
    if (!marcaTrimmed || typeof marcaTrimmed !== 'string' || marcaTrimmed.trim() === '') {
      return callback(new Error('Marca no válida'));
    }

    // Consulta SQL para obtener los carros relacionados con la marca
    const query = `
      SELECT marca, modelo, anio, categoria, color, tipo_combustible, precio_diaro, disponibilidad, kilometraje, descripcion, imagen
      FROM carros
      WHERE LOWER(marca) = LOWER(?)
    `;

    // Ejecutar la consulta con la marca proporcionada
    db.query(query, [marcaTrimmed], (err, results) => {
      if (err) {
        return callback(err);  // Si hay un error en la consulta, lo pasamos al callback
      }

      console.log('Resultados obtenidos de la consulta SQL:', results);  // Ver los resultados

      callback(null, results);  // Si todo está bien, devolvemos los resultados
    });
  }


  
  
};

module.exports = CarModel;
