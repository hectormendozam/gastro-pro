const Order = require('../models/Order');

const isPickupTimeValid = (time) => {
  if (!time) {
    return false;
  }

  const [hours, minutes] = time.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return false;
  }

  const totalMinutes = hours * 60 + minutes;
  return totalMinutes >= 12 * 60 && totalMinutes <= 22 * 60;
};

const normalizeItems = (items = []) =>
  items.map((item) => {
    const dish = item.dish || {};
    const dishId = item.dishId ?? dish.id;
    const name = item.name ?? dish.name;
    const price = item.price ?? dish.price;
    const quantity = item.quantity;
    const subtotal = item.subtotal ?? Number(price) * Number(quantity);

    return {
      dishId: String(dishId),
      name,
      price: Number(price),
      quantity: Number(quantity),
      subtotal: Number(subtotal),
    };
  });

const calculateSubtotal = (items) =>
  items.reduce((acc, item) => acc + item.subtotal, 0);

const calculateDiscount = (subtotal, couponCode) => {
  if (couponCode === 'DESCUENTO10') {
    return subtotal * 0.1;
  }

  return 0;
};

const createOrder = async (req, res) => {
  try {
    const { items, pickupTime, couponCode = null } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debes enviar al menos un platillo en la orden.',
      });
    }

    if (!isPickupTimeValid(pickupTime)) {
      return res.status(400).json({
        success: false,
        message: 'La hora de recogida debe estar entre 12:00 y 22:00.',
      });
    }

    const normalizedCoupon = couponCode ? String(couponCode).trim().toUpperCase() : null;
    const normalizedItems = normalizeItems(items);

    const hasInvalidItem = normalizedItems.some(
      (item) =>
        !item.dishId ||
        !item.name ||
        Number.isNaN(item.price) ||
        Number.isNaN(item.quantity) ||
        Number.isNaN(item.subtotal) ||
        item.quantity < 1 ||
        item.subtotal < 0
    );

    if (hasInvalidItem) {
      return res.status(400).json({
        success: false,
        message: 'Los productos de la orden tienen información inválida.',
      });
    }
    const subtotal = calculateSubtotal(normalizedItems);
    const discount = calculateDiscount(subtotal, normalizedCoupon);
    const total = subtotal - discount;

    const order = await Order.create({
      items: normalizedItems,
      subtotal,
      discount,
      total,
      pickupTime,
      couponCode: normalizedCoupon,
      status: 'confirmed',
    });

    res.status(201).json({
      success: true,
      message: 'Orden creada correctamente.',
      data: order,
    });
  } catch (error) {
    console.error('Error al crear la orden:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((value) => value.message);
      return res.status(400).json({
        success: false,
        message: `Error de validación: ${messages.join(', ')}`,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Ocurrió un error en el servidor al crear la orden.',
    });
  }
};

const getOrders = async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    res.status(500).json({
      success: false,
      message: 'Ocurrió un error en el servidor al consultar las órdenes.',
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró la orden solicitada.',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error al consultar la orden:', error);
    res.status(500).json({
      success: false,
      message: 'Ocurrió un error en el servidor al consultar la orden.',
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};
