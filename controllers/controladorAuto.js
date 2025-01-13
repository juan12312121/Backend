const carModel = require('../models/modeloAuto');

// Obtener todos los carros (para administradores)
exports.getAllCars = (req, res) => {
  carModel.getAllCars((err, results) => {
    if (err) {
      console.error('Error al obtener los carros:', err);
      return res.status(500).json({ message: 'Error al obtener los carros', error: err.message });
    }
    res.json(results);
  });
};

// Obtener un carro específico por ID
exports.getCarById = (req, res) => {
  const id = parseInt(req.params.id);
  carModel.getCarById(id, (err, carro) => {
    if (err) {
      console.error('Error al obtener el carro:', err);
      return res.status(500).json({ message: 'Error al obtener el carro', error: err.message });
    }
    
    if (!carro) {
      console.log(`No se encontró un carro con ID: ${id}`);
      return res.status(404).json({ message: `Carro con ID ${id} no encontrado` });
    }
    
    console.log(`Datos del carro obtenido para ID ${id}:`, carro);
    res.json(carro);
  });
};

// Obtener carros visibles para usuarios
exports.getUserCars = (req, res) => {
  carModel.getUserCars((err, results) => {
    if (err) {
      console.error('Error al obtener los carros visibles:', err);
      return res.status(500).json({ message: 'Error al obtener los carros visibles', error: err.message });
    }
    console.log('Carros visibles obtenidos:', results);
    res.json(results);
  });
};

// Crear un nuevo carro (solo administradores)
exports.createCar = (req, res) => {
  if (!req.user || req.user.rol !== 10) {
    return res.status(403).json({ message: 'No tienes permisos para crear un carro' });
  }

  const imagenUrl = req.file ? req.file.path : null;
  const nuevoCarro = {
    marca: req.body.marca,
    modelo: req.body.modelo,
    anio: req.body.anio,
    color: req.body.color,
    tipo_combustible: req.body.tipo_combustible,
    precio_diaro: req.body.precio_diaro,
    disponibilidad: req.body.disponibilidad,
    categoria: req.body.categoria,
    imagen: imagenUrl,
    descripcion: req.body.descripcion,
    kilometraje: req.body.kilometraje,
    puertas: req.body.puertas,
    pasajeros: req.body.pasajeros
  };

  // Validación de campos obligatorios
  if (!nuevoCarro.puertas || !nuevoCarro.pasajeros) {
    return res.status(400).json({ message: 'Los campos puertas y pasajeros son requeridos' });
  }

  // Validación de tipo de dato
  if (isNaN(nuevoCarro.precio_diaro) || nuevoCarro.precio_diaro <= 0) {
    return res.status(400).json({ message: 'El precio diario debe ser un número positivo' });
  }

  carModel.createCar(nuevoCarro)
    .then((results) => res.status(201).json({ message: 'Carro creado exitosamente', carro: results }))
    .catch((err) => res.status(500).json({ message: 'Error al crear el carro', error: err.message }));
};

