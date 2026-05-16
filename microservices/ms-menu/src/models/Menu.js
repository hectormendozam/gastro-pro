const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del platillo es obligatorio']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio']
  },
  imagen: {
    type: String,
    required: [true, 'La URL de la imagen es obligatoria']
  },
  categoria: {
    type: String,
    enum: ['entradas', 'platos fuertes', 'postres', 'bebidas'],
    required: [true, 'La categoría es obligatoria']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Menu', menuSchema);