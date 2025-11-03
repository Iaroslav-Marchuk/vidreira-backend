import mongoose from 'mongoose';

const orderHistorySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Orders',
      required: false,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    action: {
      type: String,
      enum: [
        'criou pedido',
        'corrigiu pedido',
        'eliminou pedido',
        'adicionou artigo',
        'adicionou artigo no pedido',
        'corrigiu artigo',
        'eliminou artigo',
        'mudou estado do pedido',
        'mudou estado do artigo',
      ],
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    versionKey: false,
  },
);

export const OrderHistoryModel = mongoose.model(
  'OrderHistory',
  orderHistorySchema,
);
