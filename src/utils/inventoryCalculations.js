/**
 * StockPilot Inventory Calculations Engine
 * Central business logic for inventory metrics, stock status, and movement impacts.
 */

export const STOCK_STATUS = {
  OUT_OF_STOCK: 'out_of_stock',
  LOW_STOCK: 'low_stock',
  AVAILABLE: 'available'
};

export const STOCK_STATUS_LABELS = {
  out_of_stock: 'Agotado',
  low_stock: 'Stock bajo',
  available: 'Disponible'
};

export const MOVEMENT_TYPES = {
  ENTRY: 'ENTRY',
  EXIT: 'EXIT',
  ADJUSTMENT: 'ADJUSTMENT',
  RETURN: 'RETURN'
};

/**
 * Determines stock status based on current stock and minimum stock threshold.
 * stock === 0 -> out_of_stock
 * stock > 0 && stock <= minimumStock -> low_stock
 * stock > minimumStock -> available
 */
export function getStockStatus(stock, minimumStock = 5) {
  const s = Number(stock) || 0;
  const min = Number(minimumStock) || 0;

  if (s <= 0) return STOCK_STATUS.OUT_OF_STOCK;
  if (s <= min) return STOCK_STATUS.LOW_STOCK;
  return STOCK_STATUS.AVAILABLE;
}

export function isOutOfStock(stock) {
  return (Number(stock) || 0) <= 0;
}

export function isLowStock(stock, minimumStock = 5) {
  const s = Number(stock) || 0;
  const min = Number(minimumStock) || 0;
  return s > 0 && s <= min;
}

/**
 * Calculates new stock after applying a movement.
 * - ENTRY: currentStock + quantity
 * - EXIT: currentStock - quantity (cannot be negative)
 * - ADJUSTMENT: set to quantity or difference depending on format; here quantity is the new balance or delta.
 *   For explicit delta: newStock = currentStock + delta.
 *   If type is ADJUSTMENT with positive/negative quantity or absolute target:
 *   Standard rule: ENTRY (+qty), EXIT (-qty), RETURN (+qty), ADJUSTMENT (delta or absolute).
 */
export function calculateMovementImpact(currentStock, movementType, quantity) {
  const curr = Number(currentStock) || 0;
  const qty = Number(quantity) || 0;

  switch (movementType) {
    case MOVEMENT_TYPES.ENTRY:
    case MOVEMENT_TYPES.RETURN:
      return curr + qty;
    case MOVEMENT_TYPES.EXIT: {
      const remaining = curr - qty;
      if (remaining < 0) {
        throw new Error('No es posible realizar una salida que resulte en stock negativo.');
      }
      return remaining;
    }
    case MOVEMENT_TYPES.ADJUSTMENT: {
      // In StockPilot, adjustment can set the exact count or adjust by delta.
      // If quantity is direct new count:
      if (qty < 0) {
        throw new Error('El stock ajustado no puede ser negativo.');
      }
      return qty;
    }
    default:
      return curr;
  }
}

/**
 * Calculate total inventory value: sum of (stock * purchasePrice)
 */
export function getInventoryValue(products = []) {
  if (!Array.isArray(products)) return 0;
  return products.reduce((acc, p) => {
    const stock = Number(p.stock) || 0;
    const price = Number(p.purchasePrice) || 0;
    return acc + (stock * price);
  }, 0);
}

export function getLowStockProducts(products = []) {
  if (!Array.isArray(products)) return [];
  return products.filter(p => isLowStock(p.stock, p.minimumStock));
}

export function getOutOfStockProducts(products = []) {
  if (!Array.isArray(products)) return [];
  return products.filter(p => isOutOfStock(p.stock));
}

/**
 * Totals for movements: entries, exits, adjustments, returns
 */
export function getMovementTotals(movements = []) {
  if (!Array.isArray(movements)) return { entries: 0, exits: 0, adjustments: 0, returns: 0, totalCount: 0 };
  return movements.reduce(
    (acc, m) => {
      const qty = Number(m.quantity) || 0;
      acc.totalCount += 1;
      if (m.type === MOVEMENT_TYPES.ENTRY) acc.entries += qty;
      else if (m.type === MOVEMENT_TYPES.EXIT) acc.exits += qty;
      else if (m.type === MOVEMENT_TYPES.ADJUSTMENT) acc.adjustments += 1;
      else if (m.type === MOVEMENT_TYPES.RETURN) acc.returns += qty;
      return acc;
    },
    { entries: 0, exits: 0, adjustments: 0, returns: 0, totalCount: 0 }
  );
}

/**
 * Top products with most movements
 */
export function getTopMovingProducts(movements = [], limit = 5) {
  if (!Array.isArray(movements)) return [];
  const counts = {};
  movements.forEach(m => {
    const pid = m.productId;
    if (pid) {
      counts[pid] = (counts[pid] || 0) + (Number(m.quantity) || 1);
    }
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([productId, totalQuantity]) => ({ productId: Number(productId) || productId, totalQuantity }));
}
