import React from 'react';

export default function Avatar({
  src,
  name = 'Usuario',
  size = 36,
  role = null,
  className = ''
}) {
  const initials = name
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={`avatar-wrapper ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: 'var(--color-primary-blue)',
        color: 'var(--color-white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: `${Math.max(12, size * 0.4)}px`,
        flexShrink: 0,
        border: '2px solid var(--border-color)',
        userSelect: 'none'
      }}
      title={`${name}${role ? ` (${role})` : ''}`}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
