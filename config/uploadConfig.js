const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Asegúrate de que la carpeta 'uploads' exista
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Agregar un sufijo único al nombre del archivo
  }
});

// Middleware de Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limitar el tamaño del archivo a 5MB
  fileFilter: (req, file, cb) => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.mimetype)) {
      return cb(new Error('Tipo de archivo no válido. Debe ser JPEG, PNG o GIF.'));
    }
    cb(null, true);
  }
});

module.exports = upload;
