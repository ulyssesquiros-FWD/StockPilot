import React, { useState, useEffect } from 'react';
import reportService from '../../services/reportService';
import categoryService from '../../services/categoryService';
import ChartCard from '../../components/ui/ChartCard';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import DataTable from '../../components/ui/DataTable';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Download, TrendingUp, FileText } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState('inventory');
  const [reportData, setReportData] = useState(null);
  const [movementData, setMovementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      setError(null);
      try {
        const [inv, mov] = await Promise.all([
          reportService.getInventoryReport(),
          reportService.getMovementReport()
        ]);
        setReportData(inv);
        setMovementData(mov);
      } catch (err) {
        setError(err.message || 'Error al compilar reportes.');
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const handleExportCSV = () => {
    if (activeReport === 'inventory') {
      const rows = (reportData?.products || []).map(p => ({
        name: p.name,
        sku: p.sku,
        category: p.categoryName,
        stock: p.stock,
        purchasePrice: p.purchasePrice,
        salePrice: p.salePrice,
        value: p.inventoryValue,
        status: p.stockStatus
      }));
      reportService.exportToCSV('reporte-inventario-stockpilot', rows, {
        name: 'Producto',
        sku: 'SKU',
        category: 'Categoría',
        stock: 'Existencias',
        purchasePrice: 'Costo Compra',
        salePrice: 'Precio Venta',
        value: 'Valor Total',
        status: 'Estado'
      });
    } else {
      const rows = (movementData?.movements || []).map(m => ({
        date: m.date,
        type: m.type,
        product: m.productName,
        quantity: m.quantity,
        reason: m.reason,
        notes: m.notes
      }));
      reportService.exportToCSV('reporte-movimientos-stockpilot', rows, {
        date: 'Fecha',
        type: 'Tipo Movimiento',
        product: 'Producto',
        quantity: 'Cantidad',
        reason: 'Motivo',
        notes: 'Notas'
      });
    }
  };

  if (loading) return <LoadingState message="Compilando analítica y reportes de inventario..." />;
  if (error || !reportData) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const tabs = [
    { id: 'inventory', label: 'Reporte General de Inventario', icon: <FileText size={16} /> },
    { id: 'movements', label: 'Reporte de Flujo y Movimientos', icon: <TrendingUp size={16} /> }
  ];

  // Category chart breakdown
  const categoryAggregates = {};
  (reportData.products || []).forEach(p => {
    const c = p.categoryName;
    if (!categoryAggregates[c]) {
      categoryAggregates[c] = { name: c, valor: 0, unidades: 0 };
    }
    categoryAggregates[c].valor += p.inventoryValue;
    categoryAggregates[c].unidades += p.stock;
  });
  const categoryChartData = Object.values(categoryAggregates);

  // Top 5 highest valued products
  const topValuedProducts = [...reportData.products]
    .sort((a, b) => b.inventoryValue - a.inventoryValue)
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
      valor: p.inventoryValue
    }));

  const COLORS = ['#0B4D9B', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6'];

  const inventoryColumns = [
    { header: 'Producto / SKU', key: 'name', render: (_, p) => (
      <div>
        <div style={{ fontWeight: 600 }}>{p.name}</div>
        <div className="text-secondary" style={{ fontSize: '11px', fontFamily: 'monospace' }}>SKU: {p.sku}</div>
      </div>
    )},
    { header: 'Categoría', key: 'categoryName' },
    { header: 'Existencias', key: 'stock', render: val => <strong>{val} uds</strong> },
    { header: 'Costo Unit.', key: 'purchasePrice', render: val => formatCurrency(val) },
    { header: 'Valorización', key: 'inventoryValue', render: val => (
      <span style={{ fontWeight: 700, color: 'var(--color-primary-blue)' }}>{formatCurrency(val)}</span>
    )},
    { header: 'Proveedor', key: 'supplierName' }
  ];

  const movementColumns = [
    { header: 'Fecha', key: 'date', render: val => formatDate(val) },
    { header: 'Tipo', key: 'type', render: val => <span className="badge badge-info">{val}</span> },
    { header: 'Producto', key: 'productName' },
    { header: 'Cantidad', key: 'quantity', render: val => <strong>{val} uds</strong> },
    { header: 'Concepto / Motivo', key: 'reason' }
  ];

  return (
    <div className="reports-page">
      <div className="page-header">
        <div className="page-header-info">
          <h1>Informes y Analítica</h1>
          <p className="text-secondary">
            Consolidado financiero, volumen de activos y rotación de mercancías
          </p>
        </div>
        <div className="page-header-actions">
          <Button
            variant="primary"
            icon={<Download size={16} />}
            onClick={handleExportCSV}
          >
            Exportar {activeReport === 'inventory' ? 'Inventario (CSV)' : 'Movimientos (CSV)'}
          </Button>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeReport} onChange={setActiveReport} />

      {/* Visual Analytics Section */}
      <div
        className="charts-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-lg)'
        }}
      >
        <ChartCard title="Capital Invertido por Categoría (USD)" subtitle="Valoración monetaria del stock">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <XAxis dataKey="name" fontSize={11} stroke="var(--text-muted)" angle={-15} textAnchor="end" />
              <YAxis fontSize={11} stroke="var(--text-muted)" />
              <Tooltip formatter={(val) => formatCurrency(val)} />
              <Bar dataKey="valor" fill="#0B4D9B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 5 Activos con Mayor Valorización" subtitle="Mayor concentración de capital en bodega">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topValuedProducts}
                dataKey="valor"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
                label
              >
                {topValuedProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => formatCurrency(val)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Detailed Table */}
      {activeReport === 'inventory' ? (
        <DataTable
          columns={inventoryColumns}
          data={reportData.products}
          keyField="id"
          emptyMessage="No hay datos de inventario disponibles."
        />
      ) : (
        <DataTable
          columns={movementColumns}
          data={movementData?.movements || []}
          keyField="id"
          emptyMessage="No hay movimientos registrados para mostrar."
        />
      )}
    </div>
  );
}
