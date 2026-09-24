import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useInventory from '../../hooks/useInventory';
import KpiCard from '../../components/ui/KpiCard';
import ChartCard from '../../components/ui/ChartCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import ExchangeRateModal from '../../components/ui/ExchangeRateModal';
import currencyService from '../../services/currencyService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Package,
  AlertTriangle,
  XCircle,
  DollarSign,
  Plus,
  ArrowLeftRight,
  Sparkles,
  TrendingUp,
  Clock,
  Globe
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function DashboardPage() {
  const { stats, loading, error, reload } = useInventory();
  const navigate = useNavigate();
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [exchangeRates, setExchangeRates] = useState(null);

  useEffect(() => {
    async function loadRates() {
      try {
        const data = await currencyService.getRates();
        setExchangeRates(data);
      } catch {
        // Fallback
      }
    }
    loadRates();
  }, []);

  if (loading) {
    return <LoadingState message="Cargando métricas y análisis de inventario..." />;
  }

  if (error || !stats) {
    return (
      <ErrorState
        title="Error al cargar el Dashboard"
        message={error || 'No se pudieron recuperar las métricas operativas.'}
        onRetry={reload}
      />
    );
  }

  const { kpis, lowStockItems, topProducts, categoryDistribution, stockHealth, movementsByType, recentActivities, criticalAlerts } = stats;

  return (
    <div className="dashboard-page">
      {/* Header Info & Primary CTAs */}
      <div className="page-header">
        <div className="page-header-info">
          <h1>Panel de Control</h1>
          <p className="text-secondary">
            Visión global del estado de existencias, rotación y alertas de suministro
          </p>
        </div>
        <div className="page-header-actions">
          <Button
            variant="outline"
            icon={<ArrowLeftRight size={16} />}
            onClick={() => navigate('/movimientos')}
          >
            Registrar Movimiento
          </Button>
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate('/productos/nuevo')}
          >
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* 4 Core KPIs Grid */}
      <div
        className="kpi-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-lg)'
        }}
      >
        <KpiCard
          title="Total Productos"
          value={kpis.totalProducts}
          icon={<Package size={24} />}
          variant="blue"
          subtitle="Referencias activas en catálogo"
        />
        <KpiCard
          title="Stock Bajo"
          value={kpis.lowStockCount}
          icon={<AlertTriangle size={24} />}
          variant="yellow"
          trend="Atención requerida"
          trendType="warning"
          subtitle="Por debajo del umbral mínimo"
        />
        <KpiCard
          title="Productos Agotados"
          value={kpis.outOfStockCount}
          icon={<XCircle size={24} />}
          variant="red"
          trend={kpis.outOfStockCount > 0 ? 'Crítico' : 'Óptimo'}
          trendType={kpis.outOfStockCount > 0 ? 'danger' : 'positive'}
          subtitle="Existencias en cero unidades"
        />
        <KpiCard
          title="Valor Inventario"
          value={formatCurrency(kpis.totalInventoryValue)}
          icon={<DollarSign size={24} />}
          variant="green"
          trend={
            exchangeRates?.rates?.CRC
              ? `≈ ₡${Math.round(currencyService.convert(kpis.totalInventoryValue, 'USD', 'CRC', exchangeRates.rates)).toLocaleString('es-CR')}`
              : '+ Inversión total'
          }
          trendType="positive"
          subtitle="Costo adquisición valorizado (USD)"
        />
      </div>

      {/* Live Dollar Exchange Rate Interactive Ticker Banner */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          marginBottom: 'var(--space-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--color-primary-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <DollarSign size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>Tipo de Cambio Oficial (USD)</strong>
              <span className="badge badge-success" style={{ fontSize: '10px', padding: '1px 6px' }}>
                API En Vivo
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <span>🇨🇷 <strong>₡{exchangeRates?.rates?.CRC ? exchangeRates.rates.CRC.toFixed(2) : '452.34'}</strong> CRC</span>
              <span>🇪🇺 <strong>€{exchangeRates?.rates?.EUR ? exchangeRates.rates.EUR.toFixed(4) : '0.8800'}</strong> EUR</span>
              <span>🇲🇽 <strong>${exchangeRates?.rates?.MXN ? exchangeRates.rates.MXN.toFixed(2) : '17.47'}</strong> MXN</span>
              <span>🇨🇴 <strong>${exchangeRates?.rates?.COP ? Math.round(exchangeRates.rates.COP).toLocaleString('es-CR') : '4,150'}</strong> COP</span>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Globe size={14} />}
          onClick={() => setExchangeModalOpen(true)}
        >
          Consultar / Conversor de Monedas
        </Button>
      </div>

      {/* StockPilot IA Assistant Highlight Card */}
      <div
        className="sp-card"
        style={{
          background: 'linear-gradient(135deg, rgba(11, 77, 155, 0.08) 0%, rgba(16, 185, 129, 0.12) 100%)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          marginBottom: 'var(--space-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700 }}>StockPilot IA · Asistente Logístico</h3>
              <span className="badge badge-success">Activo</span>
            </div>
            <p className="text-secondary" style={{ marginTop: '2px', maxWidth: '640px' }}>
              Analiza riesgos de quiebre de stock, genera sugerencias de pedidos a distribuidores y diagnostica productos de baja rotación en lenguaje natural.
            </p>
          </div>
        </div>
        <Button
          variant="success"
          icon={<Sparkles size={16} />}
          onClick={() => navigate('/asistente-ia')}
        >
          Consultar al Asistente
        </Button>
      </div>

      {/* Analytics Charts Grid */}
      <div
        className="charts-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-lg)'
        }}
      >
        {/* Movements Breakdown Chart */}
        <ChartCard title="Movimientos de Inventario" subtitle="Distribución por tipo de operación">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={movementsByType} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="type" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)'
                }}
              />
              <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
                {movementsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Stock Health Donut Chart */}
        <ChartCard title="Salud del Inventario" subtitle="Proporción de disponibilidad y alertas">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stockHealth}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {stockHealth.map((entry, index) => (
                  <Cell key={`donut-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  borderRadius: 'var(--radius-sm)'
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Category Stock Distribution Bar Chart */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <ChartCard title="Existencias por Categoría" subtitle="Volumen de unidades físicas en cada rubro">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryDistribution} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} angle={-15} textAnchor="end" />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  borderRadius: 'var(--radius-sm)'
                }}
              />
              <Bar dataKey="stock" fill="#0B4D9B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Operational Widgets: Low Stock Alerts + Top Moving + Recent Activity */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-md)'
        }}
      >
        {/* Low Stock Watchlist */}
        <Card
          title="Atención de Stock Inmediata"
          subtitle="Productos agotados o bajo umbral mínimo"
          actions={
            <Button variant="ghost" size="sm" onClick={() => navigate('/alertas')}>
              Ver alertas
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lowStockItems.length === 0 && kpis.outOfStockCount === 0 ? (
              <p className="text-secondary" style={{ textAlign: 'center', padding: '16px 0' }}>
                ✓ Todas las existencias se encuentran en niveles seguros.
              </p>
            ) : (
              [...stats.outOfStockItems, ...lowStockItems].slice(0, 5).map(prod => (
                <div
                  key={prod.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-surface-alt)',
                    fontSize: '13px'
                  }}
                >
                  <div style={{ overflow: 'hidden', paddingRight: '8px' }}>
                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {prod.name}
                    </div>
                    <div className="text-secondary">
                      Stock: {prod.stock} / Mín: {prod.minimumStock}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StatusBadge
                      status={prod.stock <= 0 ? 'out_of_stock' : 'low_stock'}
                      type="stock"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/movimientos')}
                      title="Registrar entrada para este producto"
                    >
                      Reponer
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Top Moving Products */}
        <Card title="Productos de Mayor Movimiento" subtitle="Artículos con mayor flujo registrado">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topProducts.length === 0 ? (
              <p className="text-secondary" style={{ textAlign: 'center', padding: '16px 0' }}>
                No hay movimientos registrados recientemente.
              </p>
            ) : (
              topProducts.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-surface-alt)',
                    fontSize: '13px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary-blue-light)',
                        color: 'var(--color-primary-blue)',
                        fontWeight: 700,
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span style={{ fontWeight: 600 }}>{item.product?.name || `Producto #${item.productId}`}</span>
                  </div>
                  <span className="badge badge-info">{item.totalQuantity} unidades</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Audit Activities */}
        <Card title="Actividad Reciente" subtitle="Auditoría de operaciones del sistema">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivities.length === 0 ? (
              <p className="text-secondary" style={{ textAlign: 'center', padding: '16px 0' }}>
                No hay registros de actividad recientes.
              </p>
            ) : (
              recentActivities.slice(0, 5).map(act => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '12px',
                    borderBottom: '1px solid var(--border-color-subtle)',
                    paddingBottom: '8px'
                  }}
                >
                  <Clock size={16} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>{act.description}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>
                      {act.userName || 'Sistema'} · {formatDate(act.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Exchange Rate Modal */}
      <ExchangeRateModal
        isOpen={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
      />
    </div>
  );
}
