import Joi from 'joi';
import { ROLES } from '../constants/roles.js';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  role: Joi.string()
    .valid(...Object.keys(ROLES))
    .required(),
  password: Joi.string().trim().min(6).max(16).required(),
});

export const loginUserSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  password: Joi.string().trim().min(6).max(16),
});
