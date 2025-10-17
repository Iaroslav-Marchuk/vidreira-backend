import createHttpError from 'http-errors';

export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.hasPermission(permission)) {
      return next(
        createHttpError(403, 'Access forbidden: insufficient permission'),
      );
    }
    next();
  };
};
