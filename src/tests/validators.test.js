import {
  isValidEmail,
  isValidPassword,
  validateProductForm,
  validateMovementForm
} from '../utils/validators';

describe('Validators Unit Suite', () => {
  describe('Email validator', () => {
    test('validates correct email formats', () => {
      expect(isValidEmail('admin@stockpilot.com')).toBe(true);
      expect(isValidEmail('juan.perez@empresa.co.cr')).toBe(true);
    });

    test('rejects invalid email formats', () => {
      expect(isValidEmail('correo-sin-arroba')).toBe(false);
      expect(isValidEmail('admin@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
    });
  });

  describe('Password validator', () => {
    test('accepts passwords with >= 6 characters', () => {
      expect(isValidPassword('Admin123!')).toBe(true);
      expect(isValidPassword('123456')).toBe(true);
    });

    test('rejects short passwords', () => {
      expect(isValidPassword('12345')).toBe(false);
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('Product form validation', () => {
    test('validates valid product object', () => {
      const validProduct = {
        name: 'Teclado Mecánico',
        sku: 'TEC-001',
        categoryId: '1',
        purchasePrice: '45.00',
        salePrice: '75.00',
        stock: '10',
        minimumStock: '3'
      };
      const result = validateProductForm(validProduct);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    test('detects missing name, invalid prices and negative stock', () => {
      const invalidProduct = {
        name: '',
        sku: '',
        categoryId: '',
        purchasePrice: '-5',
        salePrice: '0',
        stock: '-2',
        minimumStock: '-1'
      };
      const result = validateProductForm(invalidProduct);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.sku).toBeDefined();
      expect(result.errors.categoryId).toBeDefined();
      expect(result.errors.purchasePrice).toBeDefined();
      expect(result.errors.salePrice).toBeDefined();
      expect(result.errors.stock).toBeDefined();
    });
  });

  describe('Movement form validation', () => {
    test('validates valid movement input', () => {
      const res = validateMovementForm({ productId: '1', type: 'ENTRY', quantity: '5' });
      expect(res.isValid).toBe(true);
    });

    test('rejects exit quantity exceeding current stock', () => {
      const res = validateMovementForm(
        { productId: '1', type: 'EXIT', quantity: '15' },
        10 // current stock
      );
      expect(res.isValid).toBe(false);
      expect(res.errors.quantity).toContain('No hay suficiente stock');
    });
  });
});
