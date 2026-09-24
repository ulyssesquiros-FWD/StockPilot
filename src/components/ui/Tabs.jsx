import React from 'react';

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = ''
}) {
  return (
    <div
      role="tablist"
      className={`tabs-navigation ${className}`}
      style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '20px',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tab-panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: 600,
              color: isActive ? 'var(--color-primary-blue)' : 'var(--text-muted)',
              borderBottom: isActive ? '2px solid var(--color-primary-blue)' : '2px solid transparent',
              background: 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'var(--color-primary-blue-light)' : 'var(--bg-surface-hover)',
                  color: isActive ? 'var(--color-primary-blue)' : 'var(--text-muted)'
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
