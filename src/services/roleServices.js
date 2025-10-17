import { ROLES } from '../constants/roles.js';

export const getAllRolesService = () => {
  return Object.keys(ROLES).map((role) => ({
    value: role,
    label: ROLES[role].label,
    permissions: ROLES[role].permissions,
  }));
};
