import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Ha ocurrido un problema',
  message = 'No se pudo cargar la información solicitada desde el servidor.',
  onRetry = null,
  className = ''
}) {
  return (
    <div
      className={`sp-card error-state-box ${className}`}
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(239, 68, 68, 0.3)'
      }}
      role="alert"
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-danger-red-light)',
          color: 'var(--color-danger-red)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}
      >
        <AlertCircle size={28} />
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
        {title}
      </h3>
      <p className="text-secondary" style={{ maxWidth: '420px', marginBottom: onRetry ? '20px' : '0' }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="primary" icon={<RotateCcw size={16} />} onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
