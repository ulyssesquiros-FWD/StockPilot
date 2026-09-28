import React from 'react';
import { ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';

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
    blue: {
      bg: 'var(--color-primary-blue-light)',
      fg: 'var(--color-primary-blue)',
      border: 'rgba(15, 82, 186, 0.15)'
    },
    green: {
      bg: 'var(--color-primary-green-light)',
      fg: 'var(--color-primary-green)',
      border: 'rgba(16, 185, 129, 0.15)'
    },
    yellow: {
      bg: 'var(--color-warning-yellow-light)',
      fg: 'var(--color-warning-yellow)',
      border: 'rgba(245, 158, 11, 0.15)'
    },
    red: {
      bg: 'var(--color-danger-red-light)',
      fg: 'var(--color-danger-red)',
      border: 'rgba(239, 68, 68, 0.15)'
    }
  };

  const currentVariant = colorMap[variant] || colorMap.blue;

  return (
    <div
      className={`sp-card kpi-card ${className}`}
      style={{
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)'
            }}
          >
            {title}
          </span>
          {icon && (
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: currentVariant.bg,
                color: currentVariant.fg,
                border: `1px solid ${currentVariant.border}`,
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

        <div
          className="font-heading"
          style={{
            fontSize: '30px',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: 'var(--text-main)',
            marginTop: '2px'
          }}
        >
          {value}
        </div>
      </div>

      {(subtitle || trend) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-color-subtle)',
            fontSize: '12.5px',
            flexWrap: 'wrap'
          }}
        >
          {trend && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                fontWeight: 600,
                fontSize: '11.5px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor:
                  trendType === 'positive'
                    ? 'var(--color-primary-green-light)'
                    : trendType === 'danger'
                    ? 'var(--color-danger-red-light)'
                    : trendType === 'warning'
                    ? 'var(--color-warning-yellow-light)'
                    : 'var(--bg-surface-alt)',
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
              {trendType === 'positive' && <ArrowUpRight size={13} />}
              {trendType === 'danger' && <ArrowDownRight size={13} />}
              {trendType === 'warning' && <AlertCircle size={13} />}
              <span>{trend}</span>
            </span>
          )}
          {subtitle && <span className="text-secondary" style={{ fontSize: '12px' }}>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
