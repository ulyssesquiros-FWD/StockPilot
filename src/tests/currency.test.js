import currencyService, { POPULAR_CURRENCIES } from '../services/currencyService';

describe('currencyService - External Currency Exchange Rate API', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  test('should have popular currencies with codes and symbols', () => {
    expect(POPULAR_CURRENCIES.length).toBeGreaterThanOrEqual(5);
    const crc = POPULAR_CURRENCIES.find(c => c.code === 'CRC');
    expect(crc).toBeDefined();
    expect(crc.symbol).toBe('₡');
  });

  test('should convert amounts between currencies correctly', () => {
    const mockRates = {
      USD: 1,
      CRC: 500,
      EUR: 0.9,
      MXN: 20
    };

    // 100 USD to CRC = 50,000 CRC
    const inCRC = currencyService.convert(100, 'USD', 'CRC', mockRates);
    expect(inCRC).toBe(50000);

    // 50,000 CRC to USD = 100 USD
    const inUSD = currencyService.convert(50000, 'CRC', 'USD', mockRates);
    expect(inUSD).toBe(100);

    // Same currency conversion
    const same = currencyService.convert(250, 'USD', 'USD', mockRates);
    expect(same).toBe(250);

    // 100 EUR to MXN: (100 / 0.9) * 20 = 2222.22...
    const eurToMxn = currencyService.convert(100, 'EUR', 'MXN', mockRates);
    expect(Math.round(eurToMxn)).toBe(2222);
  });

  test('should format currency with proper symbol and formatting', () => {
    const formattedCRC = currencyService.format(50000, 'CRC');
    expect(formattedCRC).toContain('₡');
    expect(formattedCRC).toContain('CRC');

    const formattedUSD = currencyService.format(120.5, 'USD');
    expect(formattedUSD).toContain('$');
    expect(formattedUSD).toContain('USD');
  });

  test('should return valid rates from getRates with fallback resilience', async () => {
    // Test that getRates returns an object with base, rates, and lastUpdated
    const result = await currencyService.getRates();
    expect(result).toBeDefined();
    expect(result.base).toBe('USD');
    expect(result.rates).toBeDefined();
    expect(result.rates.CRC).toBeDefined();
  });
});
