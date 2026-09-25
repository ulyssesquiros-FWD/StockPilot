import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import LogoFull from '../../assets/brand/LogoFull';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ArrowLeftRight,
  Truck,
  Bell,
  BarChart3,
  Users,
  Settings,
  Sparkles,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { canAccessRoute } from '../../utils/permissions';
import Avatar from '../ui/Avatar';

export default function Sidebar({ isOpen, onClose, alertCount = 0, onOpenAI }) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/productos', label: 'Productos', icon: <Package size={20} /> },
    { to: '/categorias', label: 'Categorías', icon: <Layers size={20} /> },
    { to: '/inventario', label: 'Inventario', icon: <Boxes size={20} /> },
    { to: '/movimientos', label: 'Movimientos', icon: <ArrowLeftRight size={20} /> },
    { to: '/proveedores', label: 'Proveedores', icon: <Truck size={20} /> },
    { to: '/alertas', label: 'Alertas', icon: <Bell size={20} />, badge: alertCount > 0 ? alertCount : null },
    { to: '/reportes', label: 'Reportes', icon: <BarChart3 size={20} /> },
    { to: '/usuarios', label: 'Usuarios', icon: <Users size={20} />, adminOnly: true },
    { to: '/asistente-ia', label: 'StockPilot IA', icon: <Sparkles size={20} />, highlight: true },
    { to: '/configuracion', label: 'Configuración', icon: <Settings size={20} /> }
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') return false;
    return canAccessRoute(user, item.to);
  });

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            zIndex: 998,
            backdropFilter: 'blur(2px)'
          }}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar-container ${isOpen ? 'sidebar-open' : ''}`}
        style={{
          width: 'var(--sidebar-width)',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 999,
          backgroundColor: theme === 'dark' ? '#0F172A' : '#0A2E5B',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'transform var(--transition-normal)',
          transform: isOpen || window.innerWidth > 768 ? 'translateX(0)' : 'translateX(-100%)'
        }}
        aria-label="Navegación principal"
      >
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--header-height)',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <LogoFull variant="dark" size={32} showTagline={false} />
          <button
            type="button"
            className="mobile-only btn-icon btn-ghost"
            onClick={onClose}
            aria-label="Cerrar menú"
            style={{ color: '#FFFFFF', padding: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav
          style={{
            flex: 1,
            padding: '16px 12px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          {filteredNavItems.map(item => {
            const isAI = item.to === '/asistente-ia';
            if (isAI && onOpenAI) {
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => {
                    if (window.innerWidth <= 768 && onClose) onClose();
                    onOpenAI();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    color: '#34D399',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    fontWeight: 600,
                    fontSize: '14px',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Abrir Asistente IA en la página actual"
                  aria-label="Abrir asistente de IA en la página actual"
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <span
                    style={{
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      textTransform: 'uppercase'
                    }}
                  >
                    Copilot
                  </span>
                </button>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth <= 768 && onClose) onClose();
                }}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  backgroundColor: isActive ? 'var(--color-primary-blue)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                })}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      backgroundColor: 'var(--color-danger-red)',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '10px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {item.highlight && (
                  <span
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.25)',
                      color: '#34D399',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      textTransform: 'uppercase'
                    }}
                  >
                    IA
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Logout Footer */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <div
            onClick={() => navigate('/configuracion')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', cursor: 'pointer' }}
            title="Ver perfil y configuración"
          >
            <Avatar src={user?.avatar} name={user?.name || 'Usuario'} size={36} role={user?.role} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Usuario'}
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'capitalize' }}>
                {user?.role === 'admin' ? 'Administrador' : user?.role === 'manager' ? 'Encargado' : 'Empleado'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="btn-icon btn-ghost"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            style={{ color: '#EF4444', padding: '8px', borderRadius: 'var(--radius-sm)' }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}
