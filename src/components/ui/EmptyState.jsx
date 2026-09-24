import React from 'react';
import { PackageOpen } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No hay registros',
  message = 'No se encontraron elementos para mostrar.',
  icon = null,
  actionLabel = null,
  onAction = null,
  className = ''
}) {
  return (
    <div
      className={`sp-card empty-state-box ${className}`}
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-surface-alt)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          color: 'var(--text-muted)'
        }}
      >
        {icon || <PackageOpen size={32} />}
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
        {title}
      </h3>
      <p className="text-secondary" style={{ maxWidth: '420px', marginBottom: actionLabel ? '20px' : '0' }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
