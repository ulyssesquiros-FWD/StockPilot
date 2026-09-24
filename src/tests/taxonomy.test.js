import {
  TAXONOMY_FAMILIES,
  calculateEan13CheckDigit,
  detectSubfamily,
  generateTaxonomicSku,
  generateTaxonomicBarcode,
  parseSkuTaxonomy,
  getFamilyByCategoryId,
  sanitizeCodeSegment
} from '../utils/skuTaxonomy';

describe('Inventory Code Taxonomy Unit Suite', () => {
  describe('EAN-13 Check Digit Calculation', () => {
    test('calculates correct check digit for known EAN-13 barcodes', () => {
      // Known standard GS1 example: 400638133393 -> 1
      expect(calculateEan13CheckDigit('400638133393')).toBe(1);
      // Another example: 978020137962 -> 4
      expect(calculateEan13CheckDigit('978020137962')).toBe(4);
    });

    test('pads shorter strings and computes modulo 10 reliably', () => {
      const check = calculateEan13CheckDigit('744101100001');
      expect(typeof check).toBe('number');
      expect(check).toBeGreaterThanOrEqual(0);
      expect(check).toBeLessThanOrEqual(9);
    });
  });

  describe('sanitizeCodeSegment', () => {
    test('cleans accents and special characters and normalizes length', () => {
      expect(sanitizeCodeSegment('Logitech', 3)).toBe('LOG');
      expect(sanitizeCodeSegment('BOSCH & Co.', 3)).toBe('BOS');
      expect(sanitizeCodeSegment('Café Puro', 3)).toBe('CAF');
      expect(sanitizeCodeSegment('', 3)).toBe('GEN');
      expect(sanitizeCodeSegment(null, 3)).toBe('GEN');
    });
  });

  describe('detectSubfamily', () => {
    test('detects correct subfamily based on product name keywords', () => {
      expect(detectSubfamily('Laptop Gaming HP Pavilion', 'TEC')).toBe('LAP');
      expect(detectSubfamily('Mouse Inalámbrico Logitech', 'TEC')).toBe('PER');
      expect(detectSubfamily('Monitor 24 pulgadas IPS', 'TEC')).toBe('DIS');
      expect(detectSubfamily('Taladro Percutor DeWalt', 'FER')).toBe('HER');
      expect(detectSubfamily('Tornillo Hexagonal 3/8', 'FER')).toBe('TOR');
      expect(detectSubfamily('Arroz Grano Entero 1kg', 'ALI')).toBe('GRA');
      expect(detectSubfamily('Jugo de Naranja 1L', 'ALI')).toBe('BEB');
    });

    test('falls back to first subfamily or VAR if keywords not matched', () => {
      expect(detectSubfamily('Artilugio Desconocido', 'GEN')).toBe('VAR');
    });
  });

  describe('generateTaxonomicSku', () => {
    test('generates standard SKU format [FAM]-[SUB]-[BRA]-[SEQ]', () => {
      const sku = generateTaxonomicSku({
        categoryId: 1, // TEC
        productName: 'Laptop Core i7',
        brand: 'Dell',
        sequentialId: 1
      });
      expect(sku).toBe('TEC-LAP-DEL-001');
    });

    test('handles brand with spaces and special characters for Ferretería', () => {
      const sku = generateTaxonomicSku({
        categoryId: 2, // FER
        productName: 'Taladro inalámbrico',
        brand: 'Black & Decker',
        sequentialId: 15
      });
      expect(sku).toBe('FER-HER-BLA-015');
    });

    test('uses fallback values gracefully when fields are empty', () => {
      const sku = generateTaxonomicSku({
        categoryId: 8, // GEN
        productName: '',
        brand: '',
        sequentialId: null
      });
      expect(sku).toBe('GEN-VAR-GEN-001');
    });
  });

  describe('generateTaxonomicBarcode (EAN-13 GS1 Compliant)', () => {
    test('generates valid 13-digit EAN barcode starting with 744101', () => {
      const barcode = generateTaxonomicBarcode({ categoryId: 1, sequentialId: 1 });
      expect(barcode).toHaveLength(13);
      expect(barcode.startsWith('744101')).toBe(true);
      expect(/^\d{13}$/.test(barcode)).toBe(true);

      // Verify the check digit is mathematically correct
      const payload12 = barcode.slice(0, 12);
      const checkDigit = parseInt(barcode.slice(12), 10);
      expect(calculateEan13CheckDigit(payload12)).toBe(checkDigit);
    });

    test('generates barcode for Ferretería category (digit 2)', () => {
      const barcode = generateTaxonomicBarcode({ categoryId: 2, sequentialId: 42 });
      expect(barcode.startsWith('744101200042')).toBe(true);
      expect(barcode).toHaveLength(13);
    });
  });

  describe('parseSkuTaxonomy', () => {
    test('parses standardized 4-part SKU accurately', () => {
      const parsed = parseSkuTaxonomy('TEC-LAP-HP-001');
      expect(parsed.valid).toBe(true);
      expect(parsed.family).toBe('TEC');
      expect(parsed.familyName).toBe('Tecnología y Electrónica');
      expect(parsed.subfamily).toBe('LAP');
      expect(parsed.subfamilyName).toBe('Laptops y Cómputo Portátil');
      expect(parsed.brand).toBe('HP');
      expect(parsed.sequence).toBe('001');
      expect(parsed.hsCodePrefix).toBe('8471');
    });

    test('handles legacy or non-standard SKU gracefully', () => {
      const parsed = parseSkuTaxonomy('CUSTOM_OLD_99');
      expect(parsed.valid).toBe(false);
      expect(parsed.family).toBe('GEN');
      expect(parsed.subfamily).toBe('VAR');
    });
  });

  describe('Master Taxonomy Dictionary Integrity', () => {
    test('contains all 8 standard product families with subfamilies and HS codes', () => {
      const expectedFamilies = ['TEC', 'FER', 'ALI', 'FAR', 'OFI', 'TEX', 'AUT', 'GEN'];
      expectedFamilies.forEach(code => {
        expect(TAXONOMY_FAMILIES[code]).toBeDefined();
        expect(TAXONOMY_FAMILIES[code].name).toBeTruthy();
        expect(TAXONOMY_FAMILIES[code].id).toBeDefined();
        expect(TAXONOMY_FAMILIES[code].hsCodePrefix).toBeTruthy();
        expect(Object.keys(TAXONOMY_FAMILIES[code].subfamilies).length).toBeGreaterThan(0);
      });
    });
  });
});
