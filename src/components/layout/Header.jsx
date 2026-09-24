import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Sparkles,
  Type,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import SearchBar from '../ui/SearchBar';
import Avatar from '../ui/Avatar';
import productService from '../../services/productService';
import alertService from '../../services/alertService';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const { theme, toggleTheme, fontSize, setFontSize } = useTheme();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);

  const searchRef = useRef(null);
  const alertsRef = useRef(null);
  const fontRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchPopup(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(event.target)) {
        setShowAlertsDropdown(false);
      }
      if (fontRef.current && !fontRef.current.contains(event.target)) {
        setShowFontSizeDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch recent active alerts
  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await alertService.getAll();
        const active = (data || []).filter(a => a.status === 'critical' || a.status === 'warning');
        setAlerts(active);
      } catch {
        // Ignore
      }
    }
    loadAlerts();
  }, []);

  // Live global search debounced query
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchPopup(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const allProducts = await productService.getAll();
        const term = searchTerm.toLowerCase();
        const matches = (allProducts || []).filter(
          p =>
            p.name.toLowerCase().includes(term) ||
            p.sku.toLowerCase().includes(term) ||
            (p.brand && p.brand.toLowerCase().includes(term))
        );
        setSearchResults(matches.slice(0, 5));
        setShowSearchPopup(true);
      } catch {
        setSearchResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectProduct = (id) => {
    setShowSearchPopup(false);
    setSearchTerm('');
    navigate(`/productos/${id}`);
  };

  return (
    <header
      className="dashboard-header"
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-lg)',
        position: 'sticky',
        top: 0,
        zIndex: 900
      }}
    >
      {/* Left: Mobile hamburger & Global Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '520px' }}>
        <button
          type="button"
          onClick={onMenuClick}
          className="mobile-only btn-icon btn-ghost"
          aria-label="Abrir menú lateral"
        >
          <Menu size={22} />
        </button>

        <div ref={searchRef} style={{ position: 'relative', width: '100%' }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar productos, SKU o marca..."
          />

          {/* Quick Search Autocomplete Results */}
          {showSearchPopup && searchResults.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                right: 0,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px 0',
                zIndex: 1000
              }}
            >
              <div style={{ padding: '6px 14px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                RESULTADOS RÁPIDOS
              </div>
              {searchResults.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p.id)}
                  style={{
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'background 0.1s'
                  }}
                  className="search-item-hover"
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{p.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      SKU: {p.sku} | Stock: {p.stock}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      backgroundColor: p.stock <= 0 ? 'var(--color-danger-red-light)' : 'var(--color-primary-green-light)',
                      color: p.stock <= 0 ? 'var(--color-danger-red)' : 'var(--color-primary-green)',
                      fontWeight: 600
                    }}
                  >
                    {p.stock <= 0 ? 'Agotado' : 'Disponible'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Quick actions, notifications, theme, font size, user profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Quick link to StockPilot IA */}
        <button
          type="button"
          onClick={() => navigate('/asistente-ia')}
          className="btn-icon btn-ghost"
          title="Abrir Asistente IA"
          aria-label="Abrir Asistente StockPilot IA"
          style={{ color: '#10B981' }}
        >
          <Sparkles size={20} />
        </button>

        {/* Font size accessibility control */}
        <div ref={fontRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowFontSizeDropdown(prev => !prev)}
            className="btn-icon btn-ghost"
            title="Ajustar tamaño de texto"
            aria-label="Cambiar tamaño de fuente accesible"
            style={{ display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            <Type size={18} />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
              {fontSize === 'xlarge' ? 'XL' : fontSize === 'large' ? 'L' : 'M'}
            </span>
          </button>

          {showFontSizeDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                minWidth: '160px',
                padding: '6px',
                zIndex: 1000
              }}
            >
              <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                TAMAÑO DE TEXTO
              </div>
              {[
                { id: 'normal', label: 'Normal (100%)' },
                { id: 'large', label: 'Grande (115%)' },
                { id: 'xlarge', label: 'Muy grande (130%)' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFontSize(item.id);
                    setShowFontSizeDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    fontSize: '13px',
                    borderRadius: 'var(--radius-sm)',
                    background: fontSize === item.id ? 'var(--color-primary-blue-light)' : 'transparent',
                    color: fontSize === item.id ? 'var(--color-primary-blue)' : 'var(--text-main)',
                    fontWeight: fontSize === item.id ? 600 : 400
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme mode toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="btn-icon btn-ghost"
          title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
          aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
        >
          {theme === 'dark' ? <Sun size={20} color="#F59E0B" /> : <Moon size={20} />}
        </button>

        {/* Alerts Notification Bell */}
        <div ref={alertsRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowAlertsDropdown(prev => !prev)}
            className="btn-icon btn-ghost"
            title="Alertas de inventario"
            aria-label="Ver alertas de stock"
            style={{ position: 'relative' }}
          >
            <Bell size={20} />
            {alerts.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-danger-red)'
                }}
              />
            )}
          </button>

          {showAlertsDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                width: '320px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                padding: '12px',
                zIndex: 1000
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Alertas de Inventario</span>
                <span style={{ fontSize: '11px', color: 'var(--color-danger-red)', fontWeight: 600 }}>
                  {alerts.length} activa(s)
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                {alerts.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                    No hay alertas activas pendientes.
                  </p>
                ) : (
                  alerts.slice(0, 4).map(a => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setShowAlertsDropdown(false);
                        navigate('/alertas');
                      }}
                      style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-surface-alt)',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ fontWeight: 600, color: a.priority === 'critical' ? 'var(--color-danger-red)' : 'var(--color-warning-yellow)' }}>
                        {a.priority === 'critical' ? '🔴 Stock Agotado' : '🟡 Stock Bajo'}
                      </div>
                      <div style={{ color: 'var(--text-main)', marginTop: '2px' }}>
                        {a.recommendedAction}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAlertsDropdown(false);
                  navigate('/alertas');
                }}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: '10px' }}
              >
                Ver todas las alertas
              </button>
            </div>
          )}
        </div>

        {/* User Info & Avatar */}
        <div
          onClick={() => navigate('/configuracion')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            paddingLeft: '10px',
            borderLeft: '1px solid var(--border-color)',
            cursor: 'pointer'
          }}
          title="Ver perfil y configuración"
        >
          <Avatar src={user?.avatar} name={user?.name || 'Usuario'} size={34} role={user?.role} />
          <div className="mobile-only" style={{ display: 'none' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{user?.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
