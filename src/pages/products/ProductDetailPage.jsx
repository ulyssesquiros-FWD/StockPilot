import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import supplierService from '../../services/supplierService';
import movementService from '../../services/movementService';
import { useAuth } from '../../context/AuthContext';
import { canEdit } from '../../utils/permissions';
import { getStockStatus } from '../../utils/inventoryCalculations';
import { formatCurrency, formatDate, formatMovementType } from '../../utils/formatters';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import Card from '../../components/ui/Card';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import {
  Edit2,
  ArrowLeft,
  ArrowLeftRight,
  Package,
  Barcode,
  MapPin,
  Calendar,
  Building,
  DollarSign
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const prod = await productService.getById(id);
        setProduct(prod);

        if (prod.categoryId) {
          categoryService.getById(prod.categoryId).then(setCategory).catch(() => {});
        }
        if (prod.supplierId) {
          supplierService.getById(prod.supplierId).then(setSupplier).catch(() => {});
        }

        // Fetch movements for this product
        const movs = await movementService.getAll({ productId: id, _limit: 6, _sort: 'date', _order: 'desc' });
        setMovements(movs || []);
      } catch (err) {
        setError(err.message || 'Error al cargar los detalles del producto.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <LoadingState message="Cargando información del producto..." />;
  if (error || !product) {
    return (
      <ErrorState
        title="Producto no encontrado"
        message={error || 'El producto solicitado no existe o fue retirado del inventario.'}
        onRetry={() => navigate('/productos')}
      />
    );
  }

  const stockStatus = getStockStatus(product.stock, product.minimumStock);
  const profitMargin = product.purchasePrice > 0
    ? (((product.salePrice - product.purchasePrice) / product.purchasePrice) * 100).toFixed(1)
    : 0;

  return (
    <div className="product-detail-page">
      <Breadcrumbs
        items={[
          { label: 'Productos', to: '/productos' },
          { label: product.name }
        ]}
      />

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1>{product.name}</h1>
            <StatusBadge status={stockStatus} type="stock" />
          </div>
          <p className="text-secondary" style={{ marginTop: '4px' }}>
            SKU: <strong style={{ fontFamily: 'monospace' }}>{product.sku}</strong> {product.brand && `· Marca: ${product.brand}`}
          </p>
        </div>

        <div className="page-header-actions">
          <Button
            variant="secondary"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/productos')}
          >
            Volver
          </Button>

          <Button
            variant="outline"
            icon={<ArrowLeftRight size={16} />}
            onClick={() => navigate('/movimientos')}
          >
            Registrar Movimiento
          </Button>

          {canEdit(user, 'products') && (
            <Button
              variant="primary"
              icon={<Edit2 size={16} />}
              onClick={() => navigate(`/productos/${product.id}/editar`)}
            >
              Editar Producto
            </Button>
          )}
        </div>
      </div>

      {/* Main Details Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 'var(--space-lg)',
          marginBottom: 'var(--space-lg)'
        }}
        className="form-grid-2"
      >
        {/* Left Column: Image & Stock Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <Card>
            <div
              style={{
                width: '100%',
                height: '240px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-alt)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                border: '1px solid var(--border-color)'
              }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <Package size={48} color="var(--text-muted)" />
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <span className="text-secondary">Stock Actual:</span>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>{product.stock} unidades</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="text-secondary">Punto de Reorden:</span>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-warning-yellow)' }}>
                  {product.minimumStock} unidades
                </div>
              </div>
            </div>
          </Card>

          {/* Location & Barcode */}
          <Card title="Ubicación y Código">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} color="var(--color-primary-blue)" />
                <div>
                  <span className="text-secondary">Ubicación Física:</span>
                  <div style={{ fontWeight: 600 }}>{product.location || 'No asignada'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Barcode size={18} color="var(--color-primary-blue)" />
                <div>
                  <span className="text-secondary">Código de Barras:</span>
                  <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                    {product.barcode || 'Sin código registrado'}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Financials, Supplier, Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <Card title="Información Económica y Márgenes">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="kpi-grid">
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                <span className="text-secondary">Precio de Compra</span>
                <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>
                  {formatCurrency(product.purchasePrice)}
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                <span className="text-secondary">Precio de Venta</span>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary-green)', marginTop: '4px' }}>
                  {formatCurrency(product.salePrice)}
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                <span className="text-secondary">Margen de Ganancia</span>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary-blue)', marginTop: '4px' }}>
                  +{profitMargin}%
                </div>
              </div>
            </div>
          </Card>

          <Card title="Detalles del Producto">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span className="text-secondary">Descripción Técnica:</span>
                <p style={{ marginTop: '4px', lineHeight: 1.6 }}>{product.description || 'Sin descripción detallada.'}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid-2">
                <div>
                  <span className="text-secondary">Categoría:</span>
                  <div style={{ fontWeight: 600, marginTop: '2px' }}>
                    {category?.name || 'Sin categoría asignada'}
                  </div>
                </div>

                <div>
                  <span className="text-secondary">Proveedor Principal:</span>
                  <div style={{ fontWeight: 600, marginTop: '2px' }}>
                    {supplier?.company || supplier?.name || 'Sin proveedor asignado'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid var(--border-color-subtle)', paddingTop: '12px', fontSize: '12px' }}>
                <span className="text-secondary">Creado: {formatDate(product.createdAt)}</span>
                <span className="text-secondary">Última actualización: {formatDate(product.updatedAt)}</span>
              </div>
            </div>
          </Card>

          {/* Movement History for this product */}
          <Card title="Historial Reciente de Movimientos" subtitle="Trazabilidad directa sobre esta referencia">
            {movements.length === 0 ? (
              <p className="text-secondary" style={{ padding: '12px 0' }}>
                No se registran movimientos para este producto aún.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {movements.map(m => {
                  const mInfo = formatMovementType(m.type);
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        backgroundColor: 'var(--bg-surface-alt)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={`badge badge-${mInfo.variant}`}>{mInfo.label}</span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{m.reason}</div>
                          <div className="text-secondary" style={{ fontSize: '11px' }}>
                            {formatDate(m.date)} {m.notes && `· ${m.notes}`}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '15px' }}>
                        {m.type === 'EXIT' ? `-${m.quantity}` : `+${m.quantity}`} uds
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
