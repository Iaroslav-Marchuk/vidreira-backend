import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserController } from '../controllers/users.controller.js';

const router = Router();

router.post('/register', ctrlWrapper(registerUserController));

export default router;
