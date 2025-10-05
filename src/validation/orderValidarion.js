import Joi from 'joi';

export const createOrderSchema = Joi.object({
  EP: Joi.number().integer().positive().min(1).max(15000).required(),
  cliente: Joi.string().required(),
  local: Joi.object({
    zona: Joi.string().valid('L1', 'L2', 'L3').required(),
  }),
  items: Joi.array().items(
    Joi.object({
      category: Joi.string().required(),
      type: Joi.string().required(),
      temper: Joi.boolean().required(),
      sizeX: Joi.number().integer().positive().min(1).max(6000).required(),
      sizeY: Joi.number().integer().positive().min(1).max(6000).required(),
      sizeZ: Joi.string().min(1).max(20).required(),
      quantity: Joi.number().integer().positive().min(1).required(),
      reason: Joi.string().min(1).max(100).required(),
    })
      .min(1)
      .required(),
  ),
});

export const updateOrderSchema = Joi.object({
  EP: Joi.number().integer().positive().min(1).max(15000),
  cliente: Joi.string(),
  local: Joi.object({
    zona: Joi.string().valid('L1', 'L2', 'L3'),
  }),
});

export const updateOrderItemSchema = Joi.object({
  category: Joi.string(),
  type: Joi.string(),
  temper: Joi.boolean(),
  sizeX: Joi.number().integer().positive().min(1).max(6000),
  sizeY: Joi.number().integer().positive().min(1).max(6000),
  sizeZ: Joi.string().min(1).max(20),
  quantity: Joi.number().integer().positive().min(1),
  reason: Joi.string().min(1).max(100),
});
