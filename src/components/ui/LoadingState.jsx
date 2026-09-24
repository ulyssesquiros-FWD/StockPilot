import React from 'react';
import LogoIsotype from '../../assets/brand/LogoIsotype';

export default function LoadingState({
  message = 'Cargando datos...',
  rows = 4,
  type = 'spinner' // 'spinner' or 'skeleton'
}) {
  if (type === 'skeleton') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', padding: '16px 0' }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              height: '48px',
              width: '100%',
              borderRadius: 'var(--radius-md)'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        gap: '16px'
      }}
      role="status"
      aria-live="polite"
    >
      <div style={{ animation: 'bounce 1.5s infinite ease-in-out' }}>
        <LogoIsotype size={44} />
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
}
