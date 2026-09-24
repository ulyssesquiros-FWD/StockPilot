import apiClient from './api';
import {
  getInventoryValue,
  getLowStockProducts,
  getOutOfStockProducts,
  getMovementTotals,
  getTopMovingProducts
} from '../utils/inventoryCalculations';

export const inventoryService = {
  /**
   * Aggregates live data from JSON Server for the Dashboard
   */
  async getDashboardStats() {
    const [products, movements, alerts, activities, categories] = await Promise.all([
      apiClient.get('/products'),
      apiClient.get('/movements'),
      apiClient.get('/alerts'),
      apiClient.get('/activities', { _limit: 8, _sort: 'timestamp', _order: 'desc' }),
      apiClient.get('/categories')
    ]);

    const prods = products || [];
    const moves = movements || [];
    const alrts = alerts || [];
    const acts = activities || [];
    const cats = categories || [];

    // Calculate core KPIs
    const totalProducts = prods.length;
    const lowStockItems = getLowStockProducts(prods);
    const outOfStockItems = getOutOfStockProducts(prods);
    const totalInventoryValue = getInventoryValue(prods);

    // Movement totals
    const movementTotals = getMovementTotals(moves);

    // Top moving products
    const topMoving = getTopMovingProducts(moves, 5);
    const prodMap = Object.fromEntries(prods.map(p => [p.id, p]));
    const topProductsEnriched = topMoving.map(t => ({
      ...t,
      product: prodMap[t.productId] || { name: `Producto #${t.productId}` }
    }));

    // Stock by category for BarChart
    const catMap = Object.fromEntries(cats.map(c => [c.id, c.name]));
    const stockByCategoryObj = {};
    prods.forEach(p => {
      const catName = catMap[p.categoryId] || 'Otros';
      stockByCategoryObj[catName] = (stockByCategoryObj[catName] || 0) + (Number(p.stock) || 0);
    });
    const categoryDistribution = Object.entries(stockByCategoryObj).map(([name, stock]) => ({
      name,
      stock
    }));

    // Stock health distribution for Donut/Pie chart
    const healthyStockCount = prods.filter(p => !lowStockItems.includes(p) && !outOfStockItems.includes(p)).length;
    const stockHealth = [
      { name: 'Disponible', value: healthyStockCount, color: '#10B981' },
      { name: 'Stock Bajo', value: lowStockItems.length, color: '#F59E0B' },
      { name: 'Agotado', value: outOfStockItems.length, color: '#EF4444' }
    ];

    // Movements by type for Bar/Line representation
    const movementsByType = [
      { type: 'Entradas', cantidad: movementTotals.entries, color: '#10B981' },
      { type: 'Salidas', cantidad: movementTotals.exits, color: '#EF4444' },
      { type: 'Ajustes', cantidad: movementTotals.adjustments, color: '#3B82F6' },
      { type: 'Devoluciones', cantidad: movementTotals.returns, color: '#F59E0B' }
    ];

    return {
      kpis: {
        totalProducts,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length,
        totalInventoryValue
      },
      lowStockItems,
      outOfStockItems,
      movementTotals,
      topProducts: topProductsEnriched,
      categoryDistribution,
      stockHealth,
      movementsByType,
      recentActivities: acts,
      criticalAlerts: alrts.filter(a => a.status === 'critical' || a.status === 'warning')
    };
  }
};

export default inventoryService;
