import { ONE_DAY } from '../constants/constants.js';
import {
  getCurrentUserServise,
  loginUserService,
  logoutUserService,
  refreshSessionService,
  registerUserService,
} from '../services/authServices.js';

export const registerUserController = async (req, res) => {
  const user = await registerUserService(req.body);

  res.status(201).json({
    status: 201,
    message: 'New user registered successfully!',
    user: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUserService(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'User is successfully logged',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUserService(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

const createSessionController = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshSessionController = async (req, res) => {
  const session = await refreshSessionService({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  createSessionController(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};

export const getCurrentUserController = async (req, res) => {
  const sessionId = req.cookies.sessionId;
  const refreshToken = req.cookies.refreshToken;

  if (!sessionId || !refreshToken) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const user = await getCurrentUserServise(sessionId, refreshToken);

  res.json({
    status: 200,
    message: 'Current user finded',
    data: user,
  });
};
