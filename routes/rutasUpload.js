const express = require('express');
const path = require('path');
const upload = require('../config/uploadConfig');
const router = express.Router();

// Ruta para subir la imagen
router.post('/upload-image', upload.single('image'), (req, res) => {
    if (req.file) {
        return res.status(200).json({
            message: 'Imagen subida con éxito',
            filePath: `/uploads/${req.file.filename}` // Ruta para acceder a la imagen subida
        });
    }
    res.status(400).json({ message: 'Error al subir la imagen' });
});

// Ruta para obtener la imagen
router.get('/get-image/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '..', 'uploads', filename);

    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).json({ message: 'Imagen no encontrada' });
        }
    });
});

module.exports = router;