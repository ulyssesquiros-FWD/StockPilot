import React, { useState, useEffect, useMemo } from 'react';
import movementService from '../../services/movementService';
import productService from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { canCreate } from '../../utils/permissions';
import { formatDate, formatMovementType } from '../../utils/formatters';
import { calculateMovementImpact } from '../../utils/inventoryCalculations';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import Pagination from '../../components/ui/Pagination';
import { ArrowLeftRight, AlertCircle } from 'lucide-react';

export default function MovementsPage() {
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSaving, setModalSaving] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    type: 'ENTRY',
    quantity: '',
    reason: '',
    notes: ''
  });
  const [projectedStock, setProjectedStock] = useState(null);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [movs, prods] = await Promise.all([
        movementService.getAll(),
        productService.getAll()
      ]);
      setMovements(movs || []);
      setProducts(prods || []);
    } catch (err) {
      setError(err.message || 'Error al cargar movimientos de almacén.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const productMap = useMemo(() => {
    return Object.fromEntries(products.map(p => [String(p.id), p]));
  }, [products]);

  // Projected stock preview calculator
  useEffect(() => {
    if (!formData.productId || !formData.quantity || isNaN(Number(formData.quantity))) {
      setProjectedStock(null);
      setFormError('');
      return;
    }

    const prod = productMap[String(formData.productId)];
    if (!prod) return;

    try {
      const res = calculateMovementImpact(prod.stock, formData.type, Number(formData.quantity));
      setProjectedStock(res);
      setFormError('');
    } catch (err) {
      setFormError(err.message);
      setProjectedStock(null);
    }
  }, [formData, productMap]);

  const handleOpenCreate = () => {
    setFormData({
      productId: products[0]?.id || '',
      type: 'ENTRY',
      quantity: '1',
      reason: '',
      notes: ''
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.productId) {
      notifyError('Debe seleccionar un producto.');
      return;
    }
    const qty = Number(formData.quantity);
    if (isNaN(qty) || qty <= 0) {
      notifyError('La cantidad debe ser un número mayor a cero.');
      return;
    }

    setModalSaving(true);
    try {
      const result = await movementService.create(formData, user);
      setMovements(prev => [result.movement, ...prev]);

      // Update product in local state
      setProducts(prev => prev.map(p => (String(p.id) === String(result.product.id) ? result.product : p)));

      notifySuccess('Movimiento registrado y stock sincronizado.');
      setModalOpen(false);
    } catch (err) {
      notifyError(err.message || 'Error al procesar movimiento.');
      setFormError(err.message);
    } finally {
      setModalSaving(false);
    }
  };

  // Filter pipeline
  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      if (typeFilter && m.type !== typeFilter) return false;
      if (productFilter && String(m.productId) !== String(productFilter)) return false;
      return true;
    });
  }, [movements, typeFilter, productFilter]);

  const totalPages = Math.ceil(filteredMovements.length / pageSize) || 1;
  const paginatedMovements = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMovements.slice(start, start + pageSize);
  }, [filteredMovements, currentPage, pageSize]);

  const columns = [
    {
      header: 'Tipo',
      key: 'type',
      render: (val) => {
        const mInfo = formatMovementType(val);
        return <span className={`badge badge-${mInfo.variant}`}>{mInfo.label}</span>;
      }
    },
    {
      header: 'Producto',
      key: 'productId',
      render: (val) => {
        const p = productMap[String(val)] || productMap[val];
        return (
          <div>
            <div style={{ fontWeight: 600 }}>{p ? p.name : `Producto #${val}`}</div>
            <div className="text-secondary" style={{ fontSize: '11px', fontFamily: 'monospace' }}>
              SKU: {p?.sku || '-'}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Cantidad',
      key: 'quantity',
      render: (val, m) => {
        const isExit = m.type === 'EXIT';
        return (
          <span
            style={{
              fontWeight: 700,
              fontSize: '15px',
              color: isExit ? 'var(--color-danger-red)' : 'var(--color-primary-green)'
            }}
          >
            {isExit ? `-${val}` : `+${val}`}
          </span>
        );
      }
    },
    {
      header: 'Motivo / Concepto',
      key: 'reason',
      render: (val, m) => (
        <div>
          <div style={{ fontWeight: 500 }}>{val || 'Sin motivo'}</div>
          {m.notes && <div className="text-secondary" style={{ fontSize: '12px' }}>{m.notes}</div>}
        </div>
      )
    },
    {
      header: 'Fecha y Hora',
      key: 'date',
      render: (val) => formatDate(val)
    }
  ];

  const renderMobileCard = (m) => {
    const p = productMap[String(m.productId)] || productMap[m.productId];
    const mInfo = formatMovementType(m.type);
    const isExit = m.type === 'EXIT';

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={`badge badge-${mInfo.variant}`}>{mInfo.label}</span>
          <span
            style={{
              fontWeight: 700,
              fontSize: '16px',
              color: isExit ? 'var(--color-danger-red)' : 'var(--color-primary-green)'
            }}
          >
            {isExit ? `-${m.quantity}` : `+${m.quantity}`} uds
          </span>
        </div>
        <div style={{ fontWeight: 600, fontSize: '15px', marginTop: '6px' }}>
          {p ? p.name : `Producto #${m.productId}`}
        </div>
        <div className="text-secondary" style={{ fontSize: '12px', marginTop: '2px' }}>
          {m.reason} {m.notes && `· ${m.notes}`}
        </div>
        <div className="text-secondary" style={{ fontSize: '11px', marginTop: '8px' }}>
          {formatDate(m.date)}
        </div>
      </div>
    );
  };

  if (loading) return <LoadingState message="Cargando registro de movimientos..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="movements-page">
      <div className="page-header">
        <div className="page-header-info">
          <h1>Movimientos de Almacén</h1>
          <p className="text-secondary">
            Trazabilidad auditada de entradas, salidas, ajustes y devoluciones
          </p>
        </div>
        <div className="page-header-actions">
          {canCreate(user, 'movements') && (
            <Button
              variant="primary"
              icon={<ArrowLeftRight size={18} />}
              onClick={handleOpenCreate}
            >
              Nuevo Movimiento
            </Button>
          )}
        </div>
      </div>

      {/* Filters Toolbar */}
      <div
        className="sp-card"
        style={{
          marginBottom: 'var(--space-md)',
          padding: '16px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: 1, minWidth: '180px' }}>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            className="form-select"
            aria-label="Filtrar por tipo"
          >
            <option value="">Todos los Tipos</option>
            <option value="ENTRY">Entrada</option>
            <option value="EXIT">Salida</option>
            <option value="ADJUSTMENT">Ajuste</option>
            <option value="RETURN">Devolución</option>
          </select>
        </div>

        <div style={{ flex: 2, minWidth: '240px' }}>
          <select
            value={productFilter}
            onChange={(e) => { setProductFilter(e.target.value); setCurrentPage(1); }}
            className="form-select"
            aria-label="Filtrar por producto"
          >
            <option value="">Todos los Productos</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (Stock: {p.stock})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Movements Table */}
      <DataTable
        columns={columns}
        data={paginatedMovements}
        keyField="id"
        emptyMessage="No se encontraron movimientos registrados con los filtros seleccionados."
        renderMobileCard={renderMobileCard}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredMovements.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* New Movement Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Registrar Movimiento de Inventario"
        maxWidth="540px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={modalSaving}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={modalSaving}
              disabled={!!formError}
            >
              Confirmar y Actualizar Stock
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} noValidate>
          {formError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-danger-red-light)',
                color: 'var(--color-danger-red)',
                fontSize: '13px',
                marginBottom: '14px'
              }}
              role="alert"
            >
              <AlertCircle size={18} />
              <span>{formError}</span>
            </div>
          )}

          <Select
            label="Producto de Destino"
            name="productId"
            value={formData.productId}
            onChange={(e) => setFormData(prev => ({ ...prev, productId: e.target.value }))}
            options={products.map(p => ({
              value: p.id,
              label: `${p.name} — Stock actual: ${p.stock} (SKU: ${p.sku})`
            }))}
            required
          />

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label required">Tipo de Operación</label>
              <select
                name="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="form-select"
                required
              >
                <option value="ENTRY">📥 Entrada (Aumenta stock)</option>
                <option value="EXIT">📤 Salida (Disminuye stock)</option>
                <option value="ADJUSTMENT">⚙️ Ajuste de Auditoría (Fija valor)</option>
                <option value="RETURN">↩️ Devolución de Cliente (Aumenta stock)</option>
              </select>
            </div>

            <Input
              label="Cantidad de Unidades"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              placeholder="Ej. 5"
              required
            />
          </div>

          {/* Live Projected Stock Calculation Box */}
          {projectedStock !== null && (
            <div
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-primary-blue-light)',
                border: '1px solid rgba(11, 77, 155, 0.2)',
                marginBottom: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--color-primary-blue)', fontWeight: 600 }}>
                Stock Resultante Proyectado:
              </span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-blue)' }}>
                {projectedStock} unidades
              </span>
            </div>
          )}

          <Input
            label="Motivo o Justificación"
            name="reason"
            value={formData.reason}
            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
            placeholder="Ej. Compra de reposición, Venta corporativa, Conteo de bodega"
            required
          />

          <div className="form-group">
            <label className="form-label" htmlFor="mov-notes">Notas u Observaciones</label>
            <textarea
              id="mov-notes"
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="form-textarea"
              placeholder="Número de factura, orden de despacho, lote..."
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
