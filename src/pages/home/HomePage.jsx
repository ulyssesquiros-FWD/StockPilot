import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoFull from '../../assets/brand/LogoFull';
import LogoIsotype from '../../assets/brand/LogoIsotype';
import Button from '../../components/ui/Button';
import {
  Sparkles,
  ArrowRight,
  Package,
  Layers,
  Activity,
  ShieldCheck,
  FileText,
  Bot,
  Truck,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  Cpu,
  LogIn,
  LayoutDashboard,
  ExternalLink,
  Zap,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  return (
    <div
      className="stockpilot-landing"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-main)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 1. Header / Navigation Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px 24px'
        }}
      >
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
          {/* Brand Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <LogoFull variant="dark" size={36} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
              fontSize: '14px',
              fontWeight: 500
            }}
            className="landing-nav-links"
          >
            <a
              href="#proposito"
              style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.target.style.color = '#94A3B8')}
            >
              Propósito
            </a>
            <a
              href="#funcionamiento"
              style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.target.style.color = '#94A3B8')}
            >
              Funcionamiento
            </a>
            <a
              href="#modulos"
              style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.target.style.color = '#94A3B8')}
            >
              Módulos
            </a>
            <a
              href="#asistente-ia"
              style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.target.style.color = '#94A3B8')}
            >
              Copiloto IA
            </a>
            <a
              href="#arquitectura"
              style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.target.style.color = '#94A3B8')}
            >
              Arquitectura
            </a>
          </nav>

          {/* User Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                icon={<LayoutDashboard size={16} />}
                onClick={() => navigate('/dashboard')}
                style={{
                  backgroundColor: '#10B981',
                  borderColor: '#10B981',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                }}
              >
                Ir a mi Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  style={{ color: '#E2E8F0', fontWeight: 500 }}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<LogIn size={15} />}
                  onClick={() => navigate('/login')}
                  style={{
                    backgroundColor: '#1E5AF2',
                    borderColor: '#1E5AF2',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(30, 90, 242, 0.35)'
                  }}
                >
                  Acceder al Sistema
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '80px 24px 70px',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(30, 90, 242, 0.25), transparent)'
        }}
      >
        <div style={{ maxWidth: '1180px', margin: '0 auto', textAlign: 'center' }}>
          {/* Project Release Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '24px',
              backgroundColor: 'rgba(30, 90, 242, 0.12)',
              border: '1px solid rgba(30, 90, 242, 0.3)',
              color: '#60A5FA',
              fontSize: '12.5px',
              fontWeight: 600,
              marginBottom: '24px',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Sparkles size={14} style={{ color: '#10B981' }} />
            <span>StockPilot v4.0 • Plataforma Empresarial con Copiloto IA (n8n + Gemini)</span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              maxWidth: '920px',
              margin: '0 auto 20px',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Control total de inventarios, trazabilidad exacta y asistencia predictiva.
          </h1>

          {/* Subtitle / Value Proposition */}
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              lineHeight: 1.6,
              color: '#94A3B8',
              maxWidth: '760px',
              margin: '0 auto 36px',
              fontWeight: 400
            }}
          >
            Optimiza niveles de existencias, automatiza la codificación taxonómica de SKUs, detecta anomalías antes de que ocurran y toma decisiones fundamentadas con un agente de IA en tiempo real.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '56px'
            }}
          >
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: '#1E5AF2',
                borderColor: '#1E5AF2',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 600,
                padding: '14px 28px',
                borderRadius: '8px',
                boxShadow: '0 8px 24px -4px rgba(30, 90, 242, 0.5)'
              }}
            >
              {isAuthenticated ? 'Ingresar a mi Tablero' : 'Iniciar Sesión en StockPilot'}
            </Button>

            <a
              href="#funcionamiento"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 24px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#E2E8F0',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background-color 0.2s, border-color 0.2s'
              }}
            >
              Conocer Cómo Funciona
            </a>
          </div>

          {/* Trust Highlights */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '28px',
              flexWrap: 'wrap',
              color: '#94A3B8',
              fontSize: '13px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} style={{ color: '#10B981' }} />
              <span>Taxonomía Oficial SAC / HS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bot size={16} style={{ color: '#38BDF8' }} />
              <span>Memoria IA de 1 Hora</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} style={{ color: '#F59E0B' }} />
              <span>Reportes Ejecutivos en PDF</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} style={{ color: '#A78BFA' }} />
              <span>Kardex y Trazabilidad al Segundo</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive System Preview Showcase */}
      <section style={{ padding: '0 24px 60px' }}>
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            backgroundColor: '#0F172A',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(30, 90, 242, 0.2)',
            overflow: 'hidden'
          }}
        >
          {/* Mockup Window Chrome */}
          <div
            style={{
              backgroundColor: '#0A1E3B',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span style={{ fontSize: '12px', color: '#94A3B8', marginLeft: '12px', fontFamily: 'monospace' }}>
                https://stockpilot.app/dashboard
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#34D399',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                padding: '2px 8px',
                borderRadius: '12px'
              }}
            >
              ● Sistema en Operación Normal
            </span>
          </div>

          {/* Mockup Body Content */}
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* KPI preview grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '14px'
              }}
            >
              <div style={{ padding: '16px', backgroundColor: '#1E293B', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Total SKUs Activos</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>23 Artículos</div>
                <div style={{ fontSize: '11px', color: '#10B981', marginTop: '2px' }}>7 Familias Taxonómicas</div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#1E293B', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Valorización Inventario</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#60A5FA', marginTop: '4px' }}>$16,917.50 USD</div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>Costo de adquisición ponderado</div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#1E293B', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Semáforo Crítico</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#F59E0B', marginTop: '4px' }}>1 Agotado • 6 Mínimos</div>
                <div style={{ fontSize: '11px', color: '#F87171', marginTop: '2px' }}>Alertas generadas automáticamente</div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#1E293B', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Precisión Operativa</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981', marginTop: '4px' }}>99.8%</div>
                <div style={{ fontSize: '11px', color: '#34D399', marginTop: '2px' }}>Trazabilidad de entradas y salidas</div>
              </div>
            </div>

            {/* AI Copilot live demonstration block */}
            <div
              style={{
                backgroundColor: 'rgba(10, 46, 91, 0.45)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)'
                }}
              >
                <Sparkles size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>StockPilot IA — Inferencia en Tiempo Real</span>
                  <span style={{ fontSize: '11px', color: '#38BDF8', fontFamily: 'monospace' }}>Gemini Agent + n8n Webhook</span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#CBD5E1', lineHeight: 1.55 }}>
                  "He diagnosticado el inventario completo: la categoría <strong>Farmacia y Salud (FAR)</strong> cuenta con 2 artículos en estado óptimo. Sin embargo, en <strong>Ferretería (FER)</strong> la <em>Cinta Métrica Profesional 8m</em> se encuentra agotada (0 u.) y 6 productos de tecnología y alimentos alcanzaron su punto de reorden. ¿Deseas redactar la orden de compra preventiva?"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Propósito del Proyecto (Misión & Por qué existe) */}
      <section
        id="proposito"
        style={{
          padding: '80px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          backgroundColor: 'rgba(15, 23, 42, 0.4)'
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px' }}>
            <span style={{ color: '#38BDF8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Misión & Visión Logística
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              El Propósito Detrás de StockPilot
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '16px', lineHeight: 1.6, marginTop: '12px' }}>
              Nacido para resolver la brecha entre hojas de cálculo desactualizadas y sistemas ERP monolíticos inalcanzables para operaciones ágiles.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}
          >
            {/* Card 1 */}
            <div
              style={{
                backgroundColor: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Activity size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Cero Fricción y Prevención de Quiebres
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Las roturas de stock y los excesos inmovilizan capital de trabajo. StockPilot alerta oportunamente los niveles críticos para que las compras se anticipen a la demanda en lugar de reaccionar tarde.
              </p>
            </div>

            {/* Card 2 */}
            <div
              style={{
                backgroundColor: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(30, 90, 242, 0.12)',
                  color: '#1E5AF2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Gobernanza Taxonómica Estandarizada
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Alineado con el Sistema Arancelario Centroamericano (SAC) y el Código Armonizado (HS). Cada producto posee un SKU unívoco y estructurado que elimina la duplicidad y el caos en bodega.
              </p>
            </div>

            {/* Card 3 */}
            <div
              style={{
                backgroundColor: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Inteligencia Artificial Práctica
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                La IA no es un adorno: es un copiloto logístico que procesa el catálogo en milisegundos, retiene el contexto de la conversación por 1 hora y ayuda al supervisor a planificar abastecimientos estratégicos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Funcionamiento Integral (Paso a Paso en 4 Fases) */}
      <section
        id="funcionamiento"
        style={{
          padding: '80px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px' }}>
            <span style={{ color: '#10B981', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Flujo Operativo
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              ¿Cómo Funciona StockPilot?
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '16px', lineHeight: 1.6, marginTop: '12px' }}>
              Desde el ingreso de una nueva referencia hasta la toma de decisiones con inteligencia artificial en un circuito continuo.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px'
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                backgroundColor: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '24px',
                position: 'relative'
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'rgba(30, 90, 242, 0.4)',
                  lineHeight: 1,
                  marginBottom: '12px'
                }}
              >
                01
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                Catalogación & SKU
              </h4>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.55, margin: 0 }}>
                El operador registra el artículo asignándolo a una familia. El sistema genera de forma automática el SKU normalizado (ej. <code>TEC-LAP-HP-001</code>) y el código de barras.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                backgroundColor: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '24px',
                position: 'relative'
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'rgba(16, 185, 129, 0.4)',
                  lineHeight: 1,
                  marginBottom: '12px'
                }}
              >
                02
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                Control de Movimientos
              </h4>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.55, margin: 0 }}>
                Cada entrada de compras, salida por venta o ajuste de inventario queda registrada de forma inmutable con fecha, usuario responsable, motivo y cálculo de saldo resultante.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                backgroundColor: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '24px',
                position: 'relative'
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'rgba(245, 158, 11, 0.4)',
                  lineHeight: 1,
                  marginBottom: '12px'
                }}
              >
                03
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                Monitoreo & Semáforo
              </h4>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.55, margin: 0 }}>
                El motor analiza los umbrales de stock mínimo de seguridad. Cuando una existencia desciende al umbral crítico, se activan alertas automáticas en el panel y en la campana de avisos.
              </p>
            </div>

            {/* Step 4 */}
            <div
              style={{
                backgroundColor: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '24px',
                position: 'relative'
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'rgba(139, 92, 246, 0.4)',
                  lineHeight: 1,
                  marginBottom: '12px'
                }}
              >
                04
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                Copiloto Logístico IA
              </h4>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.55, margin: 0 }}>
                A través del agente conectado con n8n y Google Gemini, puedes consultar por texto cualquier categoría, rotación o recomendación de compras con memoria continua de 1 hora.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Módulos y Capacidades del Sistema */}
      <section
        id="modulos"
        style={{
          padding: '80px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          backgroundColor: 'rgba(15, 23, 42, 0.3)'
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px' }}>
            <span style={{ color: '#F59E0B', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Módulos Integrados
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Todo lo Necesario para la Gestión de Almacén
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '16px', lineHeight: 1.6, marginTop: '12px' }}>
              Diseñado con arquitectura modular que garantiza velocidad, orden y control estricto de accesos.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}
          >
            {/* Module 1 */}
            <div style={{ padding: '22px', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Package size={22} style={{ color: '#3B82F6', marginBottom: '12px' }} />
              <h4 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>Catálogo de Productos</h4>
              <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                Control detallado con precio de compra, venta, margen comercial, marcas, imágenes y stock de seguridad.
              </p>
            </div>

            {/* Module 2 */}
            <div style={{ padding: '22px', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Layers size={22} style={{ color: '#F59E0B', marginBottom: '12px' }} />
              <h4 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>Familias Taxonómicas</h4>
              <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                Clasificación por familias arancelarias con vista espaciosa de tabla y cuadrícula de tarjetas interactivas.
              </p>
            </div>

            {/* Module 3 */}
            <div style={{ padding: '22px', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Activity size={22} style={{ color: '#10B981', marginBottom: '12px' }} />
              <h4 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>Trazabilidad & Kardex</h4>
              <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                Bitácora exhaustiva de entradas, salidas y ajustes manuales para auditorías contables y operativas.
              </p>
            </div>

            {/* Module 4 */}
            <div style={{ padding: '22px', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Truck size={22} style={{ color: '#8B5CF6', marginBottom: '12px' }} />
              <h4 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>Gestión de Proveedores</h4>
              <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                Directorio unificado de suplidores con datos de contacto, condiciones comerciales y plazos de entrega.
              </p>
            </div>

            {/* Module 5 */}
            <div style={{ padding: '22px', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <FileText size={22} style={{ color: '#EC4899', marginBottom: '12px' }} />
              <h4 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>Reportes Ejecutivos PDF</h4>
              <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                Generación y descarga de documentos PDF oficiales con estado actual de inventario, valorización y balance temporal.
              </p>
            </div>

            {/* Module 6 */}
            <div style={{ padding: '22px', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <ShieldCheck size={22} style={{ color: '#06B6D4', marginBottom: '12px' }} />
              <h4 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>Seguridad RBAC</h4>
              <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                Permisos granulares por rol: Administrador (acceso total), Gerente (operación y reportes) y Operador (consultas y movimientos).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Asistente IA & n8n Highlight */}
      <section
        id="asistente-ia"
        style={{
          padding: '80px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'linear-gradient(180deg, rgba(10, 46, 91, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)'
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
            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '16px'
                }}
              >
                <Sparkles size={14} /> Inteligencia Artificial Integrada
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, margin: '0 0 16px 0' }}>
                Un copiloto logístico que conoce tu inventario al detalle
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                Olvídate de buscar en decenas de pestañas para responder preguntas operativas. Pregúntale a StockPilot IA como si fuera tu jefe de almacén:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '14px' }}>
                  <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
                  <span>"¿Qué productos de Farmacia y Salud tenemos en stock?"</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '14px' }}>
                  <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
                  <span>"¿Cuáles son los 5 artículos con menor rotación este mes?"</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '14px' }}>
                  <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
                  <span>"Genera la lista prioritaria de compras para la próxima semana"</span>
                </div>
              </div>

              <Button
                variant="outline"
                icon={<ArrowRight size={16} />}
                onClick={() => navigate('/login')}
                style={{ borderColor: '#38BDF8', color: '#38BDF8' }}
              >
                Probar Asistente IA en el Sistema
              </Button>
            </div>

            {/* Visual Chat Widget Illustration */}
            <div
              style={{
                backgroundColor: '#0F172A',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(16, 185, 129, 0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>StockPilot IA</div>
                    <div style={{ fontSize: '10.5px', color: '#38BDF8' }}>Memoria activa de 1 hora</div>
                  </div>
                </div>
                <span style={{ fontSize: '10px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 6px', borderRadius: '10px', fontWeight: 600 }}>
                  En línea
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ alignSelf: 'flex-end', backgroundColor: '#1E5AF2', color: '#FFFFFF', padding: '8px 14px', borderRadius: '12px 12px 2px 12px', maxWidth: '85%' }}>
                  dime la cantidad de productos asociados a farmacia y salud
                </div>

                <div style={{ alignSelf: 'flex-start', backgroundColor: '#1E293B', color: '#E2E8F0', padding: '12px 14px', borderRadius: '12px 12px 12px 2px', maxWidth: '95%', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontWeight: 600, color: '#34D399', marginBottom: '4px' }}>
                    ✅ Respuesta Directa:
                  </div>
                  En StockPilot hay <strong>EXACTAMENTE 2 productos</strong> asociados a la categoría <strong>Farmacia y Salud (FAR)</strong>:
                  <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: '12px', color: '#CBD5E1' }}>
                    <li><code>FAR-GEL-1L</code>: Alcohol en Gel 1L (Stock: 22 u.)</li>
                    <li><code>FAR-BOT-IND45</code>: Botiquín Industrial (Stock: 5 u.)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call to Action (CTA Final hacia Login) */}
      <section
        style={{
          padding: '80px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'linear-gradient(135deg, #0A2E5B 0%, #0F172A 100%)'
        }}
      >
        <div
          style={{
            maxWidth: '920px',
            margin: '0 auto',
            textAlign: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '20px',
            padding: '48px 32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(16, 185, 129, 0.15)'
          }}
        >
          <div style={{ display: 'inline-flex', marginBottom: '16px' }}>
            <LogoIsotype size={48} variant="dark" />
          </div>

          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', margin: '0 0 16px 0' }}>
            ¿Listo para tomar el control de tu inventario?
          </h2>

          <p style={{ color: '#94A3B8', fontSize: '16px', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto 32px' }}>
            Accede al sistema con tus credenciales de usuario o explora la demostración con roles preconfigurados de administrador, gerencia y bodega.
          </p>

          <Button
            variant="primary"
            size="lg"
            icon={<LogIn size={20} />}
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: '#10B981',
              borderColor: '#10B981',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 700,
              padding: '16px 36px',
              borderRadius: '10px',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.45)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            {isAuthenticated ? 'Ingresar a mi Dashboard' : 'Iniciar Sesión en StockPilot'}
          </Button>

          {/* Quick Demo Credentials Reminder */}
          <div
            style={{
              marginTop: '32px',
              padding: '14px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'inline-flex',
              flexDirection: 'column',
              gap: '4px',
              fontSize: '12px',
              color: '#94A3B8'
            }}
          >
            <span style={{ fontWeight: 600, color: '#E2E8F0' }}>Credenciales de Demostración:</span>
            <span>Admin: <code>admin@stockpilot.com</code> • Password: <code>Admin123!</code></span>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer
        style={{
          backgroundColor: '#070D17',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '40px 24px 30px',
          color: '#64748B',
          fontSize: '13px'
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LogoIsotype size={24} variant="dark" />
            <span>© {new Date().getFullYear()} StockPilot. Plataforma Integral de Control de Inventarios.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/login" style={{ color: '#94A3B8', textDecoration: 'none' }}>
              Iniciar Sesión
            </Link>
            <Link to="/register" style={{ color: '#94A3B8', textDecoration: 'none' }}>
              Registrarse
            </Link>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ color: '#38BDF8', textDecoration: 'none' }}
            >
              Volver arriba ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
