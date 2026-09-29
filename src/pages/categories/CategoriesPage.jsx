import React, { useState, useEffect, useMemo } from 'react';
import categoryService from '../../services/categoryService';
import productService from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { canCreate, canEdit, canDelete } from '../../utils/permissions';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import TaxonomyModal from '../../components/ui/TaxonomyModal';
import SearchBar from '../../components/ui/SearchBar';
import { TAXONOMY_FAMILIES } from '../../utils/skuTaxonomy';
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  BookOpen,
  LayoutGrid,
  List,
  Package,
  ShieldCheck,
  TrendingUp,
  FolderKanban,
  Hash,
  Laptop,
  Hammer,
  Coffee,
  HeartPulse,
  FileText,
  Shirt,
  Car
} from 'lucide-react';

export default function CategoriesPage() {
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taxonomyModalOpen, setTaxonomyModalOpen] = useState(false);

  // View & Filter States
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'active' });
  const [modalSaving, setModalSaving] = useState(false);

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, category: null, loading: false });

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, prods] = await Promise.all([
        categoryService.getAll(),
        productService.getAll()
      ]);
      setCategories(cats || []);

      // Calculate count of products per category
      const counts = {};
      let total = 0;
      (prods || []).forEach(p => {
        total++;
        if (p.categoryId) {
          counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
        }
      });
      setProductCounts(counts);
      setTotalProductsCount(total);
    } catch (err) {
      setError(err.message || 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Helper to find taxonomic family matching category
  const getTaxonomyMatch = (catName) => {
    if (!catName) return null;
    const lower = catName.toLowerCase();
    for (const [code, fam] of Object.entries(TAXONOMY_FAMILIES)) {
      if (
        fam.name.toLowerCase().includes(lower) ||
        lower.includes(fam.name.toLowerCase()) ||
        (code === 'TEC' && (lower.includes('electr') || lower.includes('tec'))) ||
        (code === 'FER' && (lower.includes('herram') || lower.includes('construc'))) ||
        (code === 'ALI' && (lower.includes('comida') || lower.includes('bebida'))) ||
        (code === 'FAR' && (lower.includes('salud') || lower.includes('farmacia') || lower.includes('med'))) ||
        (code === 'OFI' && (lower.includes('papel') || lower.includes('oficina'))) ||
        (code === 'TEX' && (lower.includes('ropa') || lower.includes('uniforme'))) ||
        (code === 'AUT' && (lower.includes('auto') || lower.includes('repuesto') || lower.includes('mecanic')))
      ) {
        return { code, ...fam };
      }
    }
    return null;
  };

  // Helper to render category icon with dedicated styling
  const renderCategoryIcon = (tax, size = 20) => {
    const code = tax?.code || '';
    switch (code) {
      case 'TEC':
        return <Laptop size={size} />;
      case 'FER':
        return <Hammer size={size} />;
      case 'ALI':
        return <Coffee size={size} />;
      case 'FAR':
        return <HeartPulse size={size} />;
      case 'OFI':
        return <FileText size={size} />;
      case 'TEX':
        return <Shirt size={size} />;
      case 'AUT':
        return <Car size={size} />;
      default:
        return <Layers size={size} />;
    }
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter(c => {
      // Status filter
      if (statusFilter !== 'all' && c.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const tax = getTaxonomyMatch(c.name);
        const matchName = c.name?.toLowerCase().includes(term);
        const matchDesc = c.description?.toLowerCase().includes(term);
        const matchCode = tax?.code?.toLowerCase().includes(term);
        const matchHs = tax?.hsCodePrefix?.toLowerCase().includes(term);
        if (!matchName && !matchDesc && !matchCode && !matchHs) {
          return false;
        }
      }

      return true;
    });
  }, [categories, statusFilter, searchTerm]);

  // Executive KPI Metrics
  const stats = useMemo(() => {
    const totalCats = categories.length;
    const activeCats = categories.filter(c => c.status === 'active').length;
    const inactiveCats = categories.filter(c => c.status === 'inactive').length;

    // Find category with highest product volume
    let topCat = null;
    let maxProducts = -1;
    categories.forEach(c => {
      const count = productCounts[c.id] || 0;
      if (count > maxProducts) {
        maxProducts = count;
        topCat = { name: c.name, count };
      }
    });

    return {
      totalCats,
      activeCats,
      inactiveCats,
      totalProductsCount,
      topCatName: topCat ? topCat.name : 'N/A',
      topCatCount: topCat ? topCat.count : 0
    };
  }, [categories, productCounts, totalProductsCount]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', status: 'active' });
    setModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      status: category.status || 'active'
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      notifyError('El nombre de la categoría es requerido.');
      return;
    }

    setModalSaving(true);
    try {
      if (editingCategory) {
        const updated = await categoryService.update(editingCategory.id, formData, user);
        setCategories(prev => prev.map(c => (c.id === updated.id ? updated : c)));
        notifySuccess('Categoría actualizada correctamente.');
      } else {
        const created = await categoryService.create(formData, user);
        setCategories(prev => [created, ...prev]);
        notifySuccess('Nueva categoría creada.');
      }
      setModalOpen(false);
    } catch (err) {
      notifyError(err.message || 'Error al guardar categoría.');
    } finally {
      setModalSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.category) return;
    setDeleteDialog(prev => ({ ...prev, loading: true }));
    try {
      await categoryService.delete(deleteDialog.category.id, user);
      setCategories(prev => prev.filter(c => c.id !== deleteDialog.category.id));
      notifySuccess('Categoría eliminada con éxito.');
      setDeleteDialog({ isOpen: false, category: null, loading: false });
    } catch (err) {
      notifyError(err.message || 'Error al eliminar categoría.');
      setDeleteDialog(prev => ({ ...prev, loading: false }));
    }
  };

  // Spacious, professional table columns with clear width and dedicated cells
  const columns = [
    {
      header: 'Categoría',
      key: 'name',
      width: '26%',
      render: (_, c) => {
        const tax = getTaxonomyMatch(c.name);
        const iconColor = tax?.color || '#3B82F6';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: `${iconColor}18`,
                color: iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: `1px solid ${iconColor}33`,
                boxShadow: `0 2px 8px ${iconColor}14`
              }}
            >
              {renderCategoryIcon(tax, 20)}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14.5px', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                {c.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Hash size={11} /> ID: {c.id}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Taxonomía & Arancel',
      key: 'taxonomy',
      width: '18%',
      render: (_, c) => {
        const tax = getTaxonomyMatch(c.name);
        const color = tax?.color || '#3B82F6';
        if (!tax) {
          return <span className="text-secondary" style={{ fontSize: '12px' }}>General (GEN)</span>;
        }
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: `${color}15`,
                  color: color,
                  border: `1px solid ${color}35`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title={`Prefijo oficial de SKU: ${tax.code}`}
              >
                [{tax.code}] Familia
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              Capítulo SAC: <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>HS {tax.hsCodePrefix}</strong>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Descripción y Alcance',
      key: 'description',
      width: '32%',
      render: (_, c) => (
        <div
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            paddingRight: '12px'
          }}
        >
          {c.description ? (
            c.description
          ) : (
            <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
              Sin descripción detallada
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Inventario Asociado',
      key: 'productsCount',
      width: '12%',
      render: (_, c) => {
        const count = productCounts[c.id] || 0;
        const percent = totalProductsCount > 0 ? Math.round((count / totalProductsCount) * 100) : 0;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <span
                className={`badge ${count > 0 ? 'badge-info' : 'badge-neutral'}`}
                style={{ fontSize: '12px', fontWeight: 600, padding: '3px 8px' }}
              >
                {count} {count === 1 ? 'producto' : 'productos'}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {percent}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'var(--border-color)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  height: '100%',
                  backgroundColor: count > 0 ? 'var(--primary-500)' : 'transparent',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        );
      }
    },
    {
      header: 'Estado',
      key: 'status',
      width: '6%',
      render: (val) => <StatusBadge status={val} type="user" />
    },
    {
      header: 'Acciones',
      key: 'actions',
      width: '6%',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (_, c) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
          {canEdit(user, 'categories') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenEdit(c)}
              ariaLabel={`Editar categoría ${c.name}`}
              title="Editar Categoría"
              style={{ padding: '6px 8px' }}
            >
              <Edit2 size={15} />
            </Button>
          )}

          {canDelete(user, 'categories') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteDialog({ isOpen: true, category: c, loading: false })}
              ariaLabel={`Eliminar categoría ${c.name}`}
              title="Eliminar Categoría"
              style={{ color: 'var(--color-danger-red)', padding: '6px 8px' }}
            >
              <Trash2 size={15} />
            </Button>
          )}
        </div>
      )
    }
  ];

  const renderMobileCard = (c) => {
    const tax = getTaxonomyMatch(c.name);
    const color = tax?.color || '#3B82F6';
    const count = productCounts[c.id] || 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: `${color}18`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${color}33`
              }}
            >
              {renderCategoryIcon(tax, 18)}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-main)' }}>
                {c.name}
              </div>
              {tax && (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: color
                  }}
                >
                  [{tax.code}] HS {tax.hsCodePrefix}
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={c.status} type="user" />
        </div>

        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {c.description || 'Sin descripción registrada'}
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-color-subtle)'
          }}
        >
          <span className="badge badge-info" style={{ fontSize: '12px' }}>
            {count} {count === 1 ? 'producto' : 'productos'}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {canEdit(user, 'categories') && (
              <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(c)}>
                Editar
              </Button>
            )}
            {canDelete(user, 'categories') && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteDialog({ isOpen: true, category: c, loading: false })}
              >
                Eliminar
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <LoadingState message="Cargando catálogo de categorías..." />;
  if (error) return <ErrorState message={error} onRetry={loadCategories} />;

  return (
    <div className="categories-page" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-header-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1>Categorías y Familias</h1>
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(30, 90, 242, 0.08)',
                color: 'var(--primary-600)',
                border: '1px solid rgba(30, 90, 242, 0.2)',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              <Layers size={13} style={{ marginRight: '4px' }} /> Catálogo Taxonómico
            </span>
          </div>
          <p className="text-secondary" style={{ marginTop: '4px' }}>
            Estructuración taxonómica del inventario para gobernanza, reportes y códigos de SKU
          </p>
        </div>
        <div className="page-header-actions" style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="outline"
            icon={<BookOpen size={17} />}
            onClick={() => setTaxonomyModalOpen(true)}
            style={{ fontWeight: 500 }}
          >
            Guía de Taxonomía
          </Button>
          {canCreate(user, 'categories') && (
            <Button
              variant="primary"
              icon={<Plus size={17} />}
              onClick={handleOpenCreate}
              style={{ fontWeight: 600 }}
            >
              Nueva Categoría
            </Button>
          )}
        </div>
      </div>

      {/* Executive KPI Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        <div className="sp-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(30, 90, 242, 0.1)',
              color: '#1E5AF2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <FolderKanban size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Categorías
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2, marginTop: '2px' }}>
              {stats.totalCats}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {stats.activeCats} activas • {stats.inactiveCats} inactiva(s)
            </div>
          </div>
        </div>

        <div className="sp-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Package size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              SKUs Catalogados
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2, marginTop: '2px' }}>
              {stats.totalProductsCount}
            </div>
            <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 500, marginTop: '2px' }}>
              100% clasificados en familias
            </div>
          </div>
        </div>

        <div className="sp-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              color: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <TrendingUp size={22} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Mayor Volumen
            </div>
            <div
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: 'var(--text-main)',
                lineHeight: 1.2,
                marginTop: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
              title={stats.topCatName}
            >
              {stats.topCatName}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {stats.topCatCount} artículos registrados
            </div>
          </div>
        </div>

        <div className="sp-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              color: '#8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Estándar SAC / HS
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2, marginTop: '2px' }}>
              7 / 7
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Códigos arancelarios alineados
            </div>
          </div>
        </div>
      </div>

      {/* Filter and View Toolbar */}
      <div
        className="sp-card"
        style={{
          padding: '14px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ flex: 1, maxWidth: '420px' }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por categoría, código [FAR], HS o descripción..."
            />
          </div>

          <div style={{ minWidth: '160px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              aria-label="Filtrar por estado"
              style={{ height: '40px', padding: '0 12px', fontSize: '13px' }}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activas únicamente</option>
              <option value="inactive">Inactivas únicamente</option>
            </select>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Vista:</span>
          <div
            style={{
              display: 'inline-flex',
              padding: '3px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)'
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                fontSize: '12.5px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: viewMode === 'table' ? 'var(--bg-surface)' : 'transparent',
                color: viewMode === 'table' ? 'var(--text-main)' : 'var(--text-muted)',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <List size={15} /> Tabla
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                fontSize: '12.5px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: viewMode === 'grid' ? 'var(--bg-surface)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--text-main)' : 'var(--text-muted)',
                boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <LayoutGrid size={15} /> Tarjetas
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Card Grid */}
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={filteredCategories}
          keyField="id"
          emptyMessage="No se encontraron categorías que coincidan con la búsqueda."
          renderMobileCard={renderMobileCard}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '18px'
          }}
        >
          {filteredCategories.length === 0 ? (
            <div
              className="sp-card"
              style={{
                gridColumn: '1 / -1',
                padding: '48px',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}
            >
              No se encontraron categorías para el criterio de búsqueda.
            </div>
          ) : (
            filteredCategories.map((c) => {
              const tax = getTaxonomyMatch(c.name);
              const color = tax?.color || '#3B82F6';
              const count = productCounts[c.id] || 0;
              const percent = totalProductsCount > 0 ? Math.round((count / totalProductsCount) * 100) : 0;

              return (
                <div
                  key={c.id}
                  className="sp-card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Decorative top border tint */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: color
                    }}
                  />

                  {/* Card Header */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '10px',
                            backgroundColor: `${color}18`,
                            color: color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${color}33`,
                            boxShadow: `0 2px 6px ${color}15`
                          }}
                        >
                          {renderCategoryIcon(tax, 22)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-main)' }}>
                            {c.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            ID: #{c.id}
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={c.status} type="user" />
                    </div>

                    {/* Taxonomy badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
                      {tax ? (
                        <>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              backgroundColor: `${color}15`,
                              color: color,
                              border: `1px solid ${color}33`
                            }}
                          >
                            [{tax.code}] SKU
                          </span>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                            SAC: <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>HS {tax.hsCodePrefix}</strong>
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Clasificación General</span>
                      )}
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        marginTop: '12px',
                        marginBottom: 0,
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.55,
                        minHeight: '42px'
                      }}
                    >
                      {c.description || 'Sin descripción detallada para esta categoría.'}
                    </p>
                  </div>

                  {/* Card Footer: Progress and Actions */}
                  <div
                    style={{
                      paddingTop: '14px',
                      borderTop: '1px solid var(--border-color-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`badge ${count > 0 ? 'badge-info' : 'badge-neutral'}`} style={{ fontSize: '12px', fontWeight: 600 }}>
                        {count} {count === 1 ? 'producto' : 'productos'}
                      </span>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {percent}% del catálogo
                      </span>
                    </div>

                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: 'var(--border-color)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          backgroundColor: count > 0 ? color : 'transparent',
                          borderRadius: '2px'
                        }}
                      />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                      {canEdit(user, 'categories') && (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Edit2 size={14} />}
                          onClick={() => handleOpenEdit(c)}
                        >
                          Editar
                        </Button>
                      )}
                      {canDelete(user, 'categories') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 size={14} />}
                          onClick={() => setDeleteDialog({ isOpen: true, category: c, loading: false })}
                          style={{ color: 'var(--color-danger-red)' }}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Editar Categoría de Inventario' : 'Nueva Categoría de Inventario'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={modalSaving}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave} loading={modalSaving}>
              Guardar Categoría
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Nombre de la Categoría"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ej. Suministros de Empaque y Embalaje"
            required
          />

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="form-label" htmlFor="cat-description" style={{ fontWeight: 500 }}>
              Descripción y Alcance
            </label>
            <textarea
              id="cat-description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="form-textarea"
              placeholder="Detalle el tipo de productos comprendidos en esta categoría (ej. cajas, cintas, material de relleno)..."
              style={{ lineHeight: 1.5, resize: 'vertical' }}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="form-label" style={{ fontWeight: 500 }}>Estado Operativo</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="form-select"
            >
              <option value="active">Activo (Disponible para clasificar productos)</option>
              <option value="inactive">Inactivo (Oculto en nuevos ingresos)</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, category: null, loading: false })}
        onConfirm={handleDeleteConfirm}
        title="¿Deseas eliminar esta categoría?"
        message={`Se eliminará permanentemente "${deleteDialog.category?.name}". Verifica previamente que no existan productos asignados a este grupo para no dejar SKUs huérfanos.`}
        confirmText="Eliminar Categoría"
        loading={deleteDialog.loading}
      />

      {/* Taxonomy Guide Modal */}
      <TaxonomyModal
        isOpen={taxonomyModalOpen}
        onClose={() => setTaxonomyModalOpen(false)}
      />
    </div>
  );
}
