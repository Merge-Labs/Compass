// src/constants/roles.js
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGEMENT_LEAD: 'management_lead',
  GRANT_OFFICER: 'grant_officer'
};

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    label: 'Super Admin',
    description: 'Full system access',
    dashboard: '/dashboard/super-admin',
    permissions: ['all']
  },
  [ROLES.ADMIN]: {
    label: 'Admin',
    description: 'Administrative access',
    dashboard: '/dashboard/admin',
    permissions: ['manage_users', 'view_reports', 'manage_grants']
  },
  [ROLES.MANAGEMENT_LEAD]: {
    label: 'Management Lead',
    description: 'Management oversight',
    dashboard: '/dashboard/management-lead',
    permissions: ['view_reports', 'manage_team', 'approve_grants']
  },
  [ROLES.GRANT_OFFICER]: {
    label: 'Grant Officer',
    description: 'Grant processing',
    dashboard: '/dashboard/grant-officer',
    permissions: ['process_applications', 'view_grants']
  }
};

export const getRoleInfo = (role) => {
  return ROLE_PERMISSIONS[role] || null;
};

export const getDashboardRoute = (role) => {
  return ROLE_PERMISSIONS[role]?.dashboard || '/';
};