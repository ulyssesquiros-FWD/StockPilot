/**
 * StockPilot PDF Report Generator Engine
 * Generates corporate-grade executive reports with product catalog state,
 * financial valuations, and chronological timeline of entries and exits.
 */

export function buildPdfReportHtml({
  products = [],
  movements = [],
  categories = [],
  suppliers = [],
  currentUser = null,
  filters = {},
  crcExchangeRate = 515.0
}) {
  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat('es-CR', {
    dateStyle: 'full',
    timeStyle: 'medium'
  }).format(now);

  const catMap = Object.fromEntries((categories || []).map(c => [c.id, c.name]));
  const supMap = Object.fromEntries((suppliers || []).map(s => [s.id, s.name]));
  const prodMap = Object.fromEntries((products || []).map(p => [p.id, p]));

  // 1. Filter Products
  let filteredProducts = [...products];
  if (filters.categoryId && filters.categoryId !== 'all') {
    filteredProducts = filteredProducts.filter(p => String(p.categoryId) === String(filters.categoryId));
  }
  if (filters.status && filters.status !== 'all') {
    if (filters.status === 'out_of_stock') {
      filteredProducts = filteredProducts.filter(p => Number(p.stock) <= 0);
    } else if (filters.status === 'low_stock') {
      filteredProducts = filteredProducts.filter(p => Number(p.stock) > 0 && Number(p.stock) <= Number(p.minimumStock));
    } else if (filters.status === 'available') {
      filteredProducts = filteredProducts.filter(p => Number(p.stock) > Number(p.minimumStock));
    }
  }

  // 2. Filter Movements (Chronological timeline)
  let filteredMovements = [...movements];
  if (filters.categoryId && filters.categoryId !== 'all') {
    const validCategoryProductIds = new Set(filteredProducts.map(p => String(p.id)));
    filteredMovements = filteredMovements.filter(m => validCategoryProductIds.has(String(m.productId)));
  }
  if (filters.startDate) {
    const start = new Date(filters.startDate).getTime();
    filteredMovements = filteredMovements.filter(m => new Date(m.date).getTime() >= start);
  }
  if (filters.endDate) {
    const end = new Date(filters.endDate + 'T23:59:59').getTime();
    filteredMovements = filteredMovements.filter(m => new Date(m.date).getTime() <= end);
  }
  if (filters.movementType && filters.movementType !== 'all') {
    filteredMovements = filteredMovements.filter(m => m.type === filters.movementType);
  }
  if (filters.productId && filters.productId !== 'all') {
    filteredMovements = filteredMovements.filter(m => String(m.productId) === String(filters.productId));
  }

  // Sort movements chronologically (most recent first or oldest first based on preference)
  filteredMovements.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 3. Aggregate Financial & Inventory Metrics
  const totalProductsCount = filteredProducts.length;
  const totalUnitsInStock = filteredProducts.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const outOfStockItems = filteredProducts.filter(p => Number(p.stock) <= 0);
  const lowStockItems = filteredProducts.filter(p => Number(p.stock) > 0 && Number(p.stock) <= Number(p.minimumStock));
  const normalStockItems = filteredProducts.filter(p => Number(p.stock) > Number(p.minimumStock));

  const totalValueUSD = filteredProducts.reduce(
    (acc, p) => acc + (Number(p.stock) || 0) * (Number(p.purchasePrice) || 0),
    0
  );
  const totalValueCRC = totalValueUSD * (Number(crcExchangeRate) || 515);

  const potentialRevenueUSD = filteredProducts.reduce(
    (acc, p) => acc + (Number(p.stock) || 0) * (Number(p.salePrice) || 0),
    0
  );
  const potentialProfitUSD = potentialRevenueUSD - totalValueUSD;

  // 4. Movement Aggregates
  const totalEntries = filteredMovements
    .filter(m => m.type === 'ENTRY')
    .reduce((acc, m) => acc + (Number(m.quantity) || 0), 0);
  const totalExits = filteredMovements
    .filter(m => m.type === 'EXIT')
    .reduce((acc, m) => acc + (Number(m.quantity) || 0), 0);
  const totalAdjustments = filteredMovements
    .filter(m => m.type === 'ADJUSTMENT' || m.type === 'RETURN')
    .reduce((acc, m) => acc + (Number(m.quantity) || 0), 0);

  // Helper Formatters
  const fmtUsd = (num) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(num) || 0);
  const fmtCrc = (num) =>
    new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(Number(num) || 0);
  const fmtDateTime = (dStr) => {
    if (!dStr) return '-';
    try {
      const d = new Date(dStr);
      return new Intl.DateTimeFormat('es-CR', {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(d);
    } catch {
      return dStr;
    }
  };

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>StockPilot - Informe Ejecutivo de Inventario y Trazabilidad</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 16mm 14mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      font-size: 11px;
      line-height: 1.45;
      margin: 0;
      padding: 0;
    }
    .report-header {
      border-bottom: 2px solid #0a2e5b;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-logo-area {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-badge {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, #0a2e5b 0%, #1e5af2 100%);
      color: #ffffff;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 20px;
      letter-spacing: -1px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      color: #0a2e5b;
      margin: 0;
      line-height: 1.1;
    }
    .brand-subtitle {
      font-size: 10px;
      color: #64748b;
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .meta-box {
      text-align: right;
      font-size: 10px;
      color: #475569;
    }
    .report-title-bar {
      background: #f1f5f9;
      border-left: 4px solid #1e5af2;
      padding: 10px 14px;
      border-radius: 4px;
      margin-bottom: 16px;
    }
    .report-title-bar h2 {
      margin: 0;
      font-size: 15px;
      color: #0f172a;
      font-weight: 700;
    }
    .report-title-bar p {
      margin: 4px 0 0;
      font-size: 10.5px;
      color: #475569;
    }
    /* KPI Cards Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    .kpi-card {
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      border-radius: 6px;
      padding: 10px 12px;
    }
    .kpi-label {
      font-size: 9.5px;
      text-transform: uppercase;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 4px;
    }
    .kpi-value {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
    }
    .kpi-sub {
      font-size: 9px;
      color: #64748b;
      margin-top: 2px;
    }
    .section-title {
      font-size: 12.5px;
      font-weight: 700;
      color: #0a2e5b;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 4px;
      margin: 20px 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .section-badge {
      font-size: 10px;
      font-weight: 600;
      color: #475569;
    }
    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 10px;
    }
    thead {
      display: table-header-group;
    }
    tr {
      page-break-inside: avoid;
    }
    th {
      background-color: #0a2e5b;
      color: #ffffff;
      text-align: left;
      padding: 6px 8px;
      font-weight: 600;
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    td {
      padding: 6px 8px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: middle;
    }
    tbody tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .sku-code {
      font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 700;
      color: #1e5af2;
      font-size: 9.5px;
    }
    /* Badges */
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 8.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .badge-success { background-color: #d1fae5; color: #065f46; }
    .badge-warning { background-color: #fef3c7; color: #92400e; }
    .badge-danger { background-color: #fee2e2; color: #991b1b; }
    .badge-entry { background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
    .badge-exit { background-color: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
    .badge-adjust { background-color: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

    /* Summary callout */
    .summary-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      background-color: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 16px;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e2e8f0;
      padding: 3px 0;
      font-size: 10px;
    }
    .summary-item strong {
      color: #0f172a;
    }
    /* Signature Block */
    .signature-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 36px;
      page-break-inside: avoid;
    }
    .signature-line {
      border-top: 1px solid #94a3b8;
      text-align: center;
      padding-top: 6px;
      font-size: 9.5px;
      color: #475569;
    }
    .report-footer {
      margin-top: 24px;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #94a3b8;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>

  <!-- Report Header -->
  <div class="report-header">
    <div class="brand-logo-area">
      <div class="logo-badge">SP</div>
      <div>
        <h1 class="brand-title">StockPilot</h1>
        <div class="brand-subtitle">Sistema Integral de Gestión de Inventarios y Logística</div>
      </div>
    </div>
    <div class="meta-box">
      <div><strong>Emisión:</strong> ${formattedDate}</div>
      <div><strong>Generado por:</strong> ${currentUser?.name || 'Administrador'} (${currentUser?.role || 'admin'})</div>
      <div><strong>Tipo de Cambio Ref.:</strong> 1 USD = ₡${Number(crcExchangeRate).toFixed(2)} CRC</div>
    </div>
  </div>

  <!-- Title banner -->
  <div class="report-title-bar">
    <h2>INFORME EJECUTIVO DE INVENTARIO Y TRAZABILIDAD TEMPORAL</h2>
    <p>Consolidado patrimonial de existencias en almacén y registro cronológico de entradas y salidas de mercancía.</p>
  </div>

  <!-- Top KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Catálogo Activo</div>
      <div class="kpi-value">${totalProductsCount} SKUs</div>
      <div class="kpi-sub">${totalUnitsInStock} unidades en existencia</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Valoración Total</div>
      <div class="kpi-value" style="color: #0b4d9b;">${fmtUsd(totalValueUSD)}</div>
      <div class="kpi-sub">Equivalente: ${fmtCrc(totalValueCRC)}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Salud del Stock</div>
      <div class="kpi-value" style="color: ${outOfStockItems.length > 0 ? '#dc2626' : '#16a34a'};">
        ${normalStockItems.length} Óptimos
      </div>
      <div class="kpi-sub">${lowStockItems.length} en stock bajo | ${outOfStockItems.length} agotados</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Flujo de Movimientos</div>
      <div class="kpi-value" style="color: #047857;">${filteredMovements.length} Registros</div>
      <div class="kpi-sub">📥 +${totalEntries} entradas | 📤 -${totalExits} salidas</div>
    </div>
  </div>

  <!-- SECTION 1: ESTADO ACTUAL DE PRODUCTOS -->
  <div class="section-title">
    <span>1. RESUMEN COMPLETO Y ESTADO ACTUAL DE PRODUCTOS</span>
    <span class="section-badge">${filteredProducts.length} referencias listadas</span>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 14%;">SKU / Código</th>
        <th style="width: 26%;">Producto y Marca</th>
        <th style="width: 16%;">Categoría</th>
        <th style="width: 10%;" class="text-center">Stock</th>
        <th style="width: 11%;" class="text-right">Costo Compra</th>
        <th style="width: 11%;" class="text-right">Valorización</th>
        <th style="width: 12%;" class="text-center">Estado</th>
      </tr>
    </thead>
    <tbody>
      ${
        filteredProducts.length === 0
          ? '<tr><td colspan="7" class="text-center" style="padding: 16px;">No se encontraron productos con los criterios especificados.</td></tr>'
          : filteredProducts
              .map(p => {
                const stock = Number(p.stock) || 0;
                const min = Number(p.minimumStock) || 0;
                const cost = Number(p.purchasePrice) || 0;
                const val = stock * cost;
                let statusBadge = '<span class="badge badge-success">Disponible</span>';
                if (stock <= 0) {
                  statusBadge = '<span class="badge badge-danger">Agotado</span>';
                } else if (stock <= min) {
                  statusBadge = '<span class="badge badge-warning">Stock Bajo</span>';
                }

                return `
              <tr>
                <td>
                  <div class="sku-code">${p.sku || 'SIN-SKU'}</div>
                  ${p.barcode ? `<div style="font-size: 8.5px; color: #64748b;">${p.barcode}</div>` : ''}
                </td>
                <td>
                  <strong style="color: #0f172a;">${p.name}</strong>
                  ${p.brand ? `<div style="font-size: 9px; color: #64748b;">Marca: ${p.brand}</div>` : ''}
                </td>
                <td>${catMap[p.categoryId] || 'General'}</td>
                <td class="text-center">
                  <strong>${stock}</strong> <span style="font-size: 8.5px; color: #64748b;">(Mín: ${min})</span>
                </td>
                <td class="text-right">${fmtUsd(cost)}</td>
                <td class="text-right"><strong style="color: #0a2e5b;">${fmtUsd(val)}</strong></td>
                <td class="text-center">${statusBadge}</td>
              </tr>
            `;
              })
              .join('')
      }
    </tbody>
  </table>

  <!-- Financial Summary Box -->
  <div class="summary-box">
    <div>
      <div class="summary-item">
        <span>Costo Total de Adquisición (USD):</span>
        <strong>${fmtUsd(totalValueUSD)}</strong>
      </div>
      <div class="summary-item">
        <span>Costo Total en Colones (CRC):</span>
        <strong>${fmtCrc(totalValueCRC)}</strong>
      </div>
    </div>
    <div>
      <div class="summary-item">
        <span>Valor Estimado de Venta (PVP):</span>
        <strong>${fmtUsd(potentialRevenueUSD)}</strong>
      </div>
      <div class="summary-item">
        <span>Margen Bruto Proyectado:</span>
        <strong style="color: #059669;">${fmtUsd(potentialProfitUSD)}</strong>
      </div>
    </div>
  </div>

  <!-- SECTION 2: TRAZABILIDAD Y CRONOLOGÍA DE INGRESOS Y SALIDAS POR TIEMPO -->
  <div class="section-title" style="page-break-before: auto;">
    <span>2. TRAZABILIDAD CRONOLÓGICA DE MOVIMIENTOS (INGRESOS Y SALIDAS)</span>
    <span class="section-badge">${filteredMovements.length} transacciones en el periodo</span>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 14%;">Fecha y Hora</th>
        <th style="width: 11%;" class="text-center">Tipo</th>
        <th style="width: 13%;">SKU</th>
        <th style="width: 25%;">Artículo Afectado</th>
        <th style="width: 9%;" class="text-center">Cant.</th>
        <th style="width: 16%;">Motivo / Documento</th>
        <th style="width: 12%;">Operador</th>
      </tr>
    </thead>
    <tbody>
      ${
        filteredMovements.length === 0
          ? '<tr><td colspan="7" class="text-center" style="padding: 16px;">No hay movimientos registrados en el rango de tiempo seleccionado.</td></tr>'
          : filteredMovements
              .map(m => {
                const prod = prodMap[m.productId] || {};
                const isEntry = m.type === 'ENTRY';
                const isExit = m.type === 'EXIT';
                const badgeClass = isEntry ? 'badge-entry' : isExit ? 'badge-exit' : 'badge-adjust';
                const typeLabel = isEntry ? '📥 INGRESO' : isExit ? '📤 SALIDA' : '⚙️ AJUSTE';
                const qtySign = isEntry ? `+${m.quantity}` : isExit ? `-${m.quantity}` : `${m.quantity}`;
                const qtyColor = isEntry ? '#047857' : isExit ? '#b91c1c' : '#1d4ed8';

                return `
              <tr>
                <td>${fmtDateTime(m.date)}</td>
                <td class="text-center">
                  <span class="badge ${badgeClass}">${typeLabel}</span>
                </td>
                <td class="sku-code">${prod.sku || m.sku || '-'}</td>
                <td>
                  <strong style="color: #0f172a;">${prod.name || m.productName || `Producto #${m.productId}`}</strong>
                </td>
                <td class="text-center">
                  <strong style="color: ${qtyColor}; font-size: 11px;">${qtySign} uds</strong>
                </td>
                <td>
                  <div>${m.reason || 'Movimiento estándar'}</div>
                  ${m.notes ? `<div style="font-size: 8.5px; color: #64748b; font-style: italic;">${m.notes}</div>` : ''}
                </td>
                <td>${m.userName || m.userId || 'Sistema'}</td>
              </tr>
            `;
              })
              .join('')
      }
    </tbody>
  </table>

  <!-- Signatures section -->
  <div class="signature-grid">
    <div class="signature-line">
      <strong>Responsable de Bodega / Inventario</strong><br>
      Firma y Sello
    </div>
    <div class="signature-line">
      <strong>Auditoría Interna / Control de Calidad</strong><br>
      Firma y Sello
    </div>
    <div class="signature-line">
      <strong>Gerencia de Operaciones y Finanzas</strong><br>
      Aprobación Final
    </div>
  </div>

  <!-- Footer -->
  <div class="report-footer">
    <div>StockPilot Suite v1.0 • Documento Confidencial de Uso Interno</div>
    <div>Página 1 de 1 (Reporte Consolidado)</div>
  </div>

</body>
</html>
`;
}

/**
 * Triggers native browser print-to-PDF with clean formatting
 */
export function printStockPilotReport(htmlContent) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    // If popups blocked, use hidden iframe fallback
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 2000);
    }, 400);
    return;
  }

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}

export default {
  buildPdfReportHtml,
  printStockPilotReport
};
