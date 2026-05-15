const Reservation = require('../models/Reservation');

const isTimeValid = (time) => {
  if (!time) return false;

  const [hours, minutes] = time.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;

  const totalMinutes = hours * 60 + minutes;
  return totalMinutes >= 13 * 60 && totalMinutes <= 22 * 60;
};

const isFutureDateTime = (date, time) => {
  const selectedDateTime = new Date(`${date}T${time}`);
  const now = new Date();
  now.setSeconds(0, 0);
  return selectedDateTime >= now;
};

const createReservation = async (req, res) => {
  try {
    const { fullName, email, phone, peopleCount, date, time, zone } = req.body;

    if (!isTimeValid(time)) {
      return res.status(400).json({
        success: false,
        message: 'El horario de reservación debe estar entre las 13:00 y las 22:00.',
      });
    }

    if (!isFutureDateTime(date, time)) {
      return res.status(400).json({
        success: false,
        message: 'No puedes realizar una reservación en una fecha y hora pasada.',
      });
    }

    const duplicate = await Reservation.findOne({ email, date, time, zone });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una reservación con este correo para esa fecha, hora y zona.',
      });
    }

    const reservation = await Reservation.create({
      fullName,
      email,
      phone,
      peopleCount,
      date,
      time,
      zone,
    });

    res.status(201).json({
      success: true,
      message: 'Reservación creada correctamente.',
      data: reservation,
    });
  } catch (error) {
    console.error('Error al crear la reservación:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((value) => value.message);
      return res.status(400).json({
        success: false,
        message: `Error de validación: ${messages.join(', ')}`,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Ocurrió un error en el servidor al crear la reservación.',
    });
  }
};

const getReservations = async (_req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.error('Error al obtener las reservaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Ocurrió un error en el servidor al consultar las reservaciones.',
    });
  }
};

module.exports = {
  createReservation,
  getReservations,
};
