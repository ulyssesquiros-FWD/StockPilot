import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary', 'secondary', 'success', 'danger', 'outline', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  icon = null,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ariaLabel,
  ...props
}) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantClass = `btn-${variant}`;

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <span
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid currentColor',
              borderRightColor: 'transparent',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.7s linear infinite'
            }}
          />
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="btn-icon-wrapper">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="btn-icon-wrapper">{icon}</span>}
        </>
      )}
    </button>
  );
}
