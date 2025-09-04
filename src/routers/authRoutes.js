import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

import {
  loginUserSchema,
  registerUserSchema,
} from '../validation/userValidation.js';

import {
  getCurrentUserController,
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
} from '../controllers/authControllers.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshSessionController));

router.get('/currentUser', ctrlWrapper(getCurrentUserController));

export default router;
