require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Microservicio de Reservaciones en línea',
  });
});

app.use('/api/reservations', reservationRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Microservicio de Reservaciones ejecutándose en el puerto ${PORT}`);
});
