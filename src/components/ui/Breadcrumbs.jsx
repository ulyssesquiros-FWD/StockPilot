import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '16px' }}>
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontSize: '13px'
        }}
      >
        <li>
          <Link
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-muted)',
              textDecoration: 'none'
            }}
            aria-label="Ir a Dashboard"
          >
            <Home size={15} />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <ChevronRight size={14} />
              </li>
              <li>
                {isLast || !item.to ? (
                  <span
                    style={{
                      color: 'var(--text-main)',
                      fontWeight: 600
                    }}
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.to}
                    style={{
                      color: 'var(--text-muted)',
                      textDecoration: 'none'
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
