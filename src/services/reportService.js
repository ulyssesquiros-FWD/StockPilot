import apiClient from './api';
import { getInventoryValue, getStockStatus } from '../utils/inventoryCalculations';

export const reportService = {
  /**
   * Fetches and aggregates complete inventory report data
   */
  async getInventoryReport() {
    const [products, categories, suppliers] = await Promise.all([
      apiClient.get('/products'),
      apiClient.get('/categories'),
      apiClient.get('/suppliers')
    ]);

    const catMap = Object.fromEntries((categories || []).map(c => [c.id, c.name]));
    const supMap = Object.fromEntries((suppliers || []).map(s => [s.id, s.name]));

    const enriched = (products || []).map(p => ({
      ...p,
      categoryName: catMap[p.categoryId] || 'Sin categoría',
      supplierName: supMap[p.supplierId] || 'Sin proveedor',
      stockStatus: getStockStatus(p.stock, p.minimumStock),
      inventoryValue: (Number(p.stock) || 0) * (Number(p.purchasePrice) || 0)
    }));

    const totalValue = getInventoryValue(products);
    const totalItems = products?.length || 0;
    const totalUnits = (products || []).reduce((acc, p) => acc + (Number(p.stock) || 0), 0);

    return {
      products: enriched,
      totalValue,
      totalItems,
      totalUnits
    };
  },

  /**
   * Fetches movements enriched with product information
   */
  async getMovementReport() {
    const [movements, products] = await Promise.all([
      apiClient.get('/movements'),
      apiClient.get('/products')
    ]);

    const prodMap = Object.fromEntries((products || []).map(p => [p.id, p]));

    const enriched = (movements || []).map(m => {
      const prod = prodMap[m.productId];
      return {
        ...m,
        productName: prod ? prod.name : `Producto #${m.productId}`,
        sku: prod ? prod.sku : '-',
        category: prod ? prod.categoryId : '-'
      };
    });

    return {
      movements: enriched,
      totalCount: enriched.length
    };
  },

  /**
   * Generates and downloads a CSV file from formatted data in browser
   */
  exportToCSV(filename, rows, headers) {
    if (!rows || !rows.length) {
      alert('No hay datos disponibles para exportar.');
      return;
    }

    const headerKeys = Object.keys(headers);
    const headerLabels = Object.values(headers);

    const csvContent = [
      headerLabels.join(','),
      ...rows.map(row =>
        headerKeys
          .map(k => {
            let val = row[k] ?? '';
            if (typeof val === 'string') {
              val = `"${val.replace(/"/g, '""')}"`;
            }
            return val;
          })
          .join(',')
      )
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export default reportService;
