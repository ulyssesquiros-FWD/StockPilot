import {
  canAccessRoute,
  canCreate,
  canEdit,
  canDelete,
  hasPermission,
  ROLES
} from '../utils/permissions';

describe('Permissions & RBAC Engine', () => {
  const adminUser = { id: 1, name: 'Admin', role: ROLES.ADMIN };
  const managerUser = { id: 2, name: 'Manager', role: ROLES.MANAGER };
  const employeeUser = { id: 3, name: 'Employee', role: ROLES.EMPLOYEE };

  describe('Route Access Control', () => {
    test('Admin can access all routes including /usuarios', () => {
      expect(canAccessRoute(adminUser, '/dashboard')).toBe(true);
      expect(canAccessRoute(adminUser, '/usuarios')).toBe(true);
      expect(canAccessRoute(adminUser, '/reportes')).toBe(true);
      expect(canAccessRoute(adminUser, '/productos/nuevo')).toBe(true);
    });

    test('Manager can access inventory, products, reports, but NOT /usuarios', () => {
      expect(canAccessRoute(managerUser, '/dashboard')).toBe(true);
      expect(canAccessRoute(managerUser, '/productos')).toBe(true);
      expect(canAccessRoute(managerUser, '/reportes')).toBe(true);
      expect(canAccessRoute(managerUser, '/usuarios')).toBe(false);
    });

    test('Employee cannot access /usuarios or /reportes or /productos/nuevo', () => {
      expect(canAccessRoute(employeeUser, '/dashboard')).toBe(true);
      expect(canAccessRoute(employeeUser, '/productos')).toBe(true);
      expect(canAccessRoute(employeeUser, '/movimientos')).toBe(true);
      expect(canAccessRoute(employeeUser, '/usuarios')).toBe(false);
      expect(canAccessRoute(employeeUser, '/reportes')).toBe(false);
      expect(canAccessRoute(employeeUser, '/productos/nuevo')).toBe(false);
    });
  });

  describe('Action Permissions (CRUD)', () => {
    test('Admin can create, edit, delete any resource', () => {
      expect(canCreate(adminUser, 'products')).toBe(true);
      expect(canCreate(adminUser, 'users')).toBe(true);
      expect(canEdit(adminUser, 'users')).toBe(true);
      expect(canDelete(adminUser, 'products')).toBe(true);
    });

    test('Manager can create and edit products and suppliers, but cannot manage users', () => {
      expect(canCreate(managerUser, 'products')).toBe(true);
      expect(canCreate(managerUser, 'suppliers')).toBe(true);
      expect(canCreate(managerUser, 'users')).toBe(false);
      expect(canEdit(managerUser, 'users')).toBe(false);
      expect(canDelete(managerUser, 'users')).toBe(false);
    });

    test('Employee can only create movements, cannot delete or edit master resources', () => {
      expect(canCreate(employeeUser, 'movements')).toBe(true);
      expect(canCreate(employeeUser, 'products')).toBe(false);
      expect(canEdit(employeeUser, 'products')).toBe(false);
      expect(canDelete(employeeUser, 'products')).toBe(false);
      expect(canDelete(employeeUser, 'users')).toBe(false);
    });

    test('hasPermission generic wrapper matches specific action logic', () => {
      expect(hasPermission(adminUser, 'delete', 'products')).toBe(true);
      expect(hasPermission(employeeUser, 'delete', 'products')).toBe(false);
      expect(hasPermission(employeeUser, 'read', 'products')).toBe(true);
    });
  });
});
