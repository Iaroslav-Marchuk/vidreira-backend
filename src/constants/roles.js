export const ROLES = {
  PRODUCTION: {
    permissions: ['create', 'edit', 'delete', 'changeStatus:FINISHED'],
  },

  CUTTING: {
    permissions: ['changeStatus:IN_PROGRESS'],
  },

  TEMPERING: {
    permissions: ['create', 'edit', 'delete'],
  },

  LOGISTIC: {
    permissions: ['create', 'edit', 'delete'],
  },

  QUALITY: {
    permissions: ['create', 'edit', 'delete'],
  },

  GUEST: {
    permissions: [],
  },
};

export const roleCanDo = (role, action, targetStatus = null) => {
  const roleData = ROLES[role];
  if (!roleData) return false;

  if (action === 'changeStatus' && targetStatus) {
    return roleData.permissions.includes(`changeStatus:${targetStatus}`);
  }

  return roleData.permissions.includes(action);
};
