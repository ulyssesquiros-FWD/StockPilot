import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { formatDate } from '../../utils/formatters';
import { ROLE_LABELS } from '../../utils/permissions';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatusBadge from '../../components/ui/StatusBadge';
import Avatar from '../../components/ui/Avatar';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { Plus, Edit2, Trash2, Shield, UserCheck, UserX, Upload, Camera } from 'lucide-react';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);
  const modalFileInputRef = React.useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    status: 'active',
    avatar: '',
    businessName: 'StockPilot Corp'
  });

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, user: null, loading: false });

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'employee',
      status: 'active',
      avatar: '',
      businessName: currentUser?.businessName || 'StockPilot Corp'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormData({
      name: u.name || '',
      email: u.email || '',
      password: u.password || '',
      role: u.role || 'employee',
      status: u.status || 'active',
      avatar: u.avatar || '',
      businessName: u.businessName || 'StockPilot Corp'
    });
    setModalOpen(true);
  };

  const handleModalAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notifyError('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      notifyError('La imagen no debe superar los 3 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, avatar: reader.result }));
      notifySuccess('Foto de usuario cargada en vista previa.');
    };
    reader.readAsDataURL(file);
  };

  const handleToggleStatus = async (u) => {
    if (u.id === currentUser?.id) {
      notifyError('No puedes desactivar tu propia cuenta activa.');
      return;
    }
    const newStatus = u.status === 'active' ? 'inactive' : 'active';
    try {
      const updated = await userService.update(u.id, { status: newStatus }, currentUser);
      setUsers(prev => prev.map(item => (item.id === u.id ? { ...item, status: newStatus } : item)));
      notifySuccess(`Usuario "${u.name}" marcado como ${newStatus === 'active' ? 'Activo' : 'Inactivo'}.`);
    } catch (err) {
      notifyError('Error al cambiar estado del usuario.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      notifyError('Nombre y correo son obligatorios.');
      return;
    }
    if (!editingUser && !formData.password) {
      notifyError('La contraseña es obligatoria para nuevos usuarios.');
      return;
    }

    setModalSaving(true);
    try {
      if (editingUser) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        const updated = await userService.update(editingUser.id, payload, currentUser);
        setUsers(prev => prev.map(item => (item.id === updated.id ? updated : item)));
        notifySuccess('Usuario actualizado correctamente.');
      } else {
        const created = await userService.create(formData, currentUser);
        setUsers(prev => [created, ...prev]);
        notifySuccess('Nuevo usuario creado exitosamente.');
      }
      setModalOpen(false);
    } catch (err) {
      notifyError(err.message || 'Error al guardar usuario.');
    } finally {
      setModalSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.user) return;
    if (deleteDialog.user.id === currentUser?.id) {
      notifyError('No puedes eliminar tu propio usuario en sesión.');
      setDeleteDialog({ isOpen: false, user: null, loading: false });
      return;
    }

    setDeleteDialog(prev => ({ ...prev, loading: true }));
    try {
      await userService.delete(deleteDialog.user.id, currentUser);
      setUsers(prev => prev.filter(u => u.id !== deleteDialog.user.id));
      notifySuccess('Usuario eliminado del sistema.');
      setDeleteDialog({ isOpen: false, user: null, loading: false });
    } catch (err) {
      notifyError(err.message || 'Error al eliminar usuario.');
      setDeleteDialog(prev => ({ ...prev, loading: false }));
    }
  };

  const roleBadgeMap = {
    admin: { label: 'Administrador', variant: 'info' },
    manager: { label: 'Encargado', variant: 'warning' },
    employee: { label: 'Empleado', variant: 'neutral' }
  };

  const columns = [
    {
      header: 'Usuario',
      key: 'name',
      render: (_, u) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar src={u.avatar} name={u.name} size={36} role={u.role} />
          <div>
            <div style={{ fontWeight: 600 }}>{u.name}</div>
            <div className="text-secondary" style={{ fontSize: '12px' }}>{u.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Rol en Sistema',
      key: 'role',
      render: (val) => {
        const r = roleBadgeMap[val] || { label: val, variant: 'neutral' };
        return <span className={`badge badge-${r.variant}`}>{r.label}</span>;
      }
    },
    {
      header: 'Estado',
      key: 'status',
      render: (val) => <StatusBadge status={val} type="user" />
    },
    {
      header: 'Último Acceso',
      key: 'lastLogin',
      render: (val) => formatDate(val)
    },
    {
      header: 'Acciones',
      key: 'actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (_, u) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(u)}
            title={u.status === 'active' ? 'Desactivar usuario' : 'Activar usuario'}
            ariaLabel="Alternar estado de usuario"
          >
            {u.status === 'active' ? <UserX size={16} color="var(--color-warning-yellow)" /> : <UserCheck size={16} color="var(--color-primary-green)" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenEdit(u)}
            title="Editar usuario"
            ariaLabel={`Editar usuario ${u.name}`}
          >
            <Edit2 size={16} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteDialog({ isOpen: true, user: u, loading: false })}
            title="Eliminar usuario"
            ariaLabel={`Eliminar usuario ${u.name}`}
            style={{ color: 'var(--color-danger-red)' }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  const renderMobileCard = (u) => {
    const r = roleBadgeMap[u.role] || { label: u.role, variant: 'neutral' };
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar src={u.avatar} name={u.name} size={32} />
            <div>
              <div style={{ fontWeight: 600 }}>{u.name}</div>
              <div className="text-secondary" style={{ fontSize: '11px' }}>{u.email}</div>
            </div>
          </div>
          <StatusBadge status={u.status} type="user" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <span className={`badge badge-${r.variant}`}>{r.label}</span>
          <span className="text-secondary" style={{ fontSize: '11px' }}>Acceso: {formatDate(u.lastLogin)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px', borderTop: '1px solid var(--border-color-subtle)', paddingTop: '8px' }}>
          <Button variant="secondary" size="sm" onClick={() => handleToggleStatus(u)}>
            {u.status === 'active' ? 'Desactivar' : 'Activar'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleOpenEdit(u)}>
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteDialog({ isOpen: true, user: u, loading: false })}
          >
            Eliminar
          </Button>
        </div>
      </div>
    );
  };

  if (loading) return <LoadingState message="Cargando directorio de usuarios..." />;
  if (error) return <ErrorState message={error} onRetry={loadUsers} />;

  return (
    <div className="users-page">
      <div className="page-header">
        <div className="page-header-info">
          <h1>Gestión de Usuarios y Accesos</h1>
          <p className="text-secondary">
            Administración de cuentas corporativas, credenciales y asignación de roles
          </p>
        </div>
        <div className="page-header-actions">
          <Button variant="primary" icon={<Plus size={18} />} onClick={handleOpenCreate}>
            Nuevo Usuario
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        keyField="id"
        emptyMessage="No se encontraron usuarios registrados."
        renderMobileCard={renderMobileCard}
      />

      {/* Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? `Editar Usuario (${editingUser.name})` : 'Registrar Nuevo Usuario'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={modalSaving}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave} loading={modalSaving}>
              Guardar Usuario
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} noValidate>
          {/* Avatar Upload Area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '12px 16px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '16px'
            }}
          >
            <Avatar
              src={formData.avatar}
              name={formData.name || 'Usuario'}
              size={56}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Foto de Perfil del Usuario
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  ref={modalFileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleModalAvatarChange}
                  style={{ display: 'none' }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<Upload size={14} />}
                  onClick={() => modalFileInputRef.current?.click()}
                >
                  Subir Foto
                </Button>
                {formData.avatar && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 size={14} />}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, avatar: '' }));
                      if (modalFileInputRef.current) modalFileInputRef.current.value = '';
                    }}
                    style={{ color: 'var(--color-danger-red)' }}
                  >
                    Quitar
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Input
            label="Nombre Completo"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ej. Martín Solano"
            required
          />

          <Input
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="usuario@stockpilot.com"
            required
          />

          <Input
            label={editingUser ? 'Nueva Contraseña (dejar en blanco para conservar)' : 'Contraseña de Acceso'}
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="••••••••"
            required={!editingUser}
          />

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label required">Rol en Plataforma</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="form-select"
              >
                <option value="admin">Administrador (Control total)</option>
                <option value="manager">Encargado de Inventario (Operativo completo)</option>
                <option value="employee">Empleado (Consultas y movimientos)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estado de la Cuenta</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="form-select"
              >
                <option value="active">Activo (Puede iniciar sesión)</option>
                <option value="inactive">Inactivo (Acceso bloqueado)</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, user: null, loading: false })}
        onConfirm={handleDeleteConfirm}
        title="¿Deseas eliminar este usuario?"
        message={`Se eliminará permanentemente la cuenta de "${deleteDialog.user?.name}". Perderá todo acceso a la plataforma.`}
        confirmText="Eliminar Usuario"
        loading={deleteDialog.loading}
      />
    </div>
  );
}
