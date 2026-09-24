import apiClient from './api';

export const categoryService = {
  async getAll(params = {}) {
    return await apiClient.get('/categories', params);
  },

  async getById(id) {
    return await apiClient.get(`/categories/${id}`);
  },

  async create(categoryData, user = null) {
    const payload = {
      ...categoryData,
      status: categoryData.status || 'active'
    };
    const created = await apiClient.post('/categories', payload);

    try {
      await apiClient.post('/activities', {
        type: 'CREATE_CATEGORY',
        description: `Nueva categoría creada: ${created.name}`,
        userId: user?.id || null,
        userName: user?.name || 'Sistema',
        timestamp: new Date().toISOString()
      });
    } catch {
      // Ignore
    }

    return created;
  },

  async update(id, categoryData, user = null) {
    const updated = await apiClient.put(`/categories/${id}`, categoryData);

    try {
      await apiClient.post('/activities', {
        type: 'UPDATE_CATEGORY',
        description: `Categoría modificada: ${updated.name}`,
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
    // Check if category is used by products
    const products = await apiClient.get('/products', { categoryId: id });
    if (products && products.length > 0) {
      throw new Error(`No se puede eliminar la categoría porque tiene ${products.length} producto(s) asignado(s).`);
    }

    const existing = await this.getById(id);
    await apiClient.delete(`/categories/${id}`);

    try {
      await apiClient.post('/activities', {
        type: 'DELETE_CATEGORY',
        description: `Categoría eliminada: ${existing?.name || id}`,
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

export default categoryService;
