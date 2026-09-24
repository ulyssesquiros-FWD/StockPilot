/**
 * Currency Service - Integrates live Open Exchange Rates API
 * Provides real-time USD exchange rates, currency conversion and offline fallback.
 */

const API_URL = 'https://open.er-api.com/v6/latest/USD';
const CACHE_KEY = 'stockpilot_exchange_rates_cache';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

// Curated reference currencies with metadata
export const POPULAR_CURRENCIES = [
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', flag: '🇺🇸' },
  { code: 'CRC', name: 'Colón Costarricense', symbol: '₡', flag: '🇨🇷' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$', flag: '🇲🇽' },
  { code: 'COP', name: 'Peso Colombiano', symbol: '$', flag: '🇨🇴' },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£', flag: '🇬🇧' },
  { code: 'CAD', name: 'Dólar Canadiense', symbol: '$', flag: '🇨🇦' },
  { code: 'BRL', name: 'Real Brasileño', symbol: 'R$', flag: '🇧🇷' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$', flag: '🇨🇱' },
  { code: 'PEN', name: 'Sol Peruano', symbol: 'S/', flag: '🇵🇪' }
];

// Offline fallback rates if external API is temporarily unreachable
const FALLBACK_RATES = {
  base: 'USD',
  time_last_update_utc: new Date().toUTCString(),
  rates: {
    USD: 1,
    CRC: 452.34,
    EUR: 0.88,
    MXN: 17.47,
    COP: 4150.0,
    GBP: 0.76,
    CAD: 1.35,
    BRL: 5.42,
    CLP: 915.0,
    PEN: 3.75
  },
  isFallback: true
};

export const currencyService = {
  /**
   * Fetch live exchange rates from the external API (with caching)
   * @param {boolean} forceRefresh
   * @returns {Promise<{ base: string, rates: object, lastUpdated: string, isLive: boolean }>}
   */
  async getRates(forceRefresh = false) {
    if (!forceRefresh) {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            return {
              base: parsed.data.base_code || 'USD',
              rates: parsed.data.rates,
              lastUpdated: parsed.data.time_last_update_utc || new Date().toISOString(),
              isLive: !parsed.data.isFallback
            };
          }
        }
      } catch {
        // Ignore cache parse error
      }
    }

    if (typeof fetch === 'undefined') {
      return {
        base: FALLBACK_RATES.base,
        rates: FALLBACK_RATES.rates,
        lastUpdated: FALLBACK_RATES.time_last_update_utc,
        isLive: false
      };
    }

    try {
      const response = await fetch(API_URL, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API respondió con estado ${response.status}`);
      }

      const data = await response.json();
      if (data && data.result === 'success' && data.rates) {
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), data })
          );
        } catch {
          // Ignore storage quota
        }

        return {
          base: data.base_code || 'USD',
          rates: data.rates,
          lastUpdated: data.time_last_update_utc,
          isLive: true
        };
      } else {
        throw new Error('Formato de datos no reconocido');
      }
    } catch (err) {
      console.warn('Usando tasas de cambio de respaldo:', err.message);
      return {
        base: FALLBACK_RATES.base,
        rates: FALLBACK_RATES.rates,
        lastUpdated: FALLBACK_RATES.time_last_update_utc,
        isLive: false
      };
    }
  },

  /**
   * Convert an amount between currencies
   * @param {number} amount
   * @param {string} from
   * @param {string} to
   * @param {object} rates
   * @returns {number}
   */
  convert(amount, from = 'USD', to = 'CRC', rates = null) {
    const num = Number(amount) || 0;
    if (from === to) return num;

    const r = rates || FALLBACK_RATES.rates;
    const rateFrom = r[from] || 1;
    const rateTo = r[to] || 1;

    // Convert from -> USD -> to
    const inUSD = num / rateFrom;
    return inUSD * rateTo;
  },

  /**
   * Format currency value with symbol and decimal precision
   * @param {number} amount
   * @param {string} currencyCode
   * @returns {string}
   */
  format(amount, currencyCode = 'USD') {
    const curr = POPULAR_CURRENCIES.find(c => c.code === currencyCode);
    const symbol = curr ? curr.symbol : '$';
    const decimals = 2;

    const formattedNumber = Number(amount || 0).toLocaleString('es-CR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    return `${symbol} ${formattedNumber} ${currencyCode}`;
  }
};

export default currencyService;
