const express = require('express');
const router = express.Router();
const { generateResponse } = require('../controllers/geminic.ontroller');
const { verifyToken } = require('../middlewares/authMiddleware');

// Ruta para generar una respuesta usando Gemini
router.post('/generate', verifyToken, generateResponse);

module.exports = router;
