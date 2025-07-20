import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = (req, res, next) => {
  const { orderId } = req.params;
  if (!isValidObjectId(orderId)) {
    throw createHttpError(400, 'Bad request!');
  }
  next();
};
