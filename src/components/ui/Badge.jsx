import React from 'react';

export default function Badge({
  children,
  variant = 'neutral', // 'success', 'warning', 'danger', 'info', 'neutral'
  icon = null,
  className = ''
}) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
