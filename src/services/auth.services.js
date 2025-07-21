import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user.model.js';

export const registerUserService = async ({ name, role, password }) => {
  const isExistUser = await UserModel.findOne({ name });

  if (isExistUser) {
    throw new createHttpError.Conflict('Name is already in use');
  }

  const encryptedPass = await bcrypt.hash(password, 10);

  return await UserModel.create({ name, role, password: encryptedPass });
};
