import {
  loginUserService,
  logoutUserService,
  registerUserService,
} from '../services/auth.services.js';

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

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  }
};
