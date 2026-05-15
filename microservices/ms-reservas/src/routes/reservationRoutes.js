const express = require('express');
const { createReservation, getReservations } = require('../controllers/reservationController');

const router = express.Router();

router.post('/', createReservation);
router.get('/', getReservations);

module.exports = router;
