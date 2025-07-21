import { registerUserService } from '../services/auth.services.js';

export const registerUserController = async (req, res) => {
  const user = await registerUserService(req.body);

  res.status(201).json({
    status: 201,
    message: 'New user registered successfully!',
    user: user,
  });
};
