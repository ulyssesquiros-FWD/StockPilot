import React from 'react';
import Badge from './Badge';
import { Check, AlertTriangle, X, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function StatusBadge({
  status,
  type = 'stock', // 'stock', 'user', 'alert'
  className = ''
}) {
  if (type === 'stock') {
    switch (status) {
      case 'available':
        return (
          <Badge variant="success" icon={<Check size={14} />} className={className}>
            Disponible
          </Badge>
        );
      case 'low_stock':
        return (
          <Badge variant="warning" icon={<AlertTriangle size={14} />} className={className}>
            Stock bajo
          </Badge>
        );
      case 'out_of_stock':
        return (
          <Badge variant="danger" icon={<X size={14} />} className={className}>
            Agotado
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" className={className}>
            {status || 'Desconocido'}
          </Badge>
        );
    }
  }

  if (type === 'user') {
    if (status === 'active') {
      return (
        <Badge variant="success" icon={<Check size={14} />} className={className}>
          Activo
        </Badge>
      );
    }
    return (
      <Badge variant="neutral" icon={<X size={14} />} className={className}>
        Inactivo
      </Badge>
    );
  }

  if (type === 'alert') {
    switch (status) {
      case 'critical':
        return (
          <Badge variant="danger" icon={<ShieldAlert size={14} />} className={className}>
            Crítico
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="warning" icon={<AlertTriangle size={14} />} className={className}>
            Advertencia
          </Badge>
        );
      case 'resolved':
        return (
          <Badge variant="success" icon={<CheckCircle2 size={14} />} className={className}>
            Resuelto
          </Badge>
        );
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  }

  return <Badge variant="neutral">{status}</Badge>;
}
