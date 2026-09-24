import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import {
  TAXONOMY_FAMILIES,
  generateTaxonomicSku,
  generateTaxonomicBarcode,
  parseSkuTaxonomy
} from '../../utils/skuTaxonomy';
import {
  Tag,
  Barcode,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Copy,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function TaxonomyModal({ isOpen, onClose }) {
  const { notifySuccess } = useNotification();
  const [activeTab, setActiveTab] = useState('guide'); // 'guide' | 'explorer' | 'tester'

  // Interactive tester states
  const [testCategory, setTestCategory] = useState('1');
  const [testName, setTestName] = useState('Laptop HP ProBook 450');
  const [testBrand, setTestBrand] = useState('HP');
  const [testSeq, setTestSeq] = useState('1');
  const [decodeSkuInput, setDecodeSkuInput] = useState('TEC-LAP-HP-001');

  const generatedSku = generateTaxonomicSku({
    categoryId: testCategory,
    productName: testName,
    brand: testBrand,
    sequentialId: testSeq
  });

  const generatedBarcode = generateTaxonomicBarcode({
    categoryId: testCategory,
    sequentialId: testSeq
  });

  const decodedResult = parseSkuTaxonomy(decodeSkuInput);

  const copyToClipboard = (text, label) => {
    navigator.clipboard?.writeText(text);
    notifySuccess(`${label} copiado al portapapeles.`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Taxonomía Oficial de Códigos de Inventario StockPilot"
      maxWidth="780px"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <div className="taxonomy-modal-content">
        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '18px',
            paddingBottom: '8px'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'guide' ? 'var(--color-primary-blue)' : 'transparent',
              color: activeTab === 'guide' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Norma y Estructura SKU
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('explorer')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'explorer' ? 'var(--color-primary-blue)' : 'transparent',
              color: activeTab === 'explorer' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Catálogo de Familias y Subfamilias
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tester')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'tester' ? 'var(--color-primary-blue)' : 'transparent',
              color: activeTab === 'tester' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Simulador y Decodificador
          </button>
        </div>

        {/* Tab 1: Norma & Estructura */}
        {activeTab === 'guide' && (
          <div>
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                marginBottom: '16px'
              }}
            >
              <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--color-primary-blue)' }}>
                Estructura Estándar del Código SKU (Stock Keeping Unit)
              </h4>
              <p className="text-secondary" style={{ fontSize: '13px', margin: '0 0 16px 0' }}>
                Cada artículo en StockPilot sigue una codificación alfanumérica de 4 bloques jerárquicos:
              </p>

              {/* Visual Breakdown Diagram */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  padding: '14px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color-subtle)',
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  fontWeight: 700
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ padding: '6px 12px', backgroundColor: 'rgba(30, 90, 242, 0.15)', color: '#1E5AF2', borderRadius: '4px' }}>
                    [FAMILIA]
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>3 letras (Categoría)</div>
                </div>

                <span style={{ color: 'var(--text-muted)' }}>-</span>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ padding: '6px 12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', borderRadius: '4px' }}>
                    [SUBFAMILIA]
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>3 letras (Tipo de bien)</div>
                </div>

                <span style={{ color: 'var(--text-muted)' }}>-</span>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ padding: '6px 12px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', borderRadius: '4px' }}>
                    [MARCA / MODELO]
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>2-4 letras (Fabricante)</div>
                </div>

                <span style={{ color: 'var(--text-muted)' }}>-</span>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ padding: '6px 12px', backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', borderRadius: '4px' }}>
                    [CORRELATIVO]
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>3 dígitos (# único)</div>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ejemplo resultante:</span>
                <span className="badge badge-primary" style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                  TEC-LAP-HP-001
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  (Tecnología &gt; Laptops &gt; HP &gt; Ref. #001)
                </span>
              </div>
            </div>

            {/* Barcode Standard Box */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Barcode size={18} color="var(--color-primary-green)" />
                Norma de Códigos de Barras (EAN-13 GS1)
              </h4>
              <p className="text-secondary" style={{ fontSize: '12px', margin: 0, lineHeight: '1.5' }}>
                Estructura de 13 dígitos: <code>744</code> (País / GS1 Costa Rica) + <code>101</code> (Empresa StockPilot) + <code>Cat</code> (1 dígito de Familia) + <code>Secuencial</code> (5 dígitos) + <code>DV</code> (Dígito verificador módulo 10).
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Explorer de Familias */}
        {activeTab === 'explorer' && (
          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.values(TAXONOMY_FAMILIES).map(fam => (
                <div
                  key={fam.prefix}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-surface)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          backgroundColor: fam.color,
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '12px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontFamily: 'monospace'
                        }}
                      >
                        {fam.prefix}
                      </span>
                      <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>{fam.name}</strong>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Arancel SAC/HS: <code>{fam.hsCodePrefix}</code>
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {Object.entries(fam.subfamilies).map(([subKey, sub]) => (
                      <span
                        key={subKey}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color-subtle)',
                          color: 'var(--text-secondary)'
                        }}
                        title={`Palabras clave: ${sub.keywords.join(', ') || 'N/A'}`}
                      >
                        <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>{sub.prefix}:</strong> {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Simulador y Decodificador */}
        {activeTab === 'tester' && (
          <div>
            {/* Generator Form */}
            <div
              style={{
                padding: '16px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                marginBottom: '16px'
              }}
            >
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-main)' }}>
                🪄 Generador de SKU y Código de Barras
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Categoría / Familia</label>
                  <select
                    value={testCategory}
                    onChange={(e) => setTestCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="1">1 · Tecnología (TEC)</option>
                    <option value="2">2 · Ferretería (FER)</option>
                    <option value="3">3 · Alimentos (ALI)</option>
                    <option value="4">4 · Farmacia (FAR)</option>
                    <option value="5">5 · Oficina (OFI)</option>
                    <option value="6">6 · Textil (TEX)</option>
                    <option value="7">7 · Automotriz (AUT)</option>
                  </select>
                </div>

                <Input
                  label="Nombre del Producto"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="Ej. Taladro Percutor 500W"
                />

                <Input
                  label="Marca"
                  value={testBrand}
                  onChange={(e) => setTestBrand(e.target.value)}
                  placeholder="Ej. Bosch"
                />

                <Input
                  label="Correlativo #"
                  type="number"
                  value={testSeq}
                  onChange={(e) => setTestSeq(e.target.value)}
                  min="1"
                />
              </div>

              {/* Generated Result */}
              <div
                style={{
                  marginTop: '14px',
                  padding: '12px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SKU Taxonómico Generado:</div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-primary-blue)', fontFamily: 'monospace' }}>
                    {generatedSku}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Código de Barras EAN-13:</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-green)', fontFamily: 'monospace' }}>
                    {generatedBarcode}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  icon={<Copy size={13} />}
                  onClick={() => copyToClipboard(generatedSku, 'SKU')}
                >
                  Copiar SKU
                </Button>
              </div>
            </div>

            {/* Decoder */}
            <div
              style={{
                padding: '16px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                🔍 Decodificador de SKU
              </h4>
              <Input
                label="Ingresa cualquier SKU para desglosarlo"
                value={decodeSkuInput}
                onChange={(e) => setDecodeSkuInput(e.target.value)}
                placeholder="Ej. FER-HER-BOS-002"
              />

              <div
                style={{
                  marginTop: '12px',
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px'
                }}
              >
                <strong>Desglose:</strong> {decodedResult.formattedText}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
