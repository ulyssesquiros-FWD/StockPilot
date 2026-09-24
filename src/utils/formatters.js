/**
 * StockPilot Formatting Utilities
 */

export function formatCurrency(amount, currency = 'USD') {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatNumber(val) {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('es-ES').format(num);
}

export function formatMovementType(type) {
  const map = {
    ENTRY: { label: 'Entrada', variant: 'success', icon: 'arrow-down-left' },
    EXIT: { label: 'Salida', variant: 'danger', icon: 'arrow-up-right' },
    ADJUSTMENT: { label: 'Ajuste', variant: 'info', icon: 'sliders' },
    RETURN: { label: 'Devolución', variant: 'warning', icon: 'rotate-ccw' }
  };
  return map[type] || { label: type, variant: 'neutral' };
}
