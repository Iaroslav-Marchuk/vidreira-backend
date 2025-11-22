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
        'ORDER_CREATED',
        'ORDER_EDITED',
        'ORDER_DELETED',
        'ITEM_ADDED',
        'ITEM_ADDED_TO_ORDER',
        'ITEM_EDITED',
        'ITEM_DELETED',
        'STATUS_OF_ORDER_CHANGED',
        'STATUS_OF_ITEM_CHANGED',
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