// Actualizar un carro (solo administradores)
exports.updateCar = (req, res) => {
  // Verificar permisos del usuario
  if (!req.user || req.user.rol !== 10) {
    return res.status(403).json({ message: 'No tienes permisos para actualizar un carro' });
  }

  const { id } = req.params;
  const { 
    marca, 
    modelo, 
    categoria, 
    anio, 
    color, 
    tipo_combustible, 
    precio_diaro, 
    kilometraje, 
    descripcion, 
    disponibilidad, 
    puertas, 
    pasajeros 
  } = req.body;
  const imagen = req.file ? req.file.path : null;

  // Verificar primero los campos existentes en la base de datos
  carModel.getCarById(id, (err, car) => {
    if (err) {
      console.error('Error al obtener el carro:', err);
      return res.status(500).json({ message: 'Error al obtener el carro' });
    }
    
    if (!car) {
      return res.status(404).json({ message: 'Carro no encontrado' });
    }

    // Construcción de los datos para la actualización con valores actuales por defecto
    const carData = { 
      marca: marca || car.marca, 
      modelo: modelo || car.modelo, 
      categoria: categoria || car.categoria, 
      anio: anio ? parseInt(anio, 10) : car.anio, 
      color: color || car.color, 
      tipo_combustible: tipo_combustible || car.tipo_combustible, 
      precio_diaro: precio_diaro ? parseFloat(precio_diaro) : car.precio_diaro, 
      kilometraje: kilometraje ? parseInt(kilometraje, 10) : car.kilometraje, 
      descripcion: descripcion || car.descripcion, 
      disponibilidad: disponibilidad !== undefined ? disponibilidad : car.disponibilidad, 
      imagen: imagen || car.imagen, 
      puertas: puertas ? parseInt(puertas, 10) : car.puertas, 
      pasajeros: pasajeros ? parseInt(pasajeros, 10) : car.pasajeros 
    };

    // Validación de campos obligatorios (solo los campos que fueron proporcionados)
    if (precio_diaro && (isNaN(precio_diaro) || precio_diaro <= 0)) {
      return res.status(400).json({ message: 'El precio diario debe ser un número positivo' });
    }

    if (kilometraje && (isNaN(kilometraje) || kilometraje < 0)) {
      return res.status(400).json({ message: 'El kilometraje debe ser un número válido mayor o igual a 0' });
    }

    if (anio && (isNaN(anio) || anio.toString().length !== 4)) {
      return res.status(400).json({ message: 'El año debe ser un número válido de 4 dígitos' });
    }

    if (puertas && (isNaN(puertas) || puertas <= 0)) {
      return res.status(400).json({ message: 'El número de puertas debe ser un número positivo' });
    }

    if (pasajeros && (isNaN(pasajeros) || pasajeros <= 0)) {
      return res.status(400).json({ message: 'El número de pasajeros debe ser un número positivo' });
    }

    // Actualización del carro en la base de datos
    carModel.updateCar(id, carData, (err) => {
      if (err) {
        console.error('Error al actualizar el carro:', err);
        return res.status(500).json({ message: 'Error al actualizar el carro', error: err.message });
      }

      res.status(200).json({ 
        message: 'Carro actualizado con éxito', 
        carData: { 
          ...carData, 
          precio_original: carData.precio_diaro // Mostrar precio_original como valor de referencia
        } 
      });
    });
  });
};


// Eliminar un carro (solo administradores)
exports.deleteCar = (req, res) => {
  if (!req.user || req.user.rol !== 10) {
    return res.status(403).json({ message: 'No tienes permisos para eliminar un carro' });
  }

  const { id } = req.params;

  carModel.deleteCar(id, (err) => {
    if (err) {
      console.error('Error al eliminar el carro:', err);
      return res.status(500).json({ message: 'Error al eliminar el carro', error: err.message });
    }
    res.json({ message: 'Carro eliminado con éxito' });
  });
};

// Obtener carros relacionados por marca
exports.getRelatedCars = (req, res) => {
  const { marca } = req.query;

  console.log('Marca recibida:', marca);  // Verificar la marca recibida

  if (!marca || typeof marca !== 'string' || marca.trim() === '') {
    return res.status(400).json({ message: 'Debe proporcionar una marca válida para obtener los carros relacionados.' });
  }

  // Llamar al modelo para obtener los carros relacionados
  carModel.getRelatedCars(marca, (err, results) => {
    if (err) {
      console.error('Error al obtener los carros relacionados:', err);
      return res.status(500).json({ message: 'Error al obtener los carros relacionados', error: err.message });
    }

    console.log('Resultados obtenidos desde la consulta SQL:', results);  // Log adicional

    if (results.length === 0) {
      return res.status(404).json({ message: `No se encontraron carros relacionados para la marca ${marca}.` });
    }

    res.json(results);
  });
};