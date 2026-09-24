import apiClient from './api';
import alertService from './alertService';

export const productService = {
  async getAll(params = {}) {
    return await apiClient.get('/products', params);
  },

  async getById(id) {
    return await apiClient.get(`/products/${id}`);
  },

  async create(productData, user = null) {
    const payload = {
      ...productData,
      purchasePrice: Number(productData.purchasePrice) || 0,
      salePrice: Number(productData.salePrice) || 0,
      stock: Number(productData.stock) || 0,
      minimumStock: Number(productData.minimumStock) || 0,
      categoryId: Number(productData.categoryId) || null,
      supplierId: Number(productData.supplierId) || null,
      status: productData.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = await apiClient.post('/products', payload);

    // Automatic alert evaluation
    try {
      await alertService.evaluateStockLevel(created);
    } catch {
      // Ignore background alert generation errors
    }

    // Register activity
    try {
      await apiClient.post('/activities', {
        type: 'CREATE_PRODUCT',
        description: `Producto creado: ${created.name} (SKU: ${created.sku})`,
        userId: user?.id || null,
        userName: user?.name || 'Sistema',
        timestamp: new Date().toISOString()
      });
    } catch {
      // Ignore
    }

    return created;
  },

  async update(id, productData, user = null) {
    const payload = {
      ...productData,
      updatedAt: new Date().toISOString()
    };
    if (productData.purchasePrice !== undefined) payload.purchasePrice = Number(productData.purchasePrice) || 0;
    if (productData.salePrice !== undefined) payload.salePrice = Number(productData.salePrice) || 0;
    if (productData.stock !== undefined) payload.stock = Number(productData.stock) || 0;
    if (productData.minimumStock !== undefined) payload.minimumStock = Number(productData.minimumStock) || 0;
    if (productData.categoryId !== undefined) payload.categoryId = Number(productData.categoryId) || null;
    if (productData.supplierId !== undefined) payload.supplierId = Number(productData.supplierId) || null;

    const updated = await apiClient.patch(`/products/${id}`, payload);

    // Automatic alert evaluation
    try {
      await alertService.evaluateStockLevel(updated);
    } catch {
      // Ignore
    }

    // Register activity
    try {
      await apiClient.post('/activities', {
        type: 'UPDATE_PRODUCT',
        description: `Producto actualizado: ${updated.name} (Stock: ${updated.stock})`,
        userId: user?.id || null,
        userName: user?.name || 'Sistema',
        timestamp: new Date().toISOString()
      });
    } catch {
      // Ignore
    }

    return updated;
  },

  async delete(id, user = null) {
    const existing = await this.getById(id);
    await apiClient.delete(`/products/${id}`);

    // Register activity
    try {
      await apiClient.post('/activities', {
        type: 'DELETE_PRODUCT',
        description: `Producto eliminado: ${existing?.name || id}`,
        userId: user?.id || null,
        userName: user?.name || 'Sistema',
        timestamp: new Date().toISOString()
      });
    } catch {
      // Ignore
    }

    return true;
  }
};

export default productService;
