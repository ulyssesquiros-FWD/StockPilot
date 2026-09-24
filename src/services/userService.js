import apiClient from './api';

export const userService = {
  async getAll(params = {}) {
    return await apiClient.get('/users', params);
  },

  async getById(id) {
    return await apiClient.get(`/users/${id}`);
  },

  async create(userData, adminUser = null) {
    const cleanEmail = userData.email?.trim().toLowerCase();

    // Check duplicate
    const existing = await apiClient.get('/users', { email: cleanEmail });
    if (existing && existing.length > 0) {
      throw new Error('Ya existe un usuario con este correo electrónico.');
    }

    const payload = {
      ...userData,
      email: cleanEmail,
      status: userData.status || 'active',
      role: userData.role || 'employee',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };

    const created = await apiClient.post('/users', payload);

    try {
      await apiClient.post('/activities', {
        type: 'CREATE_USER',
        description: `Usuario creado: ${created.name} con rol ${created.role}`,
        userId: adminUser?.id || null,
        userName: adminUser?.name || 'Administrador',
        timestamp: new Date().toISOString()
      });
    } catch {
      // Ignore
    }

    return created;
  },

  async update(id, userData, adminUser = null) {
    const updated = await apiClient.patch(`/users/${id}`, userData);

    try {
      await apiClient.post('/activities', {
        type: 'UPDATE_USER',
        description: `Usuario modificado: ${updated.name} (Rol: ${updated.role}, Estado: ${updated.status})`,
        userId: adminUser?.id || null,
        userName: adminUser?.name || 'Administrador',
        timestamp: new Date().toISOString()
      });
    } catch {
      // Ignore
    }

    return updated;
  },

  async delete(id, adminUser = null) {
    const existing = await this.getById(id);
    await apiClient.delete(`/users/${id}`);

    try {
      await apiClient.post('/activities', {
        type: 'DELETE_USER',
        description: `Usuario eliminado: ${existing?.name || id}`,
        userId: adminUser?.id || null,
        userName: adminUser?.name || 'Administrador',
        timestamp: new Date().toISOString()
      });
    } catch {
      // Ignore
    }

    return true;
  }
};

export default userService;
