import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoFull from '../assets/brand/LogoFull';
import Button from '../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-app)',
        padding: '24px',
        textAlign: 'center'
      }}
    >
      <div style={{ marginBottom: '32px' }}>
        <LogoFull size={44} showTagline={true} />
      </div>

      <div
        style={{
          fontSize: '96px',
          fontWeight: 900,
          lineHeight: 1,
          color: 'var(--color-primary-blue)',
          letterSpacing: '-0.04em',
          marginBottom: '8px'
        }}
      >
        404
      </div>

      <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>
        Página no encontrada
      </h1>

      <p
        className="text-secondary"
        style={{
          maxWidth: '460px',
          fontSize: '15px',
          lineHeight: 1.6,
          marginBottom: '32px'
        }}
      >
        Lo sentimos, la ruta a la que intentas acceder no existe en la plataforma StockPilot o ha sido reubicada.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="secondary"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate(-1)}
        >
          Regresar
        </Button>
        <Button
          variant="primary"
          icon={<Home size={16} />}
          onClick={() => navigate('/dashboard')}
        >
          Volver al Dashboard
        </Button>
      </div>
    </div>
  );
}
