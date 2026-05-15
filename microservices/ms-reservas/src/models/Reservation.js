const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    reservationNumber: {
      type: String,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'El nombre completo es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'El correo electrónico no tiene un formato válido'],
    },
    phone: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      match: [/^[0-9]{10}$/, 'El teléfono debe contener exactamente 10 dígitos'],
    },
    peopleCount: {
      type: Number,
      required: [true, 'El número de personas es obligatorio'],
      min: [1, 'Debe haber al menos 1 persona'],
      max: [6, 'El máximo de personas por reservación es 6'],
    },
    date: {
      type: String,
      required: [true, 'La fecha es obligatoria'],
    },
    time: {
      type: String,
      required: [true, 'La hora es obligatoria'],
    },
    zone: {
      type: String,
      enum: {
        values: ['interior', 'terraza', 'barra'],
        message: 'La zona debe ser: interior, terraza o barra',
      },
      required: [true, 'La zona es obligatoria'],
    },
  },
  {
    timestamps: true,
  }
);

reservationSchema.pre('validate', function setReservationNumber(next) {
  if (!this.reservationNumber) {
    this.reservationNumber = `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

reservationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function transform(doc, ret) {
    delete ret._id;
  },
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
