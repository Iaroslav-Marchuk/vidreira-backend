import createHttpError from 'http-errors';
import { SessionModel } from '../models/sessionModel.js';
import { UserModel } from '../models/userModel.js';

export const authenticante = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  const [bearer, token] = authorization.split(' ', 2);

  if (bearer !== 'Bearer' || !token) {
    throw createHttpError(401, ' Auth header should be of type Bearer');
  }

  const session = await SessionModel.findOne({ accessToken: token });

  if (!session) {
    next(createHttpError(401, 'Session not found!'));
    return;
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired!'));
    return;
  }

  const user = await UserModel.findById(session.userId);

  if (!user) {
    next(createHttpError(401, 'User not found!'));
    return;
  }

  console.log('Authenticated user role:', user.role);

  req.user = user;
  next();
};
