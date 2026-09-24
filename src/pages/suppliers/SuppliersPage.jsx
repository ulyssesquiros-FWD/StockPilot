import React, { useState, useEffect } from 'react';
import supplierService from '../../services/supplierService';
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
import { Plus, Edit2, Trash2, Truck, Mail, Phone } from 'lucide-react';

export default function SuppliersPage() {
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [suppliers, setSuppliers] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  });
  const [modalSaving, setModalSaving] = useState(false);

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, supplier: null, loading: false });

  const loadSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sups, prods] = await Promise.all([
        supplierService.getAll(),
        productService.getAll()
      ]);
      setSuppliers(sups || []);

      const counts = {};
      (prods || []).forEach(p => {
        if (p.supplierId) {
          counts[p.supplierId] = (counts[p.supplierId] || 0) + 1;
        }
      });
      setProductCounts(counts);
    } catch (err) {
      setError(err.message || 'Error al cargar proveedores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleOpenCreate = () => {
    setEditingSupplier(null);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      status: 'active'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (sup) => {
    setEditingSupplier(sup);
    setFormData({
      name: sup.name || '',
      company: sup.company || '',
      email: sup.email || '',
      phone: sup.phone || '',
      address: sup.address || '',
      status: sup.status || 'active'
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim()) {
      notifyError('El nombre del contacto y la razón social son obligatorios.');
      return;
    }

    setModalSaving(true);
    try {
      if (editingSupplier) {
        const updated = await supplierService.update(editingSupplier.id, formData, user);
        setSuppliers(prev => prev.map(s => (s.id === updated.id ? updated : s)));
        notifySuccess('Proveedor actualizado correctamente.');
      } else {
        const created = await supplierService.create(formData, user);
        setSuppliers(prev => [created, ...prev]);
        notifySuccess('Nuevo proveedor registrado.');
      }
      setModalOpen(false);
    } catch (err) {
      notifyError(err.message || 'Error al guardar proveedor.');
    } finally {
      setModalSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.supplier) return;
    setDeleteDialog(prev => ({ ...prev, loading: true }));
    try {
      await supplierService.delete(deleteDialog.supplier.id, user);
      setSuppliers(prev => prev.filter(s => s.id !== deleteDialog.supplier.id));
      notifySuccess('Proveedor eliminado correctamente.');
      setDeleteDialog({ isOpen: false, supplier: null, loading: false });
    } catch (err) {
      notifyError(err.message || 'Error al eliminar proveedor.');
      setDeleteDialog(prev => ({ ...prev, loading: false }));
    }
  };

  const columns = [
    {
      header: 'Proveedor / Empresa',
      key: 'company',
      render: (_, s) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary-green-light)',
              color: 'var(--color-primary-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Truck size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{s.company || s.name}</div>
            <div className="text-secondary">Contacto: {s.name}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Contacto',
      key: 'email',
      render: (_, s) => (
        <div style={{ fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={14} color="var(--text-muted)" />
            <span>{s.email || '-'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginTop: '2px' }}>
            <Phone size={14} />
            <span>{s.phone || '-'}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Dirección',
      key: 'address',
      render: (val) => (
        <div style={{ fontSize: '13px', maxWidth: '240px', color: 'var(--text-muted)' }}>
          {val || 'Sin dirección registrada'}
        </div>
      )
    },
    {
      header: 'Catálogo',
      key: 'productsCount',
      render: (_, s) => (
        <span className="badge badge-info">{productCounts[s.id] || 0} producto(s)</span>
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
      render: (_, s) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
          {canEdit(user, 'suppliers') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenEdit(s)}
              ariaLabel={`Editar proveedor ${s.name}`}
              title="Editar"
            >
              <Edit2 size={16} />
            </Button>
          )}

          {canDelete(user, 'suppliers') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteDialog({ isOpen: true, supplier: s, loading: false })}
              ariaLabel={`Eliminar proveedor ${s.name}`}
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

  const renderMobileCard = (s) => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px' }}>{s.company || s.name}</div>
          <div className="text-secondary">Contacto: {s.name}</div>
        </div>
        <StatusBadge status={s.status} type="user" />
      </div>
      <div style={{ marginTop: '8px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div>📧 {s.email}</div>
        <div>📞 {s.phone}</div>
        <div>📍 {s.address}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <span className="badge badge-info">{productCounts[s.id] || 0} productos</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {canEdit(user, 'suppliers') && (
            <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(s)}>
              Editar
            </Button>
          )}
          {canDelete(user, 'suppliers') && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setDeleteDialog({ isOpen: true, supplier: s, loading: false })}
            >
              Eliminar
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) return <LoadingState message="Cargando proveedores..." />;
  if (error) return <ErrorState message={error} onRetry={loadSuppliers} />;

  return (
    <div className="suppliers-page">
      <div className="page-header">
        <div className="page-header-info">
          <h1>Proveedores</h1>
          <p className="text-secondary">
            Gestión de aliados estratégicos, canales de suministro y datos de contacto
          </p>
        </div>
        <div className="page-header-actions">
          {canCreate(user, 'suppliers') && (
            <Button variant="primary" icon={<Plus size={18} />} onClick={handleOpenCreate}>
              Nuevo Proveedor
            </Button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={suppliers}
        keyField="id"
        emptyMessage="No hay proveedores registrados en el sistema."
        renderMobileCard={renderMobileCard}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={modalSaving}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave} loading={modalSaving}>
              Guardar Proveedor
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} noValidate>
          <div className="form-grid-2">
            <Input
              label="Razón Social / Empresa"
              name="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="Ej. Distribuidora del Norte S.A."
              required
            />
            <Input
              label="Nombre del Contacto"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej. Laura González"
              required
            />
          </div>

          <div className="form-grid-2">
            <Input
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="ventas@proveedor.com"
            />
            <Input
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+506 2200-0000"
            />
          </div>

          <Input
            label="Dirección Física / Almacén"
            name="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Parque Industrial, Bodega 4"
          />

          <div className="form-group">
            <label className="form-label">Estado de la Relación Comercial</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="form-select"
            >
              <option value="active">Activo (Habilitado para compras)</option>
              <option value="inactive">Inactivo (Suspendido temporalmente)</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, supplier: null, loading: false })}
        onConfirm={handleDeleteConfirm}
        title="¿Deseas eliminar este proveedor?"
        message={`Se removerá "${deleteDialog.supplier?.company || deleteDialog.supplier?.name}". Verifica que no tenga productos activos asociados.`}
        confirmText="Eliminar Proveedor"
        loading={deleteDialog.loading}
      />
    </div>
  );
}
