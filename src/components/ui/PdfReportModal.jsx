import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { buildPdfReportHtml, printStockPilotReport } from '../../utils/pdfReportGenerator';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  FileText,
  Printer,
  Filter,
  Calendar,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Eye
} from 'lucide-react';

export default function PdfReportModal({
  isOpen,
  onClose,
  products = [],
  movements = [],
  categories = [],
  suppliers = [],
  crcExchangeRate = 515.0
}) {
  const { user } = useAuth();
  const { notifySuccess } = useNotification();

  // Filters State
  const [filters, setFilters] = useState({
    categoryId: 'all',
    status: 'all',
    startDate: '',
    endDate: '',
    movementType: 'all',
    productId: 'all'
  });

  const [activeView, setActiveView] = useState('summary'); // 'summary' | 'preview'

  // Computed live filtered counts
  const filteredData = useMemo(() => {
    let prods = [...products];
    if (filters.categoryId !== 'all') {
      prods = prods.filter(p => String(p.categoryId) === String(filters.categoryId));
    }
    if (filters.status === 'out_of_stock') {
      prods = prods.filter(p => Number(p.stock) <= 0);
    } else if (filters.status === 'low_stock') {
      prods = prods.filter(p => Number(p.stock) > 0 && Number(p.stock) <= Number(p.minimumStock));
    } else if (filters.status === 'available') {
      prods = prods.filter(p => Number(p.stock) > Number(p.minimumStock));
    }

    let movs = [...movements];
    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      movs = movs.filter(m => new Date(m.date).getTime() >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate + 'T23:59:59').getTime();
      movs = movs.filter(m => new Date(m.date).getTime() <= end);
    }
    if (filters.movementType !== 'all') {
      movs = movs.filter(m => m.type === filters.movementType);
    }
    if (filters.productId !== 'all') {
      movs = movs.filter(m => String(m.productId) === String(filters.productId));
    }

    const totalValUSD = prods.reduce((acc, p) => acc + (Number(p.stock) || 0) * (Number(p.purchasePrice) || 0), 0);
    const totalEntries = movs.filter(m => m.type === 'ENTRY').reduce((acc, m) => acc + (Number(m.quantity) || 0), 0);
    const totalExits = movs.filter(m => m.type === 'EXIT').reduce((acc, m) => acc + (Number(m.quantity) || 0), 0);

    return {
      products: prods,
      movements: movs,
      totalValUSD,
      totalEntries,
      totalExits
    };
  }, [products, movements, filters]);

  const handlePrint = () => {
    const html = buildPdfReportHtml({
      products,
      movements,
      categories,
      suppliers,
      currentUser: user,
      filters,
      crcExchangeRate
    });

    printStockPilotReport(html);
    notifySuccess('Generando documento PDF... Selecciona "Guardar como PDF" en el diálogo de impresión.');
  };

  const handleResetFilters = () => {
    setFilters({
      categoryId: 'all',
      status: 'all',
      startDate: '',
      endDate: '',
      movementType: 'all',
      productId: 'all'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📄 Generar Informe Ejecutivo PDF"
      size="xl"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="outline"
              onClick={handleResetFilters}
            >
              Restablecer Filtros
            </Button>
            <Button
              variant="primary"
              icon={<Printer size={16} />}
              onClick={handlePrint}
            >
              Imprimir / Guardar como PDF
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Top Info Banner */}
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary-blue)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <FileText size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>
              Documento Oficial de Inventario y Trazabilidad Cronológica
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              El informe incluye el consolidado de existencias, valoración financiera en USD/CRC y el historial de cuándo ingresó y salió cada producto.
            </div>
          </div>
        </div>

        {/* Filters Grid */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-alt)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px'
          }}
        >
          {/* Category Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>
              <Layers size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Categoría
            </label>
            <select
              value={filters.categoryId}
              onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
              className="form-select"
              style={{ fontSize: '12px', padding: '6px 10px' }}
            >
              <option value="all">Todas las categorías</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Product Stock Status Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>
              <Filter size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Estado de Stock
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="form-select"
              style={{ fontSize: '12px', padding: '6px 10px' }}
            >
              <option value="all">Todos los estados</option>
              <option value="available">Óptimo / Disponible</option>
              <option value="low_stock">Stock Bajo / Crítico</option>
              <option value="out_of_stock">Agotado (Sin existencias)</option>
            </select>
          </div>

          {/* Movement Type Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>
              Tipo de Movimiento
            </label>
            <select
              value={filters.movementType}
              onChange={(e) => setFilters(prev => ({ ...prev, movementType: e.target.value }))}
              className="form-select"
              style={{ fontSize: '12px', padding: '6px 10px' }}
            >
              <option value="all">Todos (Ingresos y Salidas)</option>
              <option value="ENTRY">📥 Solo Ingresos / Entradas</option>
              <option value="EXIT">📤 Solo Salidas / Egresos</option>
              <option value="ADJUSTMENT">⚙️ Solo Ajustes de Inventario</option>
            </select>
          </div>

          {/* Date Start */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>
              <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Fecha Inicio (Movimientos)
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="form-input"
              style={{ fontSize: '12px', padding: '6px 10px' }}
            />
          </div>

          {/* Date End */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>
              <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Fecha Fin (Movimientos)
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="form-input"
              style={{ fontSize: '12px', padding: '6px 10px' }}
            />
          </div>
        </div>

        {/* Live Metrics Preview Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px'
          }}
        >
          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Productos a incluir</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-blue)' }}>
              {filteredData.products.length} SKUs
            </div>
          </div>

          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Valoración Total</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-green)' }}>
              ${filteredData.totalValUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Entradas en periodo</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#10B981' }}>
              +{filteredData.totalEntries} uds
            </div>
          </div>

          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Salidas en periodo</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#EF4444' }}>
              -{filteredData.totalExits} uds
            </div>
          </div>
        </div>

        {/* Structure Overview */}
        <div
          style={{
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            backgroundColor: 'var(--bg-surface)',
            fontSize: '12px'
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={15} color="var(--color-primary-blue)" />
            Estructura del Informe Generado:
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-secondary)' }}>
            <li><strong>Encabezado Corporativo:</strong> Membrete oficial StockPilot, fecha/hora de emisión, emisor y tipo de cambio de referencia.</li>
            <li><strong>Tarjetas de Indicadores Clave (KPIs):</strong> Conteo de catálogo, existencias totales, capital invertido y salud de inventario.</li>
            <li><strong>Sección 1 (Estado Actual):</strong> Detalle por producto con SKU, código de barras EAN-13, categoría, existencias, precios de compra/venta y valoración patrimonial.</li>
            <li><strong>Sección 2 (Cronología de Trazabilidad):</strong> Historial fechado de cuándo ingresó y cuándo salió cada producto, unidades, justificación y usuario responsable.</li>
            <li><strong>Bloque de Aprobación:</strong> Firmas formales para Responsable de Bodega, Auditoría Interna y Gerencia.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
