import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { UserModel } from '../models/user.model.js';
import { SessionModel } from '../models/session.model.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/constants.js';

export const registerUserService = async ({ name, role, password }) => {
  const isExistUser = await UserModel.findOne({ name });

  if (isExistUser) {
    throw new createHttpError.Conflict('Name is already in use');
  }

  const encryptedPass = await bcrypt.hash(password, 10);

  return await UserModel.create({ name, role, password: encryptedPass });
};

export const loginUserService = async ({ name, password }) => {
  const user = await UserModel.findOne({ name: name });
  if (!user) {
    throw createHttpError(401, 'User not found!');
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Not authorized');
  }

  await SessionModel.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionModel.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};
