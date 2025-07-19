import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: false,
      enum: ['created', 'inProgress', 'completed'],
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
    EP: {
      type: Number,
      required: true,
    },
    cliente: {
      type: String,
      required: true,
    },
    history: {
      type: [String],
      required: false,
    },
    uitems: [
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
