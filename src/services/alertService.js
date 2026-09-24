import apiClient from './api';

export const alertService = {
  async getAll(params = {}) {
    return await apiClient.get('/alerts', params);
  },

  async getById(id) {
    return await apiClient.get(`/alerts/${id}`);
  },

  async create(alertData) {
    const payload = {
      ...alertData,
      productId: Number(alertData.productId),
      date: alertData.date || new Date().toISOString(),
      status: alertData.status || (alertData.type === 'out_of_stock' ? 'critical' : 'warning'),
      priority: alertData.priority || (alertData.type === 'out_of_stock' ? 'critical' : 'warning')
    };
    return await apiClient.post('/alerts', payload);
  },

  async update(id, alertData) {
    return await apiClient.patch(`/alerts/${id}`, alertData);
  },

  async resolveAlert(id) {
    return await apiClient.patch(`/alerts/${id}`, {
      status: 'resolved',
      resolvedAt: new Date().toISOString()
    });
  },

  async delete(id) {
    return await apiClient.delete(`/alerts/${id}`);
  },

  /**
   * Evaluates a product's stock against its minimum threshold.
   * If stock <= minimumStock or stock === 0, creates an active alert if one doesn't exist.
   */
  async evaluateStockLevel(product) {
    if (!product) return;
    const stock = Number(product.stock) || 0;
    const minStock = Number(product.minimumStock) || 0;

    const existingAlerts = await apiClient.get('/alerts', { productId: product.id });
    const unresolvedAlert = existingAlerts?.find(a => a.status === 'critical' || a.status === 'warning');

    if (stock <= 0) {
      const alertData = {
        productId: product.id,
        type: 'out_of_stock',
        priority: 'critical',
        date: new Date().toISOString(),
        status: 'critical',
        recommendedAction: `Stock agotado (0 unidades) para ${product.name}. Realizar pedido urgente.`
      };

      if (unresolvedAlert) {
        if (unresolvedAlert.type !== 'out_of_stock') {
          await this.update(unresolvedAlert.id, alertData);
        }
      } else {
        await this.create(alertData);
      }
    } else if (stock <= minStock) {
      const alertData = {
        productId: product.id,
        type: 'low_stock',
        priority: 'warning',
        date: new Date().toISOString(),
        status: 'warning',
        recommendedAction: `Stock bajo (${stock} de un mínimo de ${minStock}) para ${product.name}. Reabastecer pronto.`
      };

      if (!unresolvedAlert) {
        await this.create(alertData);
      }
    } else if (unresolvedAlert) {
      // Stock is now above minimumStock, mark previous alert as resolved
      await this.resolveAlert(unresolvedAlert.id);
    }
  }
};

export default alertService;
