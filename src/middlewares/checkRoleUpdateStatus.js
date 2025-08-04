import createHttpError from 'http-errors';

export const checkRoleUpdateStatus = (req, res, next) => {
  const { role } = req.user;
  const allowedRoles = ['duplo', 'corte'];

  if (!allowedRoles.includes(role)) {
    next(createHttpError(403, 'Access denied: insufficient role'));
    return;
  }
  next();
};
