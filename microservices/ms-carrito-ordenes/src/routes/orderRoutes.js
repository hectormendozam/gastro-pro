const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

module.exports = router;
