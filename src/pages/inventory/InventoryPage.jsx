import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import reportService from '../../services/reportService';
import { getStockStatus, getInventoryValue } from '../../utils/inventoryCalculations';
import { formatCurrency } from '../../utils/formatters';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import StatusBadge from '../../components/ui/StatusBadge';
import Tabs from '../../components/ui/Tabs';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { Download, ArrowLeftRight, PackageCheck, AlertTriangle, XCircle, Boxes } from 'lucide-react';

export default function InventoryPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
    } catch (err) {
      setError(err.message || 'Error al cargar el inventario.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categoryMap = useMemo(() => {
    return Object.fromEntries(categories.map(c => [c.id, c.name]));
  }, [categories]);

  // Tab counts
  const availableCount = products.filter(p => getStockStatus(p.stock, p.minimumStock) === 'available').length;
  const lowStockCount = products.filter(p => getStockStatus(p.stock, p.minimumStock) === 'low_stock').length;
  const outOfStockCount = products.filter(p => getStockStatus(p.stock, p.minimumStock) === 'out_of_stock').length;

  const tabs = [
    { id: 'all', label: 'Todos los Artículos', count: products.length, icon: <Boxes size={16} /> },
    { id: 'available', label: 'Disponibles', count: availableCount, icon: <PackageCheck size={16} /> },
    { id: 'low_stock', label: 'Stock Bajo', count: lowStockCount, icon: <AlertTriangle size={16} /> },
    { id: 'out_of_stock', label: 'Agotados', count: outOfStockCount, icon: <XCircle size={16} /> }
  ];

  // Filtering
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const status = getStockStatus(p.stock, p.minimumStock);
      if (activeTab !== 'all' && status !== activeTab) {
        return false;
      }

      if (searchTerm.trim()) {
        const t = searchTerm.toLowerCase();
        return (
          p.name?.toLowerCase().includes(t) ||
          p.sku?.toLowerCase().includes(t) ||
          p.location?.toLowerCase().includes(t)
        );
      }
      return true;
    });
  }, [products, activeTab, searchTerm]);

  const totalFilteredValue = useMemo(() => {
    return getInventoryValue(filteredProducts);
  }, [filteredProducts]);

  const handleExportCSV = () => {
    const rows = filteredProducts.map(p => ({
      name: p.name,
      sku: p.sku,
      category: categoryMap[p.categoryId] || 'Sin categoría',
      stock: p.stock,
      minimumStock: p.minimumStock,
      purchasePrice: p.purchasePrice,
      salePrice: p.salePrice,
      status: getStockStatus(p.stock, p.minimumStock),
      location: p.location || '-'
    }));

    reportService.exportToCSV('inventario-stockpilot', rows, {
      name: 'Nombre Producto',
      sku: 'SKU',
      category: 'Categoría',
      stock: 'Stock Actual',
      minimumStock: 'Stock Mínimo',
      purchasePrice: 'Costo Compra',
      salePrice: 'Precio Venta',
      status: 'Estado',
      location: 'Ubicación'
    });
  };

  const columns = [
    {
      header: 'Referencia / Producto',
      key: 'name',
      render: (_, p) => (
        <div>
          <div style={{ fontWeight: 600 }}>{p.name}</div>
          <div className="text-secondary" style={{ fontSize: '11px', fontFamily: 'monospace' }}>
            SKU: {p.sku} {p.location && `· 📍 ${p.location}`}
          </div>
        </div>
      )
    },
    {
      header: 'Categoría',
      key: 'categoryId',
      render: val => categoryMap[val] || 'Sin categoría'
    },
    {
      header: 'Stock Actual',
      key: 'stock',
      render: (_, p) => (
        <div>
          <span style={{ fontWeight: 700, fontSize: '16px' }}>{p.stock}</span>
          <span className="text-secondary" style={{ marginLeft: '4px' }}>
            (mín: {p.minimumStock})
          </span>
        </div>
      )
    },
    {
      header: 'Costo Unitario',
      key: 'purchasePrice',
      render: val => formatCurrency(val)
    },
    {
      header: 'Valor Total Stock',
      key: 'totalValue',
      render: (_, p) => (
        <span style={{ fontWeight: 600 }}>
          {formatCurrency((p.stock || 0) * (p.purchasePrice || 0))}
        </span>
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/movimientos')}
          icon={<ArrowLeftRight size={14} />}
        >
          Ajustar
        </Button>
      )
    }
  ];

  const renderMobileCard = (p) => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontWeight: 600, fontSize: '15px' }}>{p.name}</div>
        <StatusBadge status={getStockStatus(p.stock, p.minimumStock)} type="stock" />
      </div>
      <div className="text-secondary" style={{ fontSize: '12px', margin: '4px 0' }}>
        SKU: {p.sku} · 📍 {p.location || 'Sin ubicación'}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <div>
          <span className="text-secondary">Stock: </span>
          <strong style={{ fontSize: '16px' }}>{p.stock}</strong> (mín {p.minimumStock})
        </div>
        <div>
          <span className="text-secondary">Valoración: </span>
          <strong>{formatCurrency((p.stock || 0) * (p.purchasePrice || 0))}</strong>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/movimientos')}
          icon={<ArrowLeftRight size={14} />}
        >
          Ajustar Stock
        </Button>
      </div>
    </div>
  );

  if (loading) return <LoadingState message="Calculando existencias y valoraciones..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="inventory-page">
      <div className="page-header">
        <div className="page-header-info">
          <h1>Control de Existencias</h1>
          <p className="text-secondary">
            Supervisión integral de inventario físico, umbrales y valor de existencias
          </p>
        </div>
        <div className="page-header-actions">
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            onClick={handleExportCSV}
          >
            Exportar CSV
          </Button>
          <Button
            variant="primary"
            icon={<ArrowLeftRight size={16} />}
            onClick={() => navigate('/movimientos')}
          >
            Registrar Movimiento
          </Button>
        </div>
      </div>

      {/* Tabs Filter */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Search and Summary */}
      <div
        className="sp-card"
        style={{
          marginBottom: 'var(--space-md)',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ flex: 1, minWidth: '240px', maxWidth: '400px' }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Filtrar por nombre, SKU o ubicación..."
          />
        </div>
        <div style={{ fontSize: '14px', color: 'var(--text-main)' }}>
          Valor total en vista actual:{' '}
          <strong style={{ fontSize: '16px', color: 'var(--color-primary-blue)' }}>
            {formatCurrency(totalFilteredValue)}
          </strong>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredProducts}
        keyField="id"
        emptyMessage="No hay existencias coincidentes con la vista actual."
        renderMobileCard={renderMobileCard}
      />
    </div>
  );
}
