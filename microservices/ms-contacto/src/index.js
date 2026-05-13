require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Contact = require('./models/Contact');

// Inicializar la aplicación
const app = express();

// Conectar a la base de datos (MongoDB)
connectDB();

// Middlewares
app.use(express.json()); // Habilita parseo de body en formato JSON
app.use(cors({
  // Permite solicitudes desde el frontend local por defecto, o la URL configurada
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Endpoints
// Healthcheck para verificar que el servicio está vivo
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Microservicio de Contacto en línea' });
});

// Endpoint POST para registrar un mensaje de contacto
app.post('/api/contact', async (req, res) => {
  try {
    const { nombre, correo, mensaje } = req.body;

    // Validación básica de los campos obligatorios
    if (!nombre || !correo || !mensaje) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: nombre, correo y mensaje son requeridos.'
      });
    }

    // Creación y almacenamiento en la base de datos
    const newContact = await Contact.create({
      nombre,
      correo,
      mensaje
    });

    // Respuesta exitosa compatible con Angular HTTP Client
    res.status(201).json({
      success: true,
      message: 'Mensaje enviado y guardado correctamente',
      data: newContact
    });

  } catch (error) {
    console.error('Error al guardar el mensaje de contacto:', error);
    
    // Manejo de errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: `Error de validación: ${messages.join(', ')}`
      });
    }

    // Error interno del servidor
    res.status(500).json({
      success: false,
      message: 'Ocurrió un error en el servidor al procesar su solicitud.'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Microservicio de Contacto ejecutándose en el puerto ${PORT}`);
});
