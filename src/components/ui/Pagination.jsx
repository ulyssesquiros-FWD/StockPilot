import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  pageSize = 10
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 4px',
        flexWrap: 'wrap',
        gap: '12px'
      }}
      aria-label="Paginación"
    >
      <span className="text-secondary">
        Mostrando <strong>{startItem}</strong> - <strong>{endItem}</strong> de <strong>{totalItems}</strong> registros
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Página anterior"
          icon={<ChevronLeft size={16} />}
        >
          Anterior
        </Button>
        <span style={{ fontSize: '13px', fontWeight: 600, padding: '0 8px' }}>
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Página siguiente"
          icon={<ChevronRight size={16} />}
          iconPosition="right"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
