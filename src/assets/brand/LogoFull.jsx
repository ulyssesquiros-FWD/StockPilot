import React from 'react';
import LogoIsotype from './LogoIsotype';

/**
 * StockPilot Full Brand Logo Component
 * Matches the official identity sheet:
 * - LOGO PRINCIPAL (HORIZONTAL) FONDO CLARO
 * - LOGO VERTICAL FONDO CLARO
 * - LOGO PRINCIPAL (HORIZONTAL) FONDO OSCURO
 * - LOGO VERTICAL FONDO OSCURO
 * - VERSIÓN MONOCROMA (NEGRO) FONDO CLARO
 * - VERSIÓN MONOCROMA (BLANCO) FONDO OSCURO
 */
export default function LogoFull({
  variant = 'light', // 'light' | 'dark' | 'monochrome-black' | 'monochrome-white'
  orientation = 'horizontal', // 'horizontal' | 'vertical'
  size = 40,
  showTagline = true,
  className = ''
}) {
  const isDark = variant === 'dark';
  const isMonoBlack = variant === 'monochrome-black';
  const isMonoWhite = variant === 'monochrome-white';
  const isVertical = orientation === 'vertical';

  let stockColor = '#08264E';
  let pilotColor = '#00B67A';
  let tagColor = '#526071';

  if (isDark) {
    stockColor = '#FFFFFF';
    pilotColor = '#00D68B';
    tagColor = '#94A3B8';
  } else if (isMonoBlack) {
    stockColor = '#000000';
    pilotColor = '#000000';
    tagColor = '#000000';
  } else if (isMonoWhite) {
    stockColor = '#FFFFFF';
    pilotColor = '#FFFFFF';
    tagColor = '#E2E8F0';
  }

  return (
    <div
      className={`stockpilot-logo ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: isVertical ? 'center' : 'flex-start',
        gap: isVertical ? '10px' : '14px',
        textDecoration: 'none',
        userSelect: 'none',
        textAlign: isVertical ? 'center' : 'left'
      }}
      aria-label="StockPilot · Tu inventario, en control."
    >
      <LogoIsotype size={size} variant={variant} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isVertical ? 'center' : 'flex-start',
          justifyContent: 'center'
        }}
      >
        {/* Brand Wordmark: Stock + Pilot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            lineHeight: 1,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}
        >
          <span
            style={{
              fontSize: `${Math.round(size * 0.72)}px`,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: stockColor,
              transition: 'color 0.2s ease'
            }}
          >
            Stock
          </span>
          <span
            style={{
              fontSize: `${Math.round(size * 0.72)}px`,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: pilotColor,
              marginLeft: '1px',
              transition: 'color 0.2s ease'
            }}
          >
            Pilot
          </span>
        </div>

        {/* Tagline: Tu inventario, en control. */}
        {showTagline && (
          <span
            style={{
              fontSize: `${Math.max(10, Math.round(size * 0.29))}px`,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              marginTop: '4px',
              color: tagColor,
              whiteSpace: 'nowrap'
            }}
          >
            Tu inventario, en control.
          </span>
        )}
      </div>
    </div>
  );
}
