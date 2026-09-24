import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAlerts from '../../hooks/useAlerts';
import useProducts from '../../hooks/useProducts';
import { formatDate } from '../../utils/formatters';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import Tabs from '../../components/ui/Tabs';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { CheckCircle2, ShieldAlert, AlertTriangle, ArrowLeftRight, Bell } from 'lucide-react';

export default function AlertsPage() {
  const { alerts, loading, error, reload, resolveAlert } = useAlerts();
  const { products } = useProducts();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('active');

  const productMap = useMemo(() => {
    return Object.fromEntries(products.map(p => [p.id, p]));
  }, [products]);

  // Tab counts
  const criticalCount = alerts.filter(a => a.status === 'critical').length;
  const warningCount = alerts.filter(a => a.status === 'warning').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;
  const activeCount = criticalCount + warningCount;

  const tabs = [
    { id: 'active', label: 'Alertas Activas', count: activeCount, icon: <ShieldAlert size={16} /> },
    { id: 'critical', label: 'Críticas (Agotados)', count: criticalCount, icon: <ShieldAlert size={16} /> },
    { id: 'warning', label: 'Advertencias (Stock Bajo)', count: warningCount, icon: <AlertTriangle size={16} /> },
    { id: 'resolved', label: 'Historial Resueltas', count: resolvedCount, icon: <CheckCircle2 size={16} /> }
  ];

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (activeTab === 'active') return a.status === 'critical' || a.status === 'warning';
      if (activeTab === 'critical') return a.status === 'critical';
      if (activeTab === 'warning') return a.status === 'warning';
      if (activeTab === 'resolved') return a.status === 'resolved';
      return true;
    });
  }, [alerts, activeTab]);

  const columns = [
    {
      header: 'Prioridad / Estado',
      key: 'status',
      render: (val) => <StatusBadge status={val} type="alert" />
    },
    {
      header: 'Producto Afectado',
      key: 'productId',
      render: (val) => {
        const prod = productMap[val];
        return (
          <div>
            <div style={{ fontWeight: 600 }}>{prod?.name || `Producto #${val}`}</div>
            <div className="text-secondary" style={{ fontSize: '11px', fontFamily: 'monospace' }}>
              Stock: {prod?.stock ?? '?'} / Mínimo: {prod?.minimumStock ?? '?'}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Fecha Detectada',
      key: 'date',
      render: (val) => formatDate(val)
    },
    {
      header: 'Acción Logística Recomendada',
      key: 'recommendedAction',
      render: (val) => (
        <span style={{ fontSize: '13px', color: 'var(--text-main)', maxWidth: '380px', display: 'block' }}>
          {val}
        </span>
      )
    },
    {
      header: 'Gestión',
      key: 'actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (_, a) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeftRight size={14} />}
            onClick={() => navigate('/movimientos')}
            title="Registrar reposición inmediata"
          >
            Reabastecer
          </Button>
          {a.status !== 'resolved' && (
            <Button
              variant="secondary"
              size="sm"
              icon={<CheckCircle2 size={14} />}
              onClick={() => resolveAlert(a.id)}
              title="Marcar como resuelta"
            >
              Resolver
            </Button>
          )}
        </div>
      )
    }
  ];

  const renderMobileCard = (a) => {
    const prod = productMap[a.productId];
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <StatusBadge status={a.status} type="alert" />
          <span className="text-secondary" style={{ fontSize: '11px' }}>{formatDate(a.date)}</span>
        </div>
        <div style={{ fontWeight: 600, fontSize: '15px', marginTop: '6px' }}>
          {prod?.name || `Producto #${a.productId}`}
        </div>
        <div className="text-secondary" style={{ fontSize: '12px' }}>
          Stock actual: {prod?.stock} (Mínimo: {prod?.minimumStock})
        </div>
        <div style={{ marginTop: '8px', fontSize: '13px', padding: '8px', backgroundColor: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-sm)' }}>
          💡 {a.recommendedAction}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
          <Button variant="outline" size="sm" onClick={() => navigate('/movimientos')}>
            Reabastecer
          </Button>
          {a.status !== 'resolved' && (
            <Button variant="secondary" size="sm" onClick={() => resolveAlert(a.id)}>
              Resolver
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (loading && alerts.length === 0) return <LoadingState message="Cargando alertas del sistema..." />;
  if (error && alerts.length === 0) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="alerts-page">
      <div className="page-header">
        <div className="page-header-info">
          <h1>Alertas de Suministro</h1>
          <p className="text-secondary">
            Monitoreo en tiempo real de quiebres de existencias y productos en umbral crítico
          </p>
        </div>
        <div className="page-header-actions">
          <Button
            variant="primary"
            icon={<ArrowLeftRight size={16} />}
            onClick={() => navigate('/movimientos')}
          >
            Registrar Entrada de Stock
          </Button>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <DataTable
        columns={columns}
        data={filteredAlerts}
        keyField="id"
        emptyMessage="No hay alertas registradas en esta vista."
        renderMobileCard={renderMobileCard}
      />
    </div>
  );
}
