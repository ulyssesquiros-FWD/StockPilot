import React from 'react';

/**
 * StockPilot Official Brand Isotype Component
 * Supports all variants from the Brand Manual:
 * - 'light': Default on light background (Navy/Blue box + Mint/Emerald green accents)
 * - 'dark': For dark backgrounds and sidebar (Electric blue box + Vivid mint accents)
 * - 'monochrome-black': Solid black silhouette with negative space cuts
 * - 'monochrome-white': Solid white silhouette with negative space cuts
 * - 'app-icon': App Icon style (squircle container with subtle bevel & drop shadow)
 */
export default function LogoIsotype({
  size = 40,
  className = '',
  variant = 'light',
  asAppIcon = false
}) {
  const isDark = variant === 'dark';
  const isMonoBlack = variant === 'monochrome-black';
  const isMonoWhite = variant === 'monochrome-white';
  const isAppIcon = asAppIcon || variant === 'app-icon';

  // SVG Mark Content
  const renderMark = (uid = 'iso') => (
    <svg
      width={isAppIcon ? '72%' : size}
      height={isAppIcon ? '72%' : size}
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Isotipo StockPilot"
      style={{ overflow: 'visible', flexShrink: 0 }}
    >
      <defs>
        {/* Colors & Gradients for Light / Dark Mode */}
        {!isMonoBlack && !isMonoWhite && (
          <>
            <linearGradient id={`${uid}-top`} x1="28" y1="14" x2="68" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor={isDark ? '#257CEB' : '#1E6FD9'} />
              <stop offset="1" stopColor={isDark ? '#1463CC' : '#0B56B8'} />
            </linearGradient>

            <linearGradient id={`${uid}-left`} x1="22" y1="26" x2="52" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor={isDark ? '#0A438C' : '#09387A'} />
              <stop offset="1" stopColor={isDark ? '#062E63' : '#052452'} />
            </linearGradient>

            <linearGradient id={`${uid}-right`} x1="52" y1="34" x2="78" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor={isDark ? '#1B6FE0' : '#0F60C9'} />
              <stop offset="1" stopColor={isDark ? '#0E51AA' : '#08479E'} />
            </linearGradient>

            <linearGradient id={`${uid}-tape`} x1="36" y1="17" x2="60" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B8BF5" />
              <stop offset="1" stopColor="#1E6FD9" />
            </linearGradient>

            <linearGradient id={`${uid}-green`} x1="60" y1="65" x2="105" y2="15" gradientUnits="userSpaceOnUse">
              <stop stopColor={isDark ? '#00E894' : '#00D287'} />
              <stop offset="1" stopColor={isDark ? '#00BC75' : '#00A86B'} />
            </linearGradient>

            <linearGradient id={`${uid}-swoosh`} x1="8" y1="50" x2="55" y2="78" gradientUnits="userSpaceOnUse">
              <stop stopColor={isDark ? '#00F0A8' : '#00DCA0'} />
              <stop offset="0.6" stopColor={isDark ? '#00D08A' : '#00BF80'} />
              <stop offset="1" stopColor={isDark ? '#00A86B' : '#009960'} />
            </linearGradient>
          </>
        )}
      </defs>

      {/* 1. Orbit Swoosh Ring */}
      <path
        d="M 12 56 C 8 68 18 78 34 81 C 48 83 60 76 68 67 C 69 65 67 63 65 64 C 57 71 46 76 34 74 C 22 72 16 64 18 56 C 19 53 13 52 12 56 Z"
        fill={
          isMonoBlack
            ? '#000000'
            : isMonoWhite
            ? '#FFFFFF'
            : `url(#${uid}-swoosh)`
        }
      />
      {!isMonoBlack && !isMonoWhite && (
        <path
          d="M 14 52 C 11 60 16 69 28 74 C 29.5 74.6 30 72.8 28.5 72.2 C 18 68 14 60 16.5 53.5 C 17.5 50.8 15 49.5 14 52 Z"
          fill="#4EEDB6"
          opacity="0.8"
        />
      )}
      {(isMonoBlack || isMonoWhite) && (
        /* Negative space separator for monochrome */
        <path
          d="M 18 56 C 16 64 22 72 34 74 C 46 76 57 71 65 64"
          stroke={isMonoBlack ? '#FFFFFF' : '#000000'}
          strokeWidth="2"
          fill="none"
        />
      )}

      {/* 2. 3D Cardboard Box - Left Shadow Face */}
      <path
        d="M 24 30 L 52 44 L 52 74 L 24 60 Z"
        fill={
          isMonoBlack
            ? '#000000'
            : isMonoWhite
            ? '#FFFFFF'
            : `url(#${uid}-left)`
        }
      />
      {/* Front flap cutout/accent on left face */}
      <path
        d="M 36 36 L 42 39 L 42 49 L 36 46 Z"
        fill={isMonoBlack ? '#FFFFFF' : isMonoWhite ? '#000000' : '#051C3F'}
      />

      {/* 3. 3D Cardboard Box - Right Face */}
      <path
        d="M 52 44 L 78 33 L 78 61 L 52 74 Z"
        fill={
          isMonoBlack
            ? '#000000'
            : isMonoWhite
            ? '#FFFFFF'
            : `url(#${uid}-right)`
        }
        stroke={isMonoBlack ? '#FFFFFF' : isMonoWhite ? '#000000' : 'none'}
        strokeWidth={isMonoBlack || isMonoWhite ? '1.5' : '0'}
      />

      {/* 4. 3D Cardboard Box - Top Face */}
      <path
        d="M 48 14 L 76 25 L 52 38 L 24 26 Z"
        fill={
          isMonoBlack
            ? '#000000'
            : isMonoWhite
            ? '#FFFFFF'
            : `url(#${uid}-top)`
        }
        stroke={isMonoBlack ? '#FFFFFF' : isMonoWhite ? '#000000' : 'none'}
        strokeWidth={isMonoBlack || isMonoWhite ? '1.5' : '0'}
      />

      {/* Box Tape Stripe across top */}
      <path
        d="M 43 16 L 51 19.5 L 43 33.5 L 35 30 Z"
        fill={isMonoBlack ? '#FFFFFF' : isMonoWhite ? '#000000' : `url(#${uid}-tape)`}
        opacity={isMonoBlack || isMonoWhite ? 1 : 0.9}
      />

      {/* 5. Three Ascending Growth Bars */}
      {/* Bar 1 (Shortest) */}
      <rect
        x="63"
        y="50"
        width="7.5"
        height="22"
        rx="3.75"
        fill={isMonoBlack ? '#000000' : isMonoWhite ? '#FFFFFF' : `url(#${uid}-green)`}
      />

      {/* Bar 2 (Medium) */}
      <rect
        x="74.5"
        y="39"
        width="7.5"
        height="33"
        rx="3.75"
        fill={isMonoBlack ? '#000000' : isMonoWhite ? '#FFFFFF' : `url(#${uid}-green)`}
      />

      {/* Bar 3 (Tallest) */}
      <rect
        x="86"
        y="27"
        width="7.5"
        height="45"
        rx="3.75"
        fill={isMonoBlack ? '#000000' : isMonoWhite ? '#FFFFFF' : `url(#${uid}-green)`}
      />

      {/* 6. Growth Arrow (Pointing Up-Right ↗) */}
      <path
        d="M 97 45 L 97 19.5 C 97 18 98.8 17.2 99.8 18.2 L 109 27.4 C 110.2 28.6 109.4 30.6 107.7 30.6 L 103 30.6 L 103 45 C 103 46.5 101.5 47.5 100 47.5 C 98.5 47.5 97 46.5 97 45 Z"
        fill={isMonoBlack ? '#000000' : isMonoWhite ? '#FFFFFF' : '#00C87E'}
      />
      {!isMonoBlack && !isMonoWhite && (
        <path
          d="M 96.5 35 L 105 20 L 109.5 24.5 L 101 40 Z"
          fill="#34EEAC"
          opacity="0.3"
        />
      )}
    </svg>
  );

  // If App Icon requested: wrap in Apple-like squircle
  if (isAppIcon) {
    return (
      <div
        className={`stockpilot-app-icon ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: `${Math.round(size * 0.22)}px`,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0
        }}
        title="StockPilot App Icon"
      >
        {renderMark('appIcon')}
      </div>
    );
  }

  return renderMark('mainIso');
}
