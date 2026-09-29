import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import LogoFull from '../../assets/brand/LogoFull';
import LogoIsotype from '../../assets/brand/LogoIsotype';
import './home.css';
import {
  Sparkles,
  ArrowRight,
  Package,
  Layers,
  ShieldCheck,
  FileText,
  Bot,
  Truck,
  CheckCircle2,
  TrendingUp,
  LogIn,
  LayoutDashboard,
  Zap,
  Sun,
  Moon,
  Menu,
  X,
  Copy,
  Check,
  ArrowLeftRight,
  Laptop,
  Hammer,
  Coffee,
  HeartPulse,
  Shirt,
  Car,
  AlertTriangle
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Interactive State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedRole, setCopiedRole] = useState(null);
  const [activeAiDemo, setActiveAiDemo] = useState(0);

  const isDark = theme === 'dark';

  const copyCredentials = (email, pass, roleKey) => {
    navigator.clipboard?.writeText(`${email} | ${pass}`);
    setCopiedRole(roleKey);
    setTimeout(() => setCopiedRole(null), 2000);
  };

  const aiDemoConversations = [
    {
      q: '¿Qué productos de Farmacia y Salud tenemos registrados en bodega?',
      a: 'En StockPilot hay EXACTAMENTE 2 productos asociados a Farmacia y Salud (FAR): FAR-GEL-1L (Alcohol en Gel 1L, Stock: 22 u.) y FAR-BOT-IND45 (Botiquín Industrial, Stock: 5 u.). Ambos cuentan con existencias saludables sin alertas de quiebre.',
      tag: 'Consulta de Categoría'
    },
    {
      q: '¿Cuáles son las referencias críticas en riesgo inminente de agotamiento?',
      a: 'Diagnóstico crítico de inventario: La Cinta Métrica Profesional 8m (FER-STA-TAPE8) está AGOTADA (0 u.). Además, 6 productos (incluyendo Mouse Logitech MX y Tóner HP 85A) están en stock mínimo. Se recomienda emitir orden de reposición hoy.',
      tag: 'Detección de Quiebres'
    },
    {
      q: '¿Cuál es la valorización total del inventario y rotación reciente?',
      a: 'El valor total de adquisición registrado asciende a $16,917.50 USD distribuidos en 23 SKUs. En los últimos 30 días se auditaron 39 transacciones de Kardex, con una concentración de salida del 42% en la familia TEC.',
      tag: 'Valorización & Métricas'
    }
  ];

  const tickerItems = [
    { icon: <Zap size={14} />, text: 'CONTROL EN TIEMPO REAL', highlight: true },
    { icon: <Bot size={14} />, text: 'IA CON MEMORIA CONTEXTUAL DE 1 HORA' },
    { icon: <ShieldCheck size={14} />, text: 'TRAZABILIDAD 100% EN KARDEX' },
    { icon: <Package size={14} />, text: 'TAXONOMÍA SAC / HS CON CÓDIGOS DE BARRAS' },
    { icon: <TrendingUp size={14} />, text: 'DETECCIÓN TEMPRANA DE QUIEBRES' },
    { icon: <FileText size={14} />, text: 'REPORTES GERENCIALES EN PDF EN 1 CLIC' },
    { icon: <Sparkles size={14} />, text: '7 FAMILIAS COMERCIALES ESTANDARIZADAS', highlight: true },
    { icon: <CheckCircle2 size={14} />, text: 'SEGURIDAD RBAC MULTI-ROL' }
  ];

  return (
    <div className="stockpilot-landing">
      {/* Background Ambience Layers */}
      <div className="lp-bg-ambient" aria-hidden="true" />
      <div className="lp-grid-pattern" aria-hidden="true" />

      {/* Top Release Banner */}
      <aside
        style={{
          backgroundColor: isDark ? 'rgba(10, 46, 91, 0.65)' : 'rgba(235, 243, 252, 0.95)',
          borderBottom: '1px solid rgba(30, 90, 242, 0.2)',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '12.5px',
          fontWeight: 500,
          color: isDark ? '#93C5FD' : '#0B4D9B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          position: 'relative',
          zIndex: 1001
        }}
      >
        <span
          style={{
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 700,
            padding: '1px 6px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}
        >
          Nuevo v4.0
        </span>
        <span>Copiloto de IA con memoria contextual de 1 hora y reportes ejecutivos en PDF.</span>
        <Link
          to="/login"
          style={{
            color: isDark ? '#FFFFFF' : '#0B4D9B',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            marginLeft: '4px'
          }}
        >
          Probar Ahora <ArrowRight size={13} />
        </Link>
      </aside>

      {/* 1. Header / Navbar */}
      <header className="lp-navbar" role="banner">
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }} aria-label="Inicio StockPilot">
            <LogoFull variant={isDark ? 'dark' : 'light'} size={34} />
          </Link>

          {/* Desktop Nav Links */}
          <nav
            className="landing-nav-links"
            aria-label="Navegación principal"
            style={{ display: 'flex', alignItems: 'center', gap: '26px' }}
          >
            <a href="#proposito" className="lp-nav-link">Propósito</a>
            <a href="#solucion" className="lp-nav-link">Solución</a>
            <a href="#caracteristicas" className="lp-nav-link">Plataforma</a>
            <a href="#inteligencia" className="lp-nav-link">Copiloto IA</a>
            <a href="#sectores" className="lp-nav-link">Sectores</a>
            <a href="#beneficios" className="lp-nav-link">Beneficios</a>
          </nav>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-icon btn-ghost"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid var(--lp-border)',
                color: 'var(--lp-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--lp-surface)'
              }}
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label="Alternar tema de interfaz"
            >
              {isDark ? <Sun size={17} style={{ color: '#FBBF24' }} /> : <Moon size={17} style={{ color: '#0A2E5B' }} />}
            </button>

            {/* Auth CTA */}
            {isAuthenticated ? (
              <button
                type="button"
                className="lp-btn-primary"
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '9px 18px',
                  fontSize: '13.5px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                }}
              >
                <LayoutDashboard size={16} /> Mi Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    color: 'var(--lp-text)',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s'
                  }}
                  className="hide-mobile"
                >
                  Iniciar Sesión
                </Link>
                <button
                  type="button"
                  className="lp-btn-primary"
                  onClick={() => navigate('/login')}
                  style={{ padding: '9px 20px', fontSize: '13.5px' }}
                >
                  <LogIn size={15} /> Acceder al Sistema
                </button>
              </>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="btn-icon btn-ghost show-mobile-only"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Menú móvil"
              style={{
                display: 'none',
                padding: '6px',
                border: '1px solid var(--lp-border)',
                borderRadius: '8px',
                color: 'var(--lp-text)'
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'var(--lp-surface)',
              borderTop: '1px solid var(--lp-border)',
              marginTop: '12px',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 20px 30px rgba(0,0,0,0.2)'
            }}
          >
            <a href="#proposito" onClick={() => setMobileMenuOpen(false)} className="lp-nav-link">Propósito</a>
            <a href="#solucion" onClick={() => setMobileMenuOpen(false)} className="lp-nav-link">Solución</a>
            <a href="#caracteristicas" onClick={() => setMobileMenuOpen(false)} className="lp-nav-link">Plataforma</a>
            <a href="#inteligencia" onClick={() => setMobileMenuOpen(false)} className="lp-nav-link">Copiloto IA</a>
            <a href="#sectores" onClick={() => setMobileMenuOpen(false)} className="lp-nav-link">Sectores</a>
            <a href="#beneficios" onClick={() => setMobileMenuOpen(false)} className="lp-nav-link">Beneficios</a>
            <div style={{ paddingTop: '8px', borderTop: '1px solid var(--lp-border)' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="lp-btn-primary"
                style={{ width: '100%', textAlign: 'center' }}
              >
                Ingresar a la Plataforma
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '70px 24px 80px',
          textAlign: 'center',
          zIndex: 1
        }}
        aria-labelledby="hero-heading"
      >
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          {/* Tag Pill */}
          <div className="lp-badge-pill lp-animate-fade">
            <Sparkles size={14} style={{ color: '#10B981' }} />
            <span>Plataforma Empresarial • Tu inventario, en control.</span>
          </div>

          {/* Main Headline */}
          <h1 id="hero-heading" className="lp-hero-title lp-hero-title-gradient lp-animate-fade">
            Control integral de inventarios, trazabilidad exacta y asistencia predictiva con IA.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              lineHeight: 1.6,
              color: 'var(--lp-text-muted)',
              maxWidth: '820px',
              margin: '0 auto 36px',
              fontWeight: 400
            }}
          >
            Centraliza existencias con codificación taxonómica internacional SAC/HS, audita movimientos en tiempo real, anticipa quiebres de stock y acelera tus compras con un copiloto inteligente autónomo.
          </p>

          {/* Hero CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '48px'
            }}
          >
            <Link to="/login" className="lp-btn-primary">
              <span>{isAuthenticated ? 'Ir a mi Dashboard' : 'Iniciar Sesión en StockPilot'}</span>
              <ArrowRight size={17} />
            </Link>

            <a href="#plataforma-demo" className="lp-btn-secondary">
              <Zap size={16} style={{ color: '#F59E0B' }} />
              <span>Explorar Plataforma en Vivo</span>
            </a>
          </div>

          {/* Trust Highlights Checklist */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              fontSize: '13px',
              color: 'var(--lp-text-muted)',
              marginBottom: '60px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: '#10B981' }} />
              <span>Taxonomía oficial SAC / HS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: '#10B981' }} />
              <span>Memoria IA de 1 hora activa</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: '#10B981' }} />
              <span>Expedientes ejecutivos en PDF</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: '#10B981' }} />
              <span>Kardex auditado segundo a segundo</span>
            </div>
          </div>

          {/* 3. Hero Visual Showcase: Interactive SaaS Dashboard Mockup */}
          <div id="plataforma-demo" className="lp-mockup-wrapper">
            {/* Window Chrome Header */}
            <div
              style={{
                padding: '12px 20px',
                background: isDark ? '#0A1E3B' : '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--lp-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <div
                  style={{
                    marginLeft: '12px',
                    padding: '3px 12px',
                    borderRadius: '6px',
                    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
                    border: '1px solid var(--lp-border)',
                    fontSize: '11.5px',
                    fontFamily: 'monospace',
                    color: 'var(--lp-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ShieldCheck size={12} style={{ color: '#10B981' }} />
                  <span>https://app.stockpilot.io/dashboard</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    padding: '3px 9px',
                    borderRadius: '12px'
                  }}
                >
                  <span className="lp-pulse" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981' }} />
                  Kardex Sincronizado en Tiempo Real
                </span>
              </div>
            </div>

            {/* Mockup Dashboard Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
              {/* 4 Interactive KPI Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: '14px'
                }}
              >
                <div className="lp-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--lp-text-muted)', textTransform: 'uppercase' }}>
                      Catálogo Total
                    </span>
                    <Package size={18} style={{ color: '#1E5AF2' }} />
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: 'var(--lp-text)' }}>
                    23 SKUs
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#10B981', marginTop: '2px', fontWeight: 500 }}>
                    7 Familias Taxonómicas
                  </div>
                </div>

                <div className="lp-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--lp-text-muted)', textTransform: 'uppercase' }}>
                      Valorización
                    </span>
                    <TrendingUp size={18} style={{ color: '#10B981' }} />
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: '#10B981' }}>
                    $16,917.50 USD
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--lp-text-muted)', marginTop: '2px' }}>
                    Costo promedio ponderado
                  </div>
                </div>

                <div className="lp-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--lp-text-muted)', textTransform: 'uppercase' }}>
                      Semáforo Crítico
                    </span>
                    <AlertTriangle size={18} style={{ color: '#F59E0B' }} />
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: '#F59E0B' }}>
                    1 Agotado • 6 Mínimos
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '2px', fontWeight: 500 }}>
                    Atención prioritaria de compra
                  </div>
                </div>

                <div className="lp-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--lp-text-muted)', textTransform: 'uppercase' }}>
                      Asistencia IA
                    </span>
                    <Bot size={18} style={{ color: '#8B5CF6' }} />
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: 'var(--lp-text)' }}>
                    Activo • 1h
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#8B5CF6', marginTop: '2px', fontWeight: 500 }}>
                    Google Gemini + n8n
                  </div>
                </div>
              </div>

              {/* Realistic Inventory Table Preview */}
              <div
                style={{
                  borderRadius: '10px',
                  border: '1px solid var(--lp-border)',
                  overflowX: 'auto',
                  backgroundColor: 'var(--lp-surface-alt)'
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--lp-border)', textAlign: 'left', color: 'var(--lp-text-muted)' }}>
                      <th style={{ padding: '10px 14px' }}>SKU Taxonómico</th>
                      <th style={{ padding: '10px 14px' }}>Producto</th>
                      <th style={{ padding: '10px 14px' }}>Familia</th>
                      <th style={{ padding: '10px 14px' }}>Existencia</th>
                      <th style={{ padding: '10px 14px' }}>Mínimo</th>
                      <th style={{ padding: '10px 14px' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--lp-border)' }}>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#1E5AF2' }}>
                        TEC-LAP-HP-001
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>Laptop HP ProBook 450 G9 15.6"</td>
                      <td style={{ padding: '10px 14px' }}><span className="badge badge-primary">TEC</span></td>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>12 u.</td>
                      <td style={{ padding: '10px 14px', color: 'var(--lp-text-muted)' }}>5 u.</td>
                      <td style={{ padding: '10px 14px' }}><span className="badge badge-success">🟢 Disponible</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--lp-border)' }}>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#F59E0B' }}>
                        FER-STA-TAPE8
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>Cinta Métrica Profesional 8m / 26ft</td>
                      <td style={{ padding: '10px 14px' }}><span className="badge badge-warning">FER</span></td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#EF4444' }}>0 u.</td>
                      <td style={{ padding: '10px 14px', color: 'var(--lp-text-muted)' }}>10 u.</td>
                      <td style={{ padding: '10px 14px' }}><span className="badge badge-danger">🔴 Agotado</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--lp-border)' }}>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#EF4444' }}>
                        FAR-GEL-1L
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>Alcohol en Gel Antibacterial 1L con Dosificador</td>
                      <td style={{ padding: '10px 14px' }}><span className="badge badge-info">FAR</span></td>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>22 u.</td>
                      <td style={{ padding: '10px 14px', color: 'var(--lp-text-muted)' }}>8 u.</td>
                      <td style={{ padding: '10px 14px' }}><span className="badge badge-success">🟢 Disponible</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Floating AI Notification Toast in Mockup */}
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: isDark ? 'linear-gradient(135deg, rgba(10, 46, 91, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)' : '#EBF3FC',
                  border: '1px solid rgba(30, 90, 242, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Sparkles size={16} />
                </div>
                <div style={{ flex: 1, fontSize: '12.5px', lineHeight: 1.4 }}>
                  <strong style={{ color: isDark ? '#FFFFFF' : '#0A2E5B' }}>Sugerencia StockPilot IA:</strong>{' '}
                  <span style={{ color: isDark ? '#CBD5E1' : '#334155' }}>
                    Se detectó un quiebre en Ferretería y 6 productos bajo umbral. ¿Deseas redactar la orden de compra ahora?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  style={{
                    padding: '5px 12px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    backgroundColor: '#1E5AF2',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Ver Asistente
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CINTA PUBLICITARIA CONTINUA CON MOVIMIENTO (MARQUEE INFINITO) */}
      <div className="lp-marquee-container" aria-label="Beneficios destacados de StockPilot">
        <div className="lp-marquee-track">
          {tickerItems.concat(tickerItems).map((item, idx) => (
            <div
              key={idx}
              className={`lp-marquee-item ${item.highlight ? 'lp-marquee-item-highlight' : ''}`}
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Métricas / Indicadores de Confianza */}
      <section
        style={{
          borderTop: '1px solid var(--lp-border)',
          borderBottom: '1px solid var(--lp-border)',
          backgroundColor: 'var(--lp-surface-alt)',
          padding: '40px 24px'
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--lp-primary)', lineHeight: 1 }}>+99.8%</div>
            <div style={{ fontSize: '13.5px', fontWeight: 600, marginTop: '6px' }}>Precisión de Inventario</div>
            <div style={{ fontSize: '12px', color: 'var(--lp-text-muted)', marginTop: '2px' }}>Trazabilidad exacta en entradas y salidas</div>
          </div>

          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#10B981', lineHeight: 1 }}>7 Familias</div>
            <div style={{ fontSize: '13.5px', fontWeight: 600, marginTop: '6px' }}>Normativa SAC / HS</div>
            <div style={{ fontSize: '12px', color: 'var(--lp-text-muted)', marginTop: '2px' }}>Estandarización arancelaria global</div>
          </div>

          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#8B5CF6', lineHeight: 1 }}>1 Hora</div>
            <div style={{ fontSize: '13.5px', fontWeight: 600, marginTop: '6px' }}>Memoria Contextual IA</div>
            <div style={{ fontSize: '12px', color: 'var(--lp-text-muted)', marginTop: '2px' }}>Agente Gemini conectado a tu catálogo</div>
          </div>

          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#F59E0B', lineHeight: 1 }}>1 Clic</div>
            <div style={{ fontSize: '13.5px', fontWeight: 600, marginTop: '6px' }}>Reporte Ejecutivo PDF</div>
            <div style={{ fontSize: '12px', color: 'var(--lp-text-muted)', marginTop: '2px' }}>Auditoría oficial lista para gerencia</div>
          </div>
        </div>
      </section>

      {/* BANNER PUBLICITARIO PREMIUM CON MOVIMIENTO & ANIMACIÓN */}
      <section className="lp-ad-banner-section" aria-label="Promoción y Publicidad StockPilot">
        <div className="lp-ad-banner-card">
          <div className="lp-ad-shimmer-bg" aria-hidden="true" />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="lp-ad-badge-pulse">
              <span className="lp-ad-beacon" aria-hidden="true" />
              <span>Oferta de Implementación • Acceso Inmediato</span>
            </div>

            <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 32px)', fontWeight: 800, lineHeight: 1.25, marginBottom: '14px', color: 'var(--lp-text)' }}>
              Acelera la Productividad de tu Empresa con <span className="lp-gradient-text">StockPilot Pro</span>
            </h2>

            <p style={{ fontSize: '15px', color: 'var(--lp-text-muted)', lineHeight: 1.6, marginBottom: '22px', maxWidth: '580px' }}>
              Descubre por qué las empresas líderes centralizan su gestión en StockPilot. Digitaliza tus almacenes, anticípate a los quiebres de existencias con IA y genera auditorías ejecutivas en segundos sin costos ocultos de instalación.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              <button
                type="button"
                className="lp-ad-cta-btn"
                onClick={() => navigate('/login')}
              >
                <span>Comenzar Prueba Gratuita</span>
                <ArrowRight size={17} />
              </button>

              <span style={{ fontSize: '12.5px', color: 'var(--lp-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#10B981" />
                Sin tarjeta requerida • Acceso libre a roles de prueba
              </span>
            </div>
          </div>

          {/* Tarjeta interactiva lateral del banner */}
          <div className="lp-ad-metric-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--lp-border)', paddingBottom: '10px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10B981', fontWeight: 700 }}>
                ⚡ Alta Disponibilidad
              </span>
              <span style={{ fontSize: '11px', color: 'var(--lp-text-muted)' }}>
                StockPilot Cloud
              </span>
            </div>

            <div className="lp-ad-benefit-item">
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(30, 90, 242, 0.12)', color: '#1E5AF2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={16} />
              </div>
              <span>Despliegue operativo en menos de 5 minutos</span>
            </div>

            <div className="lp-ad-benefit-item">
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
              <span>Agente IA con retención contextual activa</span>
            </div>

            <div className="lp-ad-benefit-item">
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={16} />
              </div>
              <span>Kardex auditado bajo estándar internacional</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Problema vs Solución */}
      <section
        id="proposito"
        style={{
          padding: '80px 24px',
          maxWidth: '1120px',
          margin: '0 auto'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <span style={{ color: 'var(--lp-primary)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Transformación Operativa
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em' }}>
            El Desafío del Inventario y la Solución StockPilot
          </h2>
          <p style={{ color: 'var(--lp-text-muted)', fontSize: '16px', lineHeight: 1.6, marginTop: '12px' }}>
            Las empresas pierden hasta un 18% anual por quiebres imprevistos y descontrol de existencias. StockPilot transforma la incertidumbre en ventaja competitiva.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {/* Problema */}
          <div
            style={{
              padding: '32px',
              borderRadius: '16px',
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.05)' : '#FEF2F2',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', fontWeight: 700, fontSize: '16px', marginBottom: '18px' }}>
              <AlertTriangle size={20} />
              <span>La Gestión Tradicional y Caótica</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', lineHeight: 1.5 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>✕</span>
                <span>Hojas de cálculo desincronizadas con datos obsoletos y descuadres físicos.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>✕</span>
                <span>Códigos SKU inventados sin jerarquía que duplican referencias en bodega.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>✕</span>
                <span>Desabastecimientos sorpresa que detienen ventas y frustran a los clientes.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>✕</span>
                <span>Horas de trabajo manual para armar reportes que nacen desactualizados.</span>
              </li>
            </ul>
          </div>

          {/* Solución */}
          <div
            style={{
              padding: '32px',
              borderRadius: '16px',
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.05)' : '#ECFDF5',
              border: '1px solid rgba(16, 185, 129, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10B981', fontWeight: 700, fontSize: '16px', marginBottom: '18px' }}>
              <ShieldCheck size={20} />
              <span>La Experiencia con StockPilot</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', lineHeight: 1.5 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
                <span>Base unificada en tiempo real con recálculo automático de saldos y costos.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
                <span>Codificación taxonómica formal estandarizada por familias arancelarias.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
                <span>Semáforo dinámico de alertas que avisa antes de que ocurra el quiebre.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
                <span>Copiloto de IA conversacional que responde diagnósticos en segundos.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Características Principales (Core Modules) */}
      <section
        id="caracteristicas"
        style={{
          padding: '80px 24px',
          backgroundColor: 'var(--lp-surface-alt)',
          borderTop: '1px solid var(--lp-border)'
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span style={{ color: '#10B981', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Capacidades Centrales
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em' }}>
              Módulos Diseñados para la Operación Diaria
            </h2>
            <p style={{ color: 'var(--lp-text-muted)', fontSize: '16px', lineHeight: 1.6, marginTop: '12px' }}>
              Cada módulo resuelve un área clave de la cadena de suministro con interfaces ágiles, sin curvas de aprendizaje complejas.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px'
            }}
          >
            {/* Feature 1 */}
            <div className="lp-card">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(30, 90, 242, 0.12)', color: '#1E5AF2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Package size={22} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 8px 0' }}>Catálogo & Ficha Técnica</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--lp-text-muted)', lineHeight: 1.55, margin: 0 }}>
                Control total de precios de compra, venta, márgenes comerciales, imágenes, marcas y umbrales de seguridad mínimos por referencia.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="lp-card">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Layers size={22} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 8px 0' }}>Taxonomía de SKUs & Códigos</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--lp-text-muted)', lineHeight: 1.55, margin: 0 }}>
                Generación automática de códigos de 4 bloques jerárquicos y código de barras con validación de checksum oficial.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="lp-card">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ArrowLeftRight size={22} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 8px 0' }}>Kardex y Trazabilidad</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--lp-text-muted)', lineHeight: 1.55, margin: 0 }}>
                Bitácora de movimientos inmutables con registro de tipo (Entrada, Salida, Ajuste), fecha, motivo y usuario auditor responsable.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="lp-card">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Truck size={22} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 8px 0' }}>Gestión de Proveedores</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--lp-text-muted)', lineHeight: 1.55, margin: 0 }}>
                Directorio unificado con información fiscal, condiciones comerciales, tiempos de entrega y catálogo de artículos suministrados.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="lp-card">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(236, 72, 153, 0.12)', color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <FileText size={22} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 8px 0' }}>Reportes Ejecutivos PDF</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--lp-text-muted)', lineHeight: 1.55, margin: 0 }}>
                Generación de documentos PDF oficiales con estado de valorización, balances temporales de entradas y salidas, listos para auditorías.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="lp-card">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(6, 182, 212, 0.12)', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 8px 0' }}>Gobernanza & Roles (RBAC)</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--lp-text-muted)', lineHeight: 1.55, margin: 0 }}>
                Permisos granulares estrictos: Administrador (auditoría y usuarios), Gerente (gestión y compras) y Operador (movimientos y conteos).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. StockPilot Intelligence (AI Spotlight Section) */}
      <section
        id="inteligencia"
        style={{
          padding: '80px 24px',
          background: isDark
            ? 'linear-gradient(180deg, #070D17 0%, #0A1E3B 50%, #070D17 100%)'
            : 'linear-gradient(180deg, #F1F5F9 0%, #EBF3FC 50%, #F1F5F9 100%)',
          borderTop: '1px solid var(--lp-border)',
          borderBottom: '1px solid var(--lp-border)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center'
            }}
          >
            {/* Left AI Information */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '16px'
                }}
              >
                <Sparkles size={14} /> StockPilot Intelligence Engine
              </div>

              <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, lineHeight: 1.2, margin: '0 0 16px 0' }}>
                Tu copiloto logístico con memoria de 1 hora y análisis en tiempo real
              </h2>

              <p style={{ color: 'var(--lp-text-muted)', fontSize: '15.5px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                Conectado directamente a tu base de datos de inventario a través de un webhook de <strong>n8n</strong> y el modelo <strong>Google Gemini 1.5 Flash</strong>. Responde preguntas complejas de negocio en lenguaje natural.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                  <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
                  <span>Detección taxonómica por categorías (ej. Farmacia, Tecnología, Ferretería).</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                  <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
                  <span>Memoria conversacional continua durante 60 minutos de sesión activa.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                  <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
                  <span>Generación automática de sugerencias y órdenes preventivas de compra.</span>
                </div>
              </div>

              <Link to="/login" className="lp-btn-primary" style={{ display: 'inline-flex' }}>
                <Bot size={17} />
                <span>Interactuar con el Asistente en Demo</span>
              </Link>
            </div>

            {/* Right Interactive AI Simulator Box */}
            <div
              className="lp-card"
              style={{
                padding: '24px',
                borderRadius: '16px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              {/* Simulator Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '14px',
                  borderBottom: '1px solid var(--lp-border)',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>StockPilot IA</div>
                    <div style={{ fontSize: '11px', color: '#10B981' }}>En línea • Gemini 1.5 Flash</div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(30, 90, 242, 0.1)',
                    color: 'var(--lp-primary)',
                    fontWeight: 700
                  }}
                >
                  n8n Webhook
                </span>
              </div>

              {/* Interactive Preset Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {aiDemoConversations.map((demo, idx) => (
                  <button
                    key={demo.tag}
                    type="button"
                    onClick={() => setActiveAiDemo(idx)}
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '14px',
                      border: '1px solid',
                      borderColor: activeAiDemo === idx ? '#10B981' : 'var(--lp-border)',
                      backgroundColor: activeAiDemo === idx ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                      color: activeAiDemo === idx ? '#10B981' : 'var(--lp-text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {demo.tag}
                  </button>
                ))}
              </div>

              {/* Chat Messages */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div
                  style={{
                    alignSelf: 'flex-end',
                    backgroundColor: 'var(--lp-primary)',
                    color: '#FFFFFF',
                    padding: '10px 14px',
                    borderRadius: '12px 12px 2px 12px',
                    maxWidth: '85%',
                    lineHeight: 1.45
                  }}
                >
                  {aiDemoConversations[activeAiDemo].q}
                </div>

                <div
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'var(--lp-surface-alt)',
                    color: 'var(--lp-text)',
                    padding: '12px 16px',
                    borderRadius: '12px 12px 12px 2px',
                    maxWidth: '95%',
                    lineHeight: 1.55,
                    border: '1px solid var(--lp-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 700, fontSize: '11px', marginBottom: '4px' }}>
                    <CheckCircle2 size={13} />
                    <span>DIAGNÓSTICO EN TIEMPO REAL</span>
                  </div>
                  {aiDemoConversations[activeAiDemo].a}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Sectores y Tipos de Negocio */}
      <section
        id="sectores"
        style={{
          padding: '80px 24px',
          maxWidth: '1120px',
          margin: '0 auto'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <span style={{ color: 'var(--lp-primary)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Taxonomía Universal
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em' }}>
            Adaptado a 7 Sectores Empresariales Clave
          </h2>
          <p style={{ color: 'var(--lp-text-muted)', fontSize: '16px', lineHeight: 1.6, marginTop: '12px' }}>
            StockPilot no es genérico: cuenta con taxonomía especializada y códigos arancelarios precargados para los principales rubros económicos.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px'
          }}
        >
          {/* TEC */}
          <div className="lp-sector-card" style={{ '--sector-color': '#1E5AF2' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(30, 90, 242, 0.12)', color: '#1E5AF2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Laptop size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14.5px' }}>Tecnología & Cómputo</div>
              <div style={{ fontSize: '11.5px', color: 'var(--lp-text-muted)', fontFamily: 'monospace' }}>[TEC] • SAC HS 8471</div>
            </div>
          </div>

          {/* FER */}
          <div className="lp-sector-card" style={{ '--sector-color': '#F59E0B' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hammer size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14.5px' }}>Ferretería & Construcción</div>
              <div style={{ fontSize: '11.5px', color: 'var(--lp-text-muted)', fontFamily: 'monospace' }}>[FER] • SAC HS 8205</div>
            </div>
          </div>

          {/* ALI */}
          <div className="lp-sector-card" style={{ '--sector-color': '#10B981' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Coffee size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14.5px' }}>Alimentos & Bebidas</div>
              <div style={{ fontSize: '11.5px', color: 'var(--lp-text-muted)', fontFamily: 'monospace' }}>[ALI] • SAC HS 2101</div>
            </div>
          </div>

          {/* FAR */}
          <div className="lp-sector-card" style={{ '--sector-color': '#EF4444' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeartPulse size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14.5px' }}>Farmacia & Salud</div>
              <div style={{ fontSize: '11.5px', color: 'var(--lp-text-muted)', fontFamily: 'monospace' }}>[FAR] • SAC HS 3004</div>
            </div>
          </div>

          {/* OFI */}
          <div className="lp-sector-card" style={{ '--sector-color': '#8B5CF6' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14.5px' }}>Oficina & Papelería</div>
              <div style={{ fontSize: '11.5px', color: 'var(--lp-text-muted)', fontFamily: 'monospace' }}>[OFI] • SAC HS 4820</div>
            </div>
          </div>

          {/* TEX */}
          <div className="lp-sector-card" style={{ '--sector-color': '#6366F1' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shirt size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14.5px' }}>Textil & Uniformes</div>
              <div style={{ fontSize: '11.5px', color: 'var(--lp-text-muted)', fontFamily: 'monospace' }}>[TEX] • SAC HS 6203</div>
            </div>
          </div>

          {/* AUT */}
          <div className="lp-sector-card" style={{ '--sector-color': '#06B6D4' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(6, 182, 212, 0.12)', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14.5px' }}>Repuestos Automotrices</div>
              <div style={{ fontSize: '11.5px', color: 'var(--lp-text-muted)', fontFamily: 'monospace' }}>[AUT] • SAC HS 8708</div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Beneficios de Operación (Why Us) */}
      <section
        id="beneficios"
        style={{
          padding: '80px 24px',
          backgroundColor: 'var(--lp-surface-alt)',
          borderTop: '1px solid var(--lp-border)'
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span style={{ color: '#10B981', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Impacto Medible
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em' }}>
              Resultados Tangibles para tu Negocio
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}
          >
            <div className="lp-card">
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--lp-primary)', marginBottom: '8px' }}>-85%</div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0' }}>Tiempo en Auditorías Físicas</h4>
              <p style={{ fontSize: '13px', color: 'var(--lp-text-muted)', lineHeight: 1.55, margin: 0 }}>
                El Kardex automatizado registra cada movimiento al instante, reduciendo drásticamente las horas invertidas en cierres de mes.
              </p>
            </div>

            <div className="lp-card">
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#10B981', marginBottom: '8px' }}>0%</div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0' }}>Quiebres de Stock Imprevistos</h4>
              <p style={{ fontSize: '13px', color: 'var(--lp-text-muted)', lineHeight: 1.55, margin: 0 }}>
                Las alertas tempranas por SKU garantizan que nunca te quedes sin tus productos de mayor rotación y margen comercial.
              </p>
            </div>

            <div className="lp-card">
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#F59E0B', marginBottom: '8px' }}>100%</div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0' }}>Trazabilidad Operativa</h4>
              <p style={{ fontSize: '13px', color: 'var(--lp-text-muted)', lineHeight: 1.55, margin: 0 }}>
                Saber con certeza quién recibió la mercancía, quién autorizó una salida y cuándo se efectuó cada ajuste de almacén.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Call to Action (CTA Final) */}
      <section
        style={{
          padding: '90px 24px',
          background: isDark
            ? 'linear-gradient(135deg, #0A2E5B 0%, #0F172A 100%)'
            : 'linear-gradient(135deg, #EBF3FC 0%, #F8FAFC 100%)',
          borderTop: '1px solid var(--lp-border)',
          position: 'relative'
        }}
      >
        <div
          style={{
            maxWidth: '940px',
            margin: '0 auto',
            textAlign: 'center',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : '#FFFFFF',
            border: '1px solid var(--lp-border)',
            borderRadius: '24px',
            padding: '48px 32px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(30, 90, 242, 0.2)'
          }}
        >
          <div style={{ display: 'inline-flex', marginBottom: '16px' }}>
            <LogoIsotype size={48} variant={isDark ? 'dark' : 'light'} />
          </div>

          <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 16px 0' }}>
            Tu inventario puede hacer mucho más.
          </h2>

          <p style={{ color: 'var(--lp-text-muted)', fontSize: '16.5px', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto 32px' }}>
            Accede al sistema con tus credenciales corporativas o experimenta la plataforma con las cuentas demo de evaluación académica.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '36px' }}>
            <Link
              to="/login"
              className="lp-btn-primary"
              style={{
                fontSize: '16px',
                padding: '16px 36px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.45)'
              }}
            >
              <LogIn size={18} />
              <span>{isAuthenticated ? 'Ingresar a mi Dashboard' : 'Iniciar Sesión en StockPilot'}</span>
            </Link>
          </div>

          {/* Quick Copy Demo Credentials */}
          <div
            style={{
              padding: '18px 20px',
              backgroundColor: 'var(--lp-surface-alt)',
              borderRadius: '12px',
              border: '1px solid var(--lp-border)',
              display: 'inline-flex',
              flexDirection: 'column',
              gap: '10px',
              maxWidth: '680px',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--lp-text)' }}>
                🔑 Cuentas Demo para Evaluación Académica:
              </span>
              <span style={{ fontSize: '11px', color: 'var(--lp-text-muted)' }}>Haz clic para copiar</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              <button
                type="button"
                onClick={() => copyCredentials('admin@stockpilot.com', 'Admin123!', 'admin')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--lp-border)',
                  backgroundColor: 'var(--lp-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  color: 'var(--lp-text)',
                  fontSize: '11.5px'
                }}
              >
                <span><strong>Admin:</strong> admin@...</span>
                {copiedRole === 'admin' ? <Check size={14} style={{ color: '#10B981' }} /> : <Copy size={14} style={{ color: 'var(--lp-text-muted)' }} />}
              </button>

              <button
                type="button"
                onClick={() => copyCredentials('manager@stockpilot.com', 'Manager123!', 'manager')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--lp-border)',
                  backgroundColor: 'var(--lp-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  color: 'var(--lp-text)',
                  fontSize: '11.5px'
                }}
              >
                <span><strong>Gerente:</strong> manager@...</span>
                {copiedRole === 'manager' ? <Check size={14} style={{ color: '#10B981' }} /> : <Copy size={14} style={{ color: 'var(--lp-text-muted)' }} />}
              </button>

              <button
                type="button"
                onClick={() => copyCredentials('employee@stockpilot.com', 'Employee123!', 'employee')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--lp-border)',
                  backgroundColor: 'var(--lp-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  color: 'var(--lp-text)',
                  fontSize: '11.5px'
                }}
              >
                <span><strong>Operador:</strong> employee@...</span>
                {copiedRole === 'employee' ? <Check size={14} style={{ color: '#10B981' }} /> : <Copy size={14} style={{ color: 'var(--lp-text-muted)' }} />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer
        style={{
          backgroundColor: isDark ? '#070D17' : '#0A1E3B',
          color: '#94A3B8',
          padding: '48px 24px 32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '13px'
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '24px'
            }}
          >
            <div style={{ maxWidth: '380px' }}>
              <LogoFull variant="dark" size={32} />
              <p style={{ marginTop: '12px', fontSize: '13px', lineHeight: 1.5, color: '#64748B' }}>
                StockPilot es la suite empresarial para el control logístico, codificación taxonómica SAC/HS, kardex de movimientos y asistencia predictiva impulsada por IA.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>Navegación</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><a href="#proposito" style={{ color: '#94A3B8', textDecoration: 'none' }}>Propósito</a></li>
                  <li><a href="#caracteristicas" style={{ color: '#94A3B8', textDecoration: 'none' }}>Plataforma</a></li>
                  <li><a href="#inteligencia" style={{ color: '#94A3B8', textDecoration: 'none' }}>Copiloto IA</a></li>
                  <li><a href="#sectores" style={{ color: '#94A3B8', textDecoration: 'none' }}>Sectores</a></li>
                </ul>
              </div>

              <div>
                <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>Acceso al Sistema</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><Link to="/login" style={{ color: '#94A3B8', textDecoration: 'none' }}>Iniciar Sesión</Link></li>
                  <li><Link to="/register" style={{ color: '#94A3B8', textDecoration: 'none' }}>Registrar Empresa</Link></li>
                  <li><Link to="/dashboard" style={{ color: '#38BDF8', textDecoration: 'none' }}>Panel Dashboard</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              color: '#64748B'
            }}
          >
            <span>© {new Date().getFullYear()} StockPilot Inc. FWD Academy Project • Todos los derechos reservados.</span>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>React 18 + Vite</span>
              <span>•</span>
              <span>n8n + Gemini Flash</span>
              <span>•</span>
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: 600 }}
              >
                Volver arriba ↑
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
