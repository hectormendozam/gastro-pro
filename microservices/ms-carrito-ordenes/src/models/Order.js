const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    dishId: {
      type: String,
      required: [true, 'El identificador del platillo es obligatorio'],
    },
    name: {
      type: String,
      required: [true, 'El nombre del platillo es obligatorio'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'El precio del platillo es obligatorio'],
      min: 0,
    },
    quantity: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: 1,
    },
    subtotal: {
      type: Number,
      required: [true, 'El subtotal del platillo es obligatorio'],
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'La orden debe incluir al menos un platillo',
      },
    },
    subtotal: {
      type: Number,
      required: [true, 'El subtotal es obligatorio'],
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: [true, 'El total es obligatorio'],
      min: 0,
    },
    pickupTime: {
      type: String,
      required: [true, 'La hora de recogida es obligatoria'],
    },
    couponCode: {
      type: String,
      default: null,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre('validate', function setOrderNumber(next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function transform(doc, ret) {
    delete ret._id;
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
