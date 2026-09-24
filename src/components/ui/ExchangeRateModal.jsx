import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import currencyService, { POPULAR_CURRENCIES } from '../../services/currencyService';
import {
  DollarSign,
  RefreshCw,
  ArrowRightLeft,
  TrendingUp,
  Globe,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ExchangeRateModal({ isOpen, onClose }) {
  const [ratesData, setRatesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('CRC');
  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'converter'

  const fetchRates = async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await currencyService.getRates(force);
      setRatesData(data);
    } catch {
      // Handled in service fallback
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRates(false);
    }
  }, [isOpen]);

  const convertedValue = ratesData?.rates
    ? currencyService.convert(amount, fromCurrency, toCurrency, ratesData.rates)
    : 0;

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tipo de Cambio del Dólar (USD) en Tiempo Real"
      maxWidth="620px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={13} />
            <span>Fuente: Open Exchange Rates REST API</span>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      }
    >
      <div className="exchange-rate-modal-content">
        {/* Status Header Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 14px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            marginBottom: '16px',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {ratesData?.isLive ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-primary-green)'
                }}
              >
                <CheckCircle2 size={14} /> API Conectada en Vivo
              </span>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-warning-yellow)'
                }}
              >
                <AlertCircle size={14} /> Modo Offline (Tarifas de Respaldo)
              </span>
            )}
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              • Base: 1 USD
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={<RefreshCw size={13} className={refreshing ? 'spin-icon' : ''} />}
            onClick={() => fetchRates(true)}
            disabled={loading || refreshing}
            title="Actualizar cotizaciones en vivo"
          >
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>

        {/* View Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '16px',
            paddingBottom: '8px'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'table' ? 'var(--color-primary-blue)' : 'transparent',
              color: activeTab === 'table' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Cotizaciones Oficiales
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('converter')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'converter' ? 'var(--color-primary-blue)' : 'transparent',
              color: activeTab === 'converter' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Conversor de Divisas
          </button>
        </div>

        {/* Tab 1: Cotizaciones Table */}
        {activeTab === 'table' && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '10px',
                marginBottom: '16px'
              }}
            >
              {/* Highlight Costa Rica Colones */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(30, 90, 242, 0.08)',
                  border: '1px solid var(--color-primary-blue)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary-blue)' }}>
                    🇨🇷 COSTA RICA (CRC)
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                    ₡{ratesData?.rates?.CRC ? ratesData.rates.CRC.toFixed(2) : '452.34'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Por 1.00 USD</div>
                </div>
                <TrendingUp size={24} color="var(--color-primary-blue)" />
              </div>

              {/* Highlight Euro */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid var(--color-primary-green)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary-green)' }}>
                    🇪🇺 UNIÓN EUROPEA (EUR)
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                    €{ratesData?.rates?.EUR ? ratesData.rates.EUR.toFixed(4) : '0.8800'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Por 1.00 USD</div>
                </div>
                <TrendingUp size={24} color="var(--color-primary-green)" />
              </div>
            </div>

            {/* Complete Rates Table */}
            <div
              style={{
                maxHeight: '220px',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>Moneda</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>1 USD Equivale a</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>Inverso (en USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {POPULAR_CURRENCIES.map(curr => {
                    const rate = ratesData?.rates?.[curr.code] || 1;
                    const inverse = rate > 0 ? 1 / rate : 0;
                    return (
                      <tr
                        key={curr.code}
                        style={{
                          borderBottom: '1px solid var(--border-color-subtle)',
                          transition: 'background 0.1s'
                        }}
                      >
                        <td style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>{curr.flag}</span>
                          <div>
                            <span style={{ fontWeight: 600 }}>{curr.code}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                              {curr.name}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: 'var(--text-main)' }}>
                          {curr.symbol} {rate.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)' }}>
                          ${inverse.toFixed(4)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Converter */}
        {activeTab === 'converter' && (
          <div>
            <div
              style={{
                padding: '16px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'flex-end' }}>
                {/* From Input & Currency */}
                <div>
                  <label className="form-label">Monto a Convertir</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="any"
                    placeholder="100"
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="form-select"
                    style={{ marginTop: '6px' }}
                  >
                    {POPULAR_CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <div style={{ paddingBottom: '6px' }}>
                  <button
                    type="button"
                    onClick={handleSwapCurrencies}
                    className="btn-icon btn-secondary"
                    title="Invertir monedas"
                    style={{ borderRadius: '50%', width: '36px', height: '36px' }}
                  >
                    <ArrowRightLeft size={16} />
                  </button>
                </div>

                {/* Target Currency */}
                <div>
                  <label className="form-label">Moneda Destino</label>
                  <div
                    style={{
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontWeight: 700,
                      color: 'var(--color-primary-blue)',
                      fontSize: '15px'
                    }}
                  >
                    {currencyService.format(convertedValue, toCurrency)}
                  </div>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="form-select"
                    style={{ marginTop: '6px' }}
                  >
                    {POPULAR_CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conversion Result Summary Box */}
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color-subtle)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {amount || 0} {fromCurrency} =
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary-green)', margin: '4px 0' }}>
                  {currencyService.format(convertedValue, toCurrency)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Tasa de cambio aplicada: 1 {fromCurrency} = {(ratesData?.rates ? currencyService.convert(1, fromCurrency, toCurrency, ratesData.rates) : 1).toFixed(4)} {toCurrency}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timestamp Footer Note */}
        {ratesData?.lastUpdated && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right', marginTop: '10px' }}>
            Última actualización de la API: {new Date(ratesData.lastUpdated).toLocaleString('es-CR')}
          </div>
        )}
      </div>
    </Modal>
  );
}
