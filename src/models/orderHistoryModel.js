import mongoose from 'mongoose';

const orderHistorySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Orders',
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    action: {
      type: String,
      enum: [
        'Order criado',
        'Order corrigido',
        'Artigo corrigido',
        'Artigo eliminado',
        'Estado mudado',
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
