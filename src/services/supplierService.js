import apiClient from './api';

export const supplierService = {
  async getAll(params = {}) {
    return await apiClient.get('/suppliers', params);
  },

  async getById(id) {
    return await apiClient.get(`/suppliers/${id}`);
  },

  async create(supplierData, user = null) {
    const payload = {
      ...supplierData,
      associatedProducts: Array.isArray(supplierData.associatedProducts) ? supplierData.associatedProducts : [],
      status: supplierData.status || 'active'
    };

    const created = await apiClient.post('/suppliers', payload);

    try {
      await apiClient.post('/activities', {
        type: 'CREATE_SUPPLIER',
        description: `Nuevo proveedor registrado: ${created.name} (${created.company})`,
        userId: user?.id || null,
        userName: user?.name || 'Sistema',
        timestamp: new Date().toISOString()
      });
    } catch {
      // Ignore
    }

    return created;
  },

  async update(id, supplierData, user = null) {
    const payload = {
      ...supplierData,
      associatedProducts: Array.isArray(supplierData.associatedProducts) ? supplierData.associatedProducts : []
    };

    const updated = await apiClient.put(`/suppliers/${id}`, payload);

    try {
      await apiClient.post('/activities', {
        type: 'UPDATE_SUPPLIER',
        description: `Proveedor actualizado: ${updated.name}`,
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
    // Check if supplier has assigned products
    const products = await apiClient.get('/products', { supplierId: id });
    if (products && products.length > 0) {
      throw new Error(`No es posible eliminar el proveedor porque suministra ${products.length} producto(s) en catálogo.`);
    }

    const existing = await this.getById(id);
    await apiClient.delete(`/suppliers/${id}`);

    try {
      await apiClient.post('/activities', {
        type: 'DELETE_SUPPLIER',
        description: `Proveedor eliminado: ${existing?.name || id}`,
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

export default supplierService;
