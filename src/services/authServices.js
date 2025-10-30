import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { UserModel } from '../models/userModel.js';
import { SessionModel } from '../models/sessionModel.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/constants.js';

export const registerUserService = async ({ name, role, password }) => {
  const isExistUser = await UserModel.findOne({ name: name.trim() });

  if (isExistUser) {
    throw new createHttpError.Conflict('Name is already in use');
  }

  const encryptedPass = await bcrypt.hash(password, 10);

  return await UserModel.create({ name, role, password: encryptedPass });
};

export const loginUserService = async ({ name, password }) => {
  const user = await UserModel.findOne({ name: name });
  if (!user) {
    throw createHttpError(404, 'User not found!');
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

export const logoutUserService = async (sessionId) => {
  await SessionModel.deleteOne({ _id: sessionId });
};

export const refreshSessionService = async ({ sessionId, refreshToken }) => {
  const session = await SessionModel.findOne({ _id: sessionId, refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found!');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionModel.deleteOne({ _id: sessionId, refreshToken });

  const newAccessToken = randomBytes(30).toString('base64');
  const newRefreshToken = randomBytes(30).toString('base64');

  return await SessionModel.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const getCurrentUserServise = async (sessionId, refreshToken) => {
  const session = await SessionModel.findOne({ _id: sessionId, refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found or expired');
  }

  const user = await UserModel.findById(session.userId);

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  return { user, session };
};
