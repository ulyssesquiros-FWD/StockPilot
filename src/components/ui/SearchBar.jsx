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
        size={18}
        color="var(--text-muted)"
        style={{
          position: 'absolute',
          left: '12px',
          pointerEvents: 'none'
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
          paddingLeft: '38px',
          paddingRight: value ? '36px' : '14px',
          borderRadius: 'var(--radius-full)'
        }}
      />
      {value && (
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
            right: '8px',
            padding: '4px',
            borderRadius: '50%'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
