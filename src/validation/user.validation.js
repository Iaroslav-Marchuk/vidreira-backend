import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  role: Joi.string().valid('duplo', 'corte', 'visitante').required(),
  password: Joi.string().trim().min(6).max(16).required(),
});

export const loginUserSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  password: Joi.string().trim().min(6).max(16),
});
