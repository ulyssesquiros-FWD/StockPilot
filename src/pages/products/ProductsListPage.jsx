import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import { useAuth } from '../../context/AuthContext';
import { canCreate, canEdit, canDelete } from '../../utils/permissions';
import { getStockStatus } from '../../utils/inventoryCalculations';
import { formatCurrency } from '../../utils/formatters';
import categoryService from '../../services/categoryService';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

export default function ProductsListPage() {
  const { products, loading, error, reload, deleteProduct } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, product: null, loading: false });

  useEffect(() => {
    categoryService.getAll().then(data => setCategories(data || [])).catch(() => {});
  }, []);

  const categoryMap = useMemo(() => {
    return Object.fromEntries(categories.map(c => [c.id, c.name]));
  }, [categories]);

  // Filtering & Sorting pipeline
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Search term
        if (searchTerm.trim()) {
          const t = searchTerm.toLowerCase();
          const matchName = p.name?.toLowerCase().includes(t);
          const matchSku = p.sku?.toLowerCase().includes(t);
          const matchBrand = p.brand?.toLowerCase().includes(t);
          if (!matchName && !matchSku && !matchBrand) return false;
        }

        // Category filter
        if (categoryFilter && String(p.categoryId) !== String(categoryFilter)) {
          return false;
        }

        // Stock status filter
        if (stockStatusFilter) {
          const status = getStockStatus(p.stock, p.minimumStock);
          if (status !== stockStatusFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
        if (sortBy === 'stock_asc') return (a.stock || 0) - (b.stock || 0);
        if (sortBy === 'stock_desc') return (b.stock || 0) - (a.stock || 0);
        if (sortBy === 'price_asc') return (a.salePrice || 0) - (b.salePrice || 0);
        if (sortBy === 'price_desc') return (b.salePrice || 0) - (a.salePrice || 0);
        return 0;
      });
  }, [products, searchTerm, categoryFilter, stockStatusFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.product) return;
    setDeleteDialog(prev => ({ ...prev, loading: true }));
    try {
      await deleteProduct(deleteDialog.product.id);
      setDeleteDialog({ isOpen: false, product: null, loading: false });
    } catch {
      setDeleteDialog(prev => ({ ...prev, loading: false }));
    }
  };

  const columns = [
    {
      header: 'Producto',
      key: 'name',
      render: (_, p) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-surface-alt)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-color)'
            }}
          >
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>IMG</span>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.name}</div>
            <div className="text-secondary">
              SKU: <span style={{ fontFamily: 'monospace' }}>{p.sku}</span> {p.brand && `· ${p.brand}`}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Categoría',
      key: 'categoryId',
      render: (val) => categoryMap[val] || 'Sin categoría'
    },
    {
      header: 'Precio Venta',
      key: 'salePrice',
      render: (val) => <span style={{ fontWeight: 600 }}>{formatCurrency(val)}</span>
    },
    {
      header: 'Existencias',
      key: 'stock',
      render: (_, p) => (
        <div>
          <span style={{ fontWeight: 700, fontSize: '15px' }}>{p.stock}</span>
          <span className="text-secondary" style={{ marginLeft: '4px' }}>
            (mín: {p.minimumStock})
          </span>
        </div>
      )
    },
    {
      header: 'Estado',
      key: 'status',
      render: (_, p) => (
        <StatusBadge status={getStockStatus(p.stock, p.minimumStock)} type="stock" />
      )
    },
    {
      header: 'Acciones',
      key: 'actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (_, p) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/productos/${p.id}`)}
            ariaLabel={`Ver detalle de ${p.name}`}
            title="Ver detalle"
          >
            <Eye size={16} />
          </Button>

          {canEdit(user, 'products') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/productos/${p.id}/editar`)}
              ariaLabel={`Editar ${p.name}`}
              title="Editar producto"
            >
              <Edit2 size={16} />
            </Button>
          )}

          {canDelete(user, 'products') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteDialog({ isOpen: true, product: p, loading: false })}
              ariaLabel={`Eliminar ${p.name}`}
              title="Eliminar producto"
              style={{ color: 'var(--color-danger-red)' }}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      )
    }
  ];

  // Mobile card rendering for touchscreens
  const renderMobileCard = (p) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontWeight: 600, fontSize: '15px' }}>{p.name}</div>
        <StatusBadge status={getStockStatus(p.stock, p.minimumStock)} type="stock" />
      </div>
      <div className="text-secondary" style={{ display: 'flex', gap: '12px' }}>
        <span>SKU: {p.sku}</span>
        <span>{categoryMap[p.categoryId] || 'Sin categoría'}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <div>
          <span className="text-secondary">Precio: </span>
          <strong>{formatCurrency(p.salePrice)}</strong>
        </div>
        <div>
          <span className="text-secondary">Stock: </span>
          <strong style={{ fontSize: '15px' }}>{p.stock}</strong> (mín: {p.minimumStock})
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px', borderTop: '1px solid var(--border-color-subtle)', paddingTop: '8px' }}>
        <Button variant="secondary" size="sm" onClick={() => navigate(`/productos/${p.id}`)}>
          Detalle
        </Button>
        {canEdit(user, 'products') && (
          <Button variant="outline" size="sm" onClick={() => navigate(`/productos/${p.id}/editar`)}>
            Editar
          </Button>
        )}
        {canDelete(user, 'products') && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteDialog({ isOpen: true, product: p, loading: false })}
          >
            Eliminar
          </Button>
        )}
      </div>
    </div>
  );

  if (loading && products.length === 0) {
    return <LoadingState message="Cargando catálogo de productos..." />;
  }

  if (error && products.length === 0) {
    return <ErrorState message={error} onRetry={reload} />;
  }

  return (
    <div className="products-list-page">
      <div className="page-header">
        <div className="page-header-info">
          <h1>Productos</h1>
          <p className="text-secondary">
            Catálogo de inventario, existencias, precios y control de umbrales
          </p>
        </div>
        <div className="page-header-actions">
          {canCreate(user, 'products') && (
            <Button
              variant="primary"
              icon={<Plus size={18} />}
              onClick={() => navigate('/productos/nuevo')}
            >
              Nuevo Producto
            </Button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className="sp-card"
        style={{
          marginBottom: 'var(--space-md)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '240px' }}>
            <SearchBar
              value={searchTerm}
              onChange={t => { setSearchTerm(t); setCurrentPage(1); }}
              placeholder="Buscar por nombre, SKU o marca..."
            />
          </div>

          <div style={{ flex: 1, minWidth: '180px' }}>
            <select
              value={categoryFilter}
              onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="form-select"
              aria-label="Filtrar por categoría"
            >
              <option value="">Todas las Categorías</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '160px' }}>
            <select
              value={stockStatusFilter}
              onChange={e => { setStockStatusFilter(e.target.value); setCurrentPage(1); }}
              className="form-select"
              aria-label="Filtrar por estado de stock"
            >
              <option value="">Todos los Estados</option>
              <option value="available">Disponible</option>
              <option value="low_stock">Stock bajo</option>
              <option value="out_of_stock">Agotado</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '160px' }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="form-select"
              aria-label="Ordenar productos"
            >
              <option value="name_asc">Nombre (A-Z)</option>
              <option value="name_desc">Nombre (Z-A)</option>
              <option value="stock_asc">Menor Stock</option>
              <option value="stock_desc">Mayor Stock</option>
              <option value="price_asc">Menor Precio</option>
              <option value="price_desc">Mayor Precio</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table / Mobile Cards */}
      <DataTable
        columns={columns}
        data={paginatedProducts}
        keyField="id"
        emptyMessage="No se encontraron productos que coincidan con los filtros aplicados."
        renderMobileCard={renderMobileCard}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredProducts.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, product: null, loading: false })}
        onConfirm={handleDeleteConfirm}
        title="¿Deseas eliminar este producto?"
        message={`Estás a punto de eliminar de forma permanente "${deleteDialog.product?.name}". Esta acción no se puede deshacer.`}
        confirmText="Eliminar Producto"
        loading={deleteDialog.loading}
      />
    </div>
  );
}
