import React from 'react';

export default function KpiCard({
  title,
  value,
  icon,
  trend,
  trendType = 'neutral', // 'positive', 'warning', 'danger', 'neutral'
  subtitle,
  variant = 'blue', // 'blue', 'green', 'yellow', 'red'
  className = ''
}) {
  const colorMap = {
    blue: { bg: 'var(--color-primary-blue-light)', fg: 'var(--color-primary-blue)' },
    green: { bg: 'var(--color-primary-green-light)', fg: 'var(--color-primary-green)' },
    yellow: { bg: 'var(--color-warning-yellow-light)', fg: 'var(--color-warning-yellow)' },
    red: { bg: 'var(--color-danger-red-light)', fg: 'var(--color-danger-red)' }
  };

  const currentVariant = colorMap[variant] || colorMap.blue;

  return (
    <div className={`sp-card kpi-card ${className}`} style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="text-secondary" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </span>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              lineHeight: 1.2,
              marginTop: '6px',
              color: 'var(--text-main)'
            }}
          >
            {value}
          </div>
        </div>
        {icon && (
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: currentVariant.bg,
              color: currentVariant.fg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '13px' }}>
          {trend && (
            <span
              style={{
                fontWeight: 600,
                color:
                  trendType === 'positive'
                    ? 'var(--color-primary-green)'
                    : trendType === 'danger'
                    ? 'var(--color-danger-red)'
                    : trendType === 'warning'
                    ? 'var(--color-warning-yellow)'
                    : 'var(--text-muted)'
              }}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-secondary">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
