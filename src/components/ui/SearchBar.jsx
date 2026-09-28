import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Buscar por nombre, SKU, marca...',
  className = '',
  id = 'global-search'
}) {
  return (
    <div
      className={`search-bar-wrapper ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <Search
        size={16}
        color="var(--text-muted)"
        style={{
          position: 'absolute',
          left: '12px',
          pointerEvents: 'none',
          opacity: 0.8
        }}
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input"
        style={{
          paddingLeft: '36px',
          paddingRight: value ? '34px' : '48px',
          height: '36px',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          backgroundColor: 'var(--bg-surface-alt)',
          border: '1px solid var(--border-color)',
          transition: 'all 0.15s ease'
        }}
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            if (onClear) onClear();
            else onChange('');
          }}
          className="btn-icon btn-ghost"
          aria-label="Limpiar búsqueda"
          style={{
            position: 'absolute',
            right: '6px',
            padding: '4px',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <X size={15} />
        </button>
      ) : (
        <div
          style={{
            position: 'absolute',
            right: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            pointerEvents: 'none'
          }}
        >
          <kbd
            style={{
              padding: '2px 5px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              lineHeight: 1
            }}
          >
            ⌘K
          </kbd>
        </div>
      )}
    </div>
  );
}
