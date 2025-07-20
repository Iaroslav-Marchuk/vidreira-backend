import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  logOutUserController,
  registerUserController,
} from '../controllers/users.controllers.js';

const userRouter = Router();

userRouter.post('/register', ctrlWrapper(registerUserController));

userRouter.post('/logout', ctrlWrapper(logOutUserController));

export default userRouter;
