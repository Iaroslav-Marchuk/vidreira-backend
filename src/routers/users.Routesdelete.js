import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  logOutUserController,
  registerUserController,
} from '../controllers/users.controllers.js';

const router = Router();

router.post('/register', ctrlWrapper(registerUserController));

router.post('/logout', ctrlWrapper(logOutUserController));

export default router;
