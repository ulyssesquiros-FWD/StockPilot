import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import LogoFull from '../assets/brand/LogoFull';
import { CheckCircle2, TrendingUp, Zap } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: 'var(--bg-app)'
      }}
    >
      {/* Left / Top Branded Hero Panel (hidden on small mobile) */}
      <div
        className="auth-hero-panel"
        style={{
          flex: 1,
          backgroundColor: '#091122',
          background: 'linear-gradient(135deg, #0B152B 0%, #060913 100%)',
          color: '#FFFFFF',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Subtle decorative mesh gradient */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(15, 82, 186, 0.08) 50%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div>
          <LogoFull variant="dark" size={38} />
          <div style={{ marginTop: '56px', maxWidth: '480px' }}>
            <h1 className="font-heading" style={{ color: '#FFFFFF', fontSize: '34px', lineHeight: 1.2, fontWeight: 800, letterSpacing: '-0.03em' }}>
              Gestión inteligente de inventarios para empresas ágiles.
            </h1>
            <p style={{ marginTop: '16px', color: '#94A3B8', fontSize: '15px', lineHeight: 1.6 }}>
              Centraliza el control de existencias, automatiza alertas de stock mínimo, rastrea movimientos y obtén recomendaciones analíticas potenciadas por IA.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '40px', maxWidth: '440px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399' }}>
              <CheckCircle2 size={18} />
            </div>
            <span style={{ fontSize: '14px', color: '#E2E8F0' }}>Control multi-categoría: tecnología, retail, farmacia y más.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA' }}>
              <TrendingUp size={18} />
            </div>
            <span style={{ fontSize: '14px', color: '#E2E8F0' }}>Trazabilidad total en entradas, salidas y devoluciones.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24' }}>
              <Zap size={18} />
            </div>
            <span style={{ fontSize: '14px', color: '#E2E8F0' }}>Asistente StockPilot IA integrado con automatizaciones n8n.</span>
          </div>
        </div>

        <div style={{ paddingTop: '24px', fontSize: '13px', color: '#64748B' }}>
          © {new Date().getFullYear()} StockPilot Inc. FWD Academy Project.
        </div>
      </div>

      {/* Right Form Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 32px',
          margin: '0 auto'
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
