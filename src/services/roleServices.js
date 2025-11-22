import { ROLES } from '../constants/roles.js';

export const getAllRolesService = () => {
  return Object.keys(ROLES).map((role) => ({
    value: role,
    permissions: ROLES[role].permissions,
  }));
};
