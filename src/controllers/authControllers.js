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
    user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUserService(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    sameSite: 'None',
    secure: true,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    sameSite: 'None',
    secure: true,
  });

  res.json({
    status: 200,
    message: 'User is successfully logged',
    accessToken: session.accessToken,
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUserService(req.cookies.sessionId);
  }
  res.clearCookie('sessionId', { sameSite: 'None', secure: true });
  res.clearCookie('refreshToken', { sameSite: 'None', secure: true });

  res.status(204).send();
};

const createSessionController = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
    sameSite: 'None',
    secure: true,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
    sameSite: 'None',
    secure: true,
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
    accessToken: session.accessToken,
  });
};

export const getCurrentUserController = async (req, res) => {
  const sessionId = req.cookies.sessionId;
  const refreshToken = req.cookies.refreshToken;

  if (!sessionId || !refreshToken) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const { user, session } = await getCurrentUserServise(
    sessionId,
    refreshToken,
  );

  res.json({
    status: 200,
    message: 'Current user finded',
    user,
    accessToken: session.accessToken,
  });
};
