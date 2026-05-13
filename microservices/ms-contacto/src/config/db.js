const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Intenta conectar a la URI proporcionada en las variables de entorno, o usa un default
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gastropro');
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error de conexión a MongoDB: ${error.message}`);
    // Si la conexión falla, se detiene el proceso del microservicio
    process.exit(1);
  }
};

module.exports = connectDB;
