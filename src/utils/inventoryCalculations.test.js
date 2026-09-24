import {
  getStockStatus,
  STOCK_STATUS,
  isOutOfStock,
  isLowStock,
  calculateMovementImpact,
  getInventoryValue,
  getLowStockProducts,
  getOutOfStockProducts,
  getMovementTotals,
  getTopMovingProducts,
  MOVEMENT_TYPES
} from './inventoryCalculations';

describe('Inventory Calculations Module', () => {
  describe('Stock status resolution', () => {
    test('stock === 0 returns OUT_OF_STOCK', () => {
      expect(getStockStatus(0, 5)).toBe(STOCK_STATUS.OUT_OF_STOCK);
      expect(isOutOfStock(0)).toBe(true);
      expect(isLowStock(0, 5)).toBe(false);
    });

    test('stock > 0 and stock <= minimumStock returns LOW_STOCK', () => {
      expect(getStockStatus(3, 5)).toBe(STOCK_STATUS.LOW_STOCK);
      expect(getStockStatus(5, 5)).toBe(STOCK_STATUS.LOW_STOCK);
      expect(isLowStock(3, 5)).toBe(true);
      expect(isOutOfStock(3)).toBe(false);
    });

    test('stock > minimumStock returns AVAILABLE', () => {
      expect(getStockStatus(12, 5)).toBe(STOCK_STATUS.AVAILABLE);
      expect(isLowStock(12, 5)).toBe(false);
      expect(isOutOfStock(12)).toBe(false);
    });
  });

  describe('Movement impact calculations', () => {
    test('ENTRY increases stock correctly', () => {
      const result = calculateMovementImpact(10, MOVEMENT_TYPES.ENTRY, 5);
      expect(result).toBe(15);
    });

    test('EXIT decreases stock correctly', () => {
      const result = calculateMovementImpact(10, MOVEMENT_TYPES.EXIT, 4);
      expect(result).toBe(6);
    });

    test('EXIT throws error if resulting in negative stock', () => {
      expect(() => {
        calculateMovementImpact(5, MOVEMENT_TYPES.EXIT, 6);
      }).toThrow('No es posible realizar una salida que resulte en stock negativo.');
    });

    test('RETURN increases stock', () => {
      const result = calculateMovementImpact(10, MOVEMENT_TYPES.RETURN, 2);
      expect(result).toBe(12);
    });

    test('ADJUSTMENT sets exact stock level', () => {
      const result = calculateMovementImpact(10, MOVEMENT_TYPES.ADJUSTMENT, 8);
      expect(result).toBe(8);
    });

    test('ADJUSTMENT throws error on negative value', () => {
      expect(() => {
        calculateMovementImpact(10, MOVEMENT_TYPES.ADJUSTMENT, -2);
      }).toThrow('El stock ajustado no puede ser negativo.');
    });
  });

  describe('Aggregations and metrics', () => {
    const mockProducts = [
      { id: 1, name: 'Prod A', stock: 10, purchasePrice: 50, minimumStock: 5 },
      { id: 2, name: 'Prod B', stock: 3, purchasePrice: 100, minimumStock: 5 },
      { id: 3, name: 'Prod C', stock: 0, purchasePrice: 20, minimumStock: 4 }
    ];

    test('getInventoryValue computes total inventory value', () => {
      // (10 * 50) + (3 * 100) + (0 * 20) = 500 + 300 + 0 = 800
      expect(getInventoryValue(mockProducts)).toBe(800);
    });

    test('getLowStockProducts filters items with stock <= minimumStock and > 0', () => {
      const low = getLowStockProducts(mockProducts);
      expect(low).toHaveLength(1);
      expect(low[0].id).toBe(2);
    });

    test('getOutOfStockProducts filters items with stock === 0', () => {
      const out = getOutOfStockProducts(mockProducts);
      expect(out).toHaveLength(1);
      expect(out[0].id).toBe(3);
    });

    test('getMovementTotals computes entries, exits and counts correctly', () => {
      const mockMovements = [
        { type: MOVEMENT_TYPES.ENTRY, quantity: 15, productId: 1 },
        { type: MOVEMENT_TYPES.EXIT, quantity: 5, productId: 1 },
        { type: MOVEMENT_TYPES.EXIT, quantity: 2, productId: 2 },
        { type: MOVEMENT_TYPES.RETURN, quantity: 1, productId: 3 },
        { type: MOVEMENT_TYPES.ADJUSTMENT, quantity: 10, productId: 2 }
      ];

      const totals = getMovementTotals(mockMovements);
      expect(totals.entries).toBe(15);
      expect(totals.exits).toBe(7);
      expect(totals.returns).toBe(1);
      expect(totals.adjustments).toBe(1);
      expect(totals.totalCount).toBe(5);
    });

    test('getTopMovingProducts ranks products by total movement volume', () => {
      const mockMovements = [
        { productId: 1, quantity: 5 },
        { productId: 2, quantity: 20 },
        { productId: 1, quantity: 10 },
        { productId: 3, quantity: 2 }
      ];

      const top = getTopMovingProducts(mockMovements, 2);
      expect(top[0]).toEqual({ productId: 2, totalQuantity: 20 });
      expect(top[1]).toEqual({ productId: 1, totalQuantity: 15 });
    });
  });
});
