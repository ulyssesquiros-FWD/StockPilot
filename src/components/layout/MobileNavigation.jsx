import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Bell,
  Sparkles
} from 'lucide-react';

export default function MobileNavigation({ alertCount = 0 }) {
  const items = [
    { to: '/dashboard', label: 'Inicio', icon: <LayoutDashboard size={20} /> },
    { to: '/productos', label: 'Productos', icon: <Package size={20} /> },
    { to: '/movimientos', label: 'Movimientos', icon: <ArrowLeftRight size={20} /> },
    { to: '/alertas', label: 'Alertas', icon: <Bell size={20} />, badge: alertCount > 0 ? alertCount : null },
    { to: '/asistente-ia', label: 'IA Copilot', icon: <Sparkles size={20} /> }
  ];

  return (
    <nav
      className="mobile-only mobile-bottom-bar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 950,
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
      }}
      aria-label="Navegación móvil inferior"
    >
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            flex: 1,
            height: '100%',
            color: isActive ? 'var(--color-primary-blue)' : 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '11px',
            fontWeight: isActive ? 600 : 500,
            position: 'relative'
          })}
        >
          <span style={{ position: 'relative' }}>
            {item.icon}
            {item.badge && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-6px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-danger-red)'
                }}
              />
            )}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
