import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    EP: {
      type: Number,
      required: true,
    },
    cliente: {
      type: String,
      required: true,
    },
    local: {
      zona: {
        type: String,
        required: true,
        enum: ['L1', 'L2', 'L3'],
      },
      operator: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      required: false,
      enum: ['created', 'inProgress', 'completed'],
    },
    history: {
      type: [String],
      required: false,
    },
    items: [
      {
        category: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        temper: {
          type: Boolean,
          required: true,
        },
        sizeX: {
          type: Number,
          required: true,
        },
        sizeY: {
          type: Number,
          required: true,
        },
        sizeZ: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        reason: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const OrderModel = mongoose.model('Order', orderSchema);
