import React, { useState, useEffect } from 'react';
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
import { TAXONOMY_FAMILIES } from '../../utils/skuTaxonomy';
import { Plus, Edit2, Trash2, Layers, BookOpen } from 'lucide-react';

export default function CategoriesPage() {
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taxonomyModalOpen, setTaxonomyModalOpen] = useState(false);

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
      (prods || []).forEach(p => {
        if (p.categoryId) {
          counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
        }
      });
      setProductCounts(counts);
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
        (code === 'TEC' && lower.includes('electr')) ||
        (code === 'FER' && lower.includes('herram')) ||
        (code === 'OFI' && lower.includes('papel')) ||
        (code === 'TEX' && lower.includes('ropa'))
      ) {
        return { code, ...fam };
      }
    }
    return null;
  };

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

  const columns = [
    {
      header: 'Categoría y Taxonomía',
      key: 'name',
      render: (_, c) => {
        const tax = getTaxonomyMatch(c.name);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-primary-blue-light)',
                color: 'var(--color-primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '18px'
              }}
            >
              {tax?.icon || <Layers size={18} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                {tax && (
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      color: 'var(--color-primary-blue)',
                      border: '1px solid rgba(59, 130, 246, 0.25)'
                    }}
                    title={`Prefijo SKU: ${tax.code} | Código Arancelario HS: ${tax.hsChapter}`}
                  >
                    [{tax.code}] HS {tax.hsChapter}
                  </span>
                )}
              </div>
              <div className="text-secondary" style={{ maxWidth: '340px' }}>
                {c.description || 'Sin descripción'}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Productos Asociados',
      key: 'productsCount',
      render: (_, c) => (
        <span className="badge badge-info">
          {productCounts[c.id] || 0} producto(s)
        </span>
      )
    },
    {
      header: 'Estado',
      key: 'status',
      render: (val) => <StatusBadge status={val} type="user" />
    },
    {
      header: 'Acciones',
      key: 'actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (_, c) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
          {canEdit(user, 'categories') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenEdit(c)}
              ariaLabel={`Editar categoría ${c.name}`}
              title="Editar"
            >
              <Edit2 size={16} />
            </Button>
          )}

          {canDelete(user, 'categories') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteDialog({ isOpen: true, category: c, loading: false })}
              ariaLabel={`Eliminar categoría ${c.name}`}
              title="Eliminar"
              style={{ color: 'var(--color-danger-red)' }}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      )
    }
  ];

  const renderMobileCard = (c) => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontWeight: 600, fontSize: '15px' }}>{c.name}</div>
        <StatusBadge status={c.status} type="user" />
      </div>
      <p className="text-secondary" style={{ margin: '6px 0' }}>{c.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <span className="badge badge-info">{productCounts[c.id] || 0} productos</span>
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

  if (loading) return <LoadingState message="Cargando categorías..." />;
  if (error) return <ErrorState message={error} onRetry={loadCategories} />;

  return (
    <div className="categories-page">
      <div className="page-header">
        <div className="page-header-info">
          <h1>Categorías</h1>
          <p className="text-secondary">
            Organización taxonómica del inventario para reportes y filtros
          </p>
        </div>
        <div className="page-header-actions">
          <Button
            variant="outline"
            icon={<BookOpen size={18} />}
            onClick={() => setTaxonomyModalOpen(true)}
          >
            Guía de Taxonomía
          </Button>
          {canCreate(user, 'categories') && (
            <Button variant="primary" icon={<Plus size={18} />} onClick={handleOpenCreate}>
              Nueva Categoría
            </Button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        keyField="id"
        emptyMessage="No hay categorías registradas en el sistema."
        renderMobileCard={renderMobileCard}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={modalSaving}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave} loading={modalSaving}>
              Guardar
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} noValidate>
          <Input
            label="Nombre de la Categoría"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ej. Suministros de Empaque"
            required
          />

          <div className="form-group">
            <label className="form-label" htmlFor="cat-description">
              Descripción
            </label>
            <textarea
              id="cat-description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="form-textarea"
              placeholder="Detalle los productos comprendidos en este grupo..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estado</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="form-select"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
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
        message={`Se eliminará "${deleteDialog.category?.name}". Verifica que no tenga productos asociados.`}
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
