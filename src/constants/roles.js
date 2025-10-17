export const ROLES = {
  duplo: {
    label: 'Duplo',
    permissions: ['create', 'edit', 'delete', 'changeStatus:Concluído'],
  },

  corte: {
    label: 'Corte',
    permissions: ['changeStatus:Em produção'],
  },

  forno: {
    label: 'Forno',
    permissions: ['create', 'edit', 'delete'],
  },

  logistica: {
    label: 'Logistica',
    permissions: ['create', 'edit', 'delete'],
  },

  qualidade: {
    label: 'Qualidade',
    permissions: ['create', 'edit', 'delete'],
  },

  visitante: {
    label: 'Visitante',
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
