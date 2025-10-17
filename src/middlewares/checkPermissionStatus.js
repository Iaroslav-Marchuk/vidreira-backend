import createHttpError from 'http-errors';
import { roleCanDo } from '../constants/roles.js';

export const checkPermissionStatus = (req, res, next) => {
  const { status: newStatus } = req.body;
  const userRole = req.user.role;

  if (!roleCanDo(userRole, 'changeStatus', newStatus)) {
    return next(
      createHttpError(
        403,
        `Access forbidden: role '${userRole}' can't set status '${newStatus}'`,
      ),
    );
  }

  next();
};
