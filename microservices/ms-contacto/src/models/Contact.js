const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  correo: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor proporcione un correo electrónico válido'
    ]
  },
  mensaje: {
    type: String,
    required: [true, 'El mensaje es obligatorio'],
    trim: true
  }
}, {
  timestamps: true // Esto genera automáticamente los campos createdAt y updatedAt
});

// En MongoDB, el ID se almacena como _id.
// Si deseas transformar la respuesta para que el frontend vea "id" en lugar de "_id" y se quite "__v":
contactSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
