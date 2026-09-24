import React from 'react';

export default function Card({
  title,
  subtitle,
  actions,
  children,
  className = '',
  style = {}
}) {
  return (
    <div className={`sp-card ${className}`} style={style}>
      {(title || actions) && (
        <div className="sp-card-header">
          <div>
            {title && <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{title}</h3>}
            {subtitle && <p className="text-secondary" style={{ marginTop: '2px' }}>{subtitle}</p>}
          </div>
          {actions && <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
