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
          backgroundColor: '#0A2E5B',
          background: 'linear-gradient(135deg, #0A2E5B 0%, #0B4D9B 100%)',
          color: '#FFFFFF',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.12)',
            pointerEvents: 'none'
          }}
        />

        <div>
          <LogoFull variant="dark" size={40} />
          <div style={{ marginTop: '60px', maxWidth: '480px' }}>
            <h1 style={{ color: '#FFFFFF', fontSize: '36px', lineHeight: 1.2, fontWeight: 800 }}>
              Gestión inteligente de inventarios para empresas ágiles.
            </h1>
            <p style={{ marginTop: '16px', color: '#94A3B8', fontSize: '16px', lineHeight: 1.6 }}>
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
