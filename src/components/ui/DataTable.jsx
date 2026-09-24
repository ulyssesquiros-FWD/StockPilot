import React from 'react';
import EmptyState from './EmptyState';

export default function DataTable({
  columns = [],
  data = [],
  keyField = 'id',
  emptyMessage = 'No se encontraron registros.',
  renderMobileCard = null,
  className = '',
  onRowClick = null
}) {
  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className={`data-table-wrapper ${className}`}>
      {/* Desktop & Tablet Table */}
      <div className={`table-container ${renderMobileCard ? 'desktop-table-only' : ''}`}>
        <table className="sp-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  style={col.width ? { width: col.width } : {}}
                  className={col.headerClassName || ''}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => {
              const rowKey = row[keyField] || rowIdx;
              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={onRowClick ? { cursor: 'pointer' } : {}}
                >
                  {columns.map((col, colIdx) => (
                    <td key={col.key || colIdx} className={col.className || ''}>
                      {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (Transformed view for <= 768px) */}
      {renderMobileCard && (
        <div className="mobile-card-list">
          {data.map((row, rowIdx) => {
            const rowKey = row[keyField] || rowIdx;
            return (
              <div
                key={rowKey}
                className="sp-card mobile-table-card"
                onClick={() => onRowClick && onRowClick(row)}
                style={onRowClick ? { cursor: 'pointer', padding: '14px' } : { padding: '14px' }}
              >
                {renderMobileCard(row, rowIdx)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
