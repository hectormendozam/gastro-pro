require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const menuRoutes = require('./routes/menuRoutes');

// Primero se crea `app`
const app = express();

// Luego se conecta la BD
connectDB();

// Luego los middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Luego las rutas
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Microservicio de Menú en línea' });
});

app.use('/api/menu', menuRoutes);

// Finalmente el servidor
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Microservicio de Menú ejecutándose en el puerto ${PORT}`);
});