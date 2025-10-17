import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    type: { type: String, required: true },
    temper: { type: Boolean, required: true },
    sizeX: { type: Number, required: true },
    sizeY: { type: Number, required: true },
    sizeZ: { type: String, required: true },
    quantity: { type: Number, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['Criado', 'Em produção', 'Concluído'],
      default: 'Criado',
    },
  },
  { timestamps: true },
);

const orderSchema = new mongoose.Schema(
  {
    EP: {
      type: Number,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clients',
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
      },
    },
    status: {
      type: String,
      enum: ['Criado', 'Em produção', 'Concluído'],
      default: 'Criado',
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    items: [itemSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const OrderModel = mongoose.model('Orders', orderSchema);
