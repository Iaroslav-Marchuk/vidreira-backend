import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    action: {
      type: String,
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

export const HistoryModel = mongoose.model('History', historySchema);
