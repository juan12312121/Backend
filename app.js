// app.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Asegúrate de importar path

// Importar rutas
const rutasAutenticacion = require('./routes/rutasAutenticacion');
const rutasAuto = require('./routes/rutasAuto');
const rutasIncidente = require('./routes/rutasIncidente');
const geminiRoutes = require('./routes/gemini');
const rutasReportes = require('./routes/rutasreportes')
const rutasPago = require('./routes/rutasPago'); // Asegúrate de que el nombre del archivo sea correcto
const rutasHistorialIncidentes = require('./routes/rutasHistorialIncidentes');
const rutasHistorialMantenimiento = require('./routes/rutasHistorialMantenimiento');
const rutasMantenimiento = require('./routes/rutasMantenimiento');
const rutasPromocion = require('./routes/rutasPromocion');


const rutasDevoluciones = require('./routes/rutasDevoluciones');



const rutasCalificacion = require('./routes/rutasCalificacion');

const rutasReservacion = require('./routes/rutasReservacion');
const rutasUpload = require('./routes/rutasUpload');

const { verifyToken } = require('./middlewares/authMiddleware');

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json()); 

// Servir archivos estáticos de la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Aquí usamos path

// Rutas
app.use('/carros', rutasAuto);
app.use('/pago', rutasPago);
app.use('/reportes', rutasReportes);
app.use('/promociones', rutasPromocion);
app.use('/usuario', rutasAutenticacion);
app.use('/valoracion', rutasCalificacion);
app.use('/mantenimiento', rutasMantenimiento);
app.use('/reservas', rutasReservacion);
app.use('/upload', rutasUpload);
app.use('/api/gemini', geminiRoutes);



// Ruta general de 404: Esta debe ir **al final** de todas tus rutas.
app.all('*', (req, res) => {
    res.status(404).send('Página no encontrada');
});

// Inicializar el servidor
const port = process.env.PORT || 3501;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
