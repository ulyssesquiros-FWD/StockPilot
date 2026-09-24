/**
 * StockPilot Role-Based Access Control (RBAC) System
 * Roles: 'admin', 'manager' (Encargado de inventario), 'employee'
 */

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
};

export const ROLE_LABELS = {
  admin: 'Administrador',
  manager: 'Encargado de Inventario',
  employee: 'Empleado'
};

// Route access rules per role
const ROUTE_PERMISSIONS = {
  '/dashboard': [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  '/productos': [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  '/productos/nuevo': [ROLES.ADMIN, ROLES.MANAGER],
  '/productos/:id': [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  '/productos/:id/editar': [ROLES.ADMIN, ROLES.MANAGER],
  '/categorias': [ROLES.ADMIN, ROLES.MANAGER],
  '/inventario': [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  '/movimientos': [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  '/proveedores': [ROLES.ADMIN, ROLES.MANAGER],
  '/alertas': [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  '/reportes': [ROLES.ADMIN, ROLES.MANAGER],
  '/usuarios': [ROLES.ADMIN],
  '/configuracion': [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  '/asistente-ia': [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE]
};

/**
 * Checks whether user can access a specific route
 */
export function canAccessRoute(user, routePath) {
  if (!user || !user.role) return false;
  if (user.role === ROLES.ADMIN) return true;

  // Exact match
  if (ROUTE_PERMISSIONS[routePath]) {
    return ROUTE_PERMISSIONS[routePath].includes(user.role);
  }

  // Parameterized matches e.g. /productos/12/editar
  if (routePath.includes('/editar')) {
    return [ROLES.ADMIN, ROLES.MANAGER].includes(user.role);
  }
  if (routePath.startsWith('/productos/')) {
    return [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE].includes(user.role);
  }

  return true;
}

/**
 * Permission checks for granular actions: CREATE, EDIT, DELETE
 */
export function canCreate(user, resource) {
  if (!user || !user.role) return false;
  if (user.role === ROLES.ADMIN) return true;

  if (resource === 'users') return false;
  if (resource === 'products' || resource === 'categories' || resource === 'suppliers') {
    return user.role === ROLES.MANAGER;
  }
  if (resource === 'movements') {
    return [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE].includes(user.role);
  }
  return false;
}

export function canEdit(user, resource) {
  if (!user || !user.role) return false;
  if (user.role === ROLES.ADMIN) return true;

  if (resource === 'users') return false;
  if (resource === 'products' || resource === 'categories' || resource === 'suppliers' || resource === 'settings') {
    return user.role === ROLES.MANAGER;
  }
  return false;
}

export function canDelete(user, resource) {
  if (!user || !user.role) return false;
  // Strictly ADMIN can delete resources, or MANAGER for products if authorized
  if (user.role === ROLES.ADMIN) return true;
  if (user.role === ROLES.MANAGER && resource === 'products') return true;
  return false;
}

export function hasPermission(user, action, resource) {
  switch (action?.toLowerCase()) {
    case 'create':
      return canCreate(user, resource);
    case 'edit':
    case 'update':
      return canEdit(user, resource);
    case 'delete':
      return canDelete(user, resource);
    case 'read':
    case 'view':
      return true;
    default:
      return false;
  }
}
