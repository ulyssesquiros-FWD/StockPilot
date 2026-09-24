import apiClient from './api';
import productService from './productService';
import { calculateMovementImpact, MOVEMENT_TYPES } from '../utils/inventoryCalculations';

export const movementService = {
  async getAll(params = {}) {
    const data = await apiClient.get('/movements', params);
    if (!Array.isArray(data)) return [];
    return data.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  },

  async getById(id) {
    return await apiClient.get(`/movements/${id}`);
  },

  /**
   * Register a new inventory movement, atomically calculating and updating product stock
   */
  async create(movementData, user = null) {
    const { productId, type, quantity, reason, notes } = movementData;
    const qty = Number(quantity);

    if (!productId) {
      throw new Error('Debe seleccionar un producto válido.');
    }
    if (!type || !Object.values(MOVEMENT_TYPES).includes(type)) {
      throw new Error('Tipo de movimiento no válido. Use ENTRY, EXIT, ADJUSTMENT o RETURN.');
    }
    if (isNaN(qty) || qty <= 0) {
      throw new Error('La cantidad debe ser un número mayor a cero.');
    }

    // 1. Fetch current product
    const product = await productService.getById(productId);
    if (!product) {
      throw new Error('El producto especificado no existe.');
    }

    // 2. Calculate impact and ensure non-negative stock
    const newStock = calculateMovementImpact(product.stock, type, qty);

    // 3. Update product stock in DB
    const updatedProduct = await productService.update(
      productId,
      {
        stock: newStock
      },
      user
    );

    // 4. Save the movement
    const movementPayload = {
      productId: String(productId),
      type,
      quantity: qty,
      reason: reason || 'Movimiento de inventario',
      userId: user?.id ? String(user.id) : null,
      date: new Date().toISOString(),
      notes: notes || ''
    };

    const createdMovement = await apiClient.post('/movements', movementPayload);

    // 5. Register activity
    try {
      const typeLabels = {
        ENTRY: 'Entrada',
        EXIT: 'Salida',
        ADJUSTMENT: 'Ajuste',
        RETURN: 'Devolución'
      };
      await apiClient.post('/activities', {
        type: 'CREATE_MOVEMENT',
        description: `${typeLabels[type]} de ${qty} unidades en ${product.name} (Stock resultante: ${newStock})`,
        userId: user?.id || null,
        userName: user?.name || 'Sistema',
        timestamp: new Date().toISOString()
      });
    } catch {
      // Ignore
    }

    return { movement: createdMovement, product: updatedProduct };
  },

  async delete(id) {
    return await apiClient.delete(`/movements/${id}`);
  }
};

export default movementService;
