import { buildPdfReportHtml } from '../utils/pdfReportGenerator';

describe('PDF Report Generator Unit Suite', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Laptop HP Pavilion 15',
      sku: 'TEC-LAP-HP-001',
      barcode: '7441011000018',
      categoryId: 1,
      stock: 12,
      minimumStock: 4,
      purchasePrice: 650.0,
      salePrice: 850.0,
      brand: 'HP'
    },
    {
      id: 2,
      name: 'Taladro DeWalt 20V',
      sku: 'FER-HER-DEW-001',
      barcode: '7441012000025',
      categoryId: 2,
      stock: 0,
      minimumStock: 5,
      purchasePrice: 120.0,
      salePrice: 180.0,
      brand: 'DeWalt'
    }
  ];

  const mockMovements = [
    {
      id: 101,
      productId: 1,
      productName: 'Laptop HP Pavilion 15',
      sku: 'TEC-LAP-HP-001',
      type: 'ENTRY',
      quantity: 15,
      date: '2026-09-20T10:30:00.000Z',
      reason: 'Compra a Proveedor TechSupply',
      userName: 'Administrador'
    },
    {
      id: 102,
      productId: 1,
      productName: 'Laptop HP Pavilion 15',
      sku: 'TEC-LAP-HP-001',
      type: 'EXIT',
      quantity: 3,
      date: '2026-09-22T14:15:00.000Z',
      reason: 'Venta Factura #4092',
      userName: 'Juan Pérez'
    },
    {
      id: 103,
      productId: 2,
      productName: 'Taladro DeWalt 20V',
      sku: 'FER-HER-DEW-001',
      type: 'EXIT',
      quantity: 5,
      date: '2026-09-23T09:00:00.000Z',
      reason: 'Despacho Obra Central',
      userName: 'Administrador'
    }
  ];

  const mockCategories = [
    { id: 1, name: 'Tecnología' },
    { id: 2, name: 'Ferretería' }
  ];

  test('generates valid HTML document structure with title and styles', () => {
    const html = buildPdfReportHtml({
      products: mockProducts,
      movements: mockMovements,
      categories: mockCategories,
      currentUser: { name: 'Admin Test', role: 'admin' },
      crcExchangeRate: 515.0
    });

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('StockPilot');
    expect(html).toContain('INFORME EJECUTIVO DE INVENTARIO Y TRAZABILIDAD TEMPORAL');
    expect(html).toContain('Admin Test');
  });

  test('includes product catalog summary with stock, valuations and SKUs', () => {
    const html = buildPdfReportHtml({
      products: mockProducts,
      movements: mockMovements,
      categories: mockCategories,
      crcExchangeRate: 515.0
    });

    expect(html).toContain('TEC-LAP-HP-001');
    expect(html).toContain('Laptop HP Pavilion 15');
    expect(html).toContain('FER-HER-DEW-001');
    expect(html).toContain('Taladro DeWalt 20V');
    expect(html).toContain('Agotado'); // Stock = 0
    expect(html).toContain('Disponible'); // Stock = 12
  });

  test('includes chronological movement timeline with entries and exits', () => {
    const html = buildPdfReportHtml({
      products: mockProducts,
      movements: mockMovements,
      categories: mockCategories,
      crcExchangeRate: 515.0
    });

    expect(html).toContain('TRAZABILIDAD CRONOLÓGICA DE MOVIMIENTOS');
    expect(html).toContain('INGRESO');
    expect(html).toContain('SALIDA');
    expect(html).toContain('+15 uds');
    expect(html).toContain('-3 uds');
    expect(html).toContain('-5 uds');
    expect(html).toContain('Compra a Proveedor TechSupply');
    expect(html).toContain('Venta Factura #4092');
  });

  test('filters products by category correctly', () => {
    const html = buildPdfReportHtml({
      products: mockProducts,
      movements: mockMovements,
      categories: mockCategories,
      filters: { categoryId: 1 } // Only Tecnología
    });

    expect(html).toContain('Laptop HP Pavilion 15');
    expect(html).not.toContain('FER-HER-DEW-001');
  });

  test('filters movements by date range and type', () => {
    const html = buildPdfReportHtml({
      products: mockProducts,
      movements: mockMovements,
      categories: mockCategories,
      filters: {
        startDate: '2026-09-22',
        endDate: '2026-09-24',
        movementType: 'EXIT'
      }
    });

    // Should include exits on Sep 22 and Sep 23
    expect(html).toContain('Venta Factura #4092');
    expect(html).toContain('Despacho Obra Central');
    // Should NOT include entry on Sep 20
    expect(html).not.toContain('Compra a Proveedor TechSupply');
  });
});
