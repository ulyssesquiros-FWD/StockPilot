/**
 * StockPilot Inventory Taxonomy & Coding Standard
 * Central engine for hierarchical product categorization, SKU generation,
 * barcode checksum calculation (EAN-13 / Code-128), and code breakdown.
 */

// Master Taxonomy Classification Dictionary
export const TAXONOMY_FAMILIES = {
  TEC: {
    id: 1,
    prefix: 'TEC',
    name: 'Tecnología y Electrónica',
    color: '#1E5AF2',
    icon: 'Laptop',
    hsCodePrefix: '8471', // HS Tariff Code reference
    subfamilies: {
      LAP: { prefix: 'LAP', name: 'Laptops y Cómputo Portátil', keywords: ['laptop', 'notebook', 'portatil', 'probook', 'thinkpad', 'macbook'] },
      PER: { prefix: 'PER', name: 'Periféricos y Accesorios', keywords: ['mouse', 'teclado', 'keyboard', 'webcam', 'camara', 'pad', 'hub'] },
      DIS: { prefix: 'DIS', name: 'Monitores y Pantallas', keywords: ['monitor', 'pantalla', 'display', 'oled', 'ips', 'tv'] },
      AUD: { prefix: 'AUD', name: 'Audio y Sonido', keywords: ['audifonos', 'auriculares', 'headset', 'parlante', 'speaker', 'microfono'] },
      RED: { prefix: 'RED', name: 'Redes y Conectividad', keywords: ['router', 'switch', 'cable', 'ethernet', 'wifi', 'access point'] },
      ENE: { prefix: 'ENE', name: 'Energía y Respaldo', keywords: ['ups', 'bateria', 'cargador', 'regulador', 'inversor', 'power'] },
      ALM: { prefix: 'ALM', name: 'Almacenamiento Digital', keywords: ['ssd', 'disco', 'hdd', 'nvme', 'usb', 'memoria', 'sd'] }
    }
  },
  FER: {
    id: 2,
    prefix: 'FER',
    name: 'Ferretería y Construcción',
    color: '#F59E0B',
    icon: 'Hammer',
    hsCodePrefix: '8205',
    subfamilies: {
      HER: { prefix: 'HER', name: 'Herramientas Eléctricas y Manuales', keywords: ['taladro', 'rotomartillo', 'destornillador', 'martillo', 'sierra', 'pulidora', 'llave', 'pinza'] },
      TOR: { prefix: 'TOR', name: 'Tornillería y Fijaciones', keywords: ['tornillo', 'tuerca', 'arandela', 'clavo', 'perno', 'anclaje', 'taquete'] },
      SEG: { prefix: 'SEG', name: 'Protección y Seguridad (EPP)', keywords: ['casco', 'guantes', 'gafas', 'lentes', 'arnes', 'mascarilla', 'careta'] },
      ELE: { prefix: 'ELE', name: 'Material Eléctrico e Iluminación', keywords: ['cable', 'foco', 'lampara', 'tomacorriente', 'interruptor', 'breaker'] },
      PIN: { prefix: 'PIN', name: 'Pinturas y Acabados', keywords: ['pintura', 'brocha', 'rodillo', 'silicon', 'sellador', 'thinner'] }
    }
  },
  ALI: {
    id: 3,
    prefix: 'ALI',
    name: 'Alimentos y Bebidas',
    color: '#10B981',
    icon: 'Coffee',
    hsCodePrefix: '2101',
    subfamilies: {
      BEB: { prefix: 'BEB', name: 'Bebidas, Café e Infusiones', keywords: ['cafe', 'te', 'agua', 'jugo', 'refresco', 'soda', 'bebida'] },
      GRA: { prefix: 'GRA', name: 'Granos, Cereales y Semillas', keywords: ['arroz', 'frijol', 'avena', 'cereal', 'maiz', 'trigo', 'semilla'] },
      ABA: { prefix: 'ABA', name: 'Abarrotes y Despensa', keywords: ['aceite', 'azucar', 'sal', 'harina', 'pasta', 'salsa', 'atun'] },
      LAC: { prefix: 'LAC', name: 'Lácteos y Derivados', keywords: ['leche', 'queso', 'yogurt', 'mantequilla', 'crema'] },
      CON: { prefix: 'CON', name: 'Snacks y Confitería', keywords: ['galleta', 'chocolate', 'snack', 'papas', 'caramelo'] }
    }
  },
  FAR: {
    id: 4,
    prefix: 'FAR',
    name: 'Farmacia y Salud',
    color: '#EF4444',
    icon: 'HeartPulse',
    hsCodePrefix: '3004',
    subfamilies: {
      MED: { prefix: 'MED', name: 'Medicamentos Básicos', keywords: ['analgesico', 'acetaminofen', 'ibuprofeno', 'antigripal', 'pastilla', 'jarabe'] },
      BOT: { prefix: 'BOT', name: 'Botiquín y Primeros Auxilios', keywords: ['venda', 'gasa', 'curita', 'algodon', 'alcohol', 'termo', 'botiquin'] },
      SAN: { prefix: 'SAN', name: 'Sanitización y Desinfección', keywords: ['sanitizante', 'desinfectante', 'jabon', 'gel', 'cloro', 'toalla'] },
      EQU: { prefix: 'EQU', name: 'Equipo de Diagnóstico', keywords: ['tensiometro', 'oximetro', 'termometro', 'glucometro'] }
    }
  },
  OFI: {
    id: 5,
    prefix: 'OFI',
    name: 'Oficina y Papelería',
    color: '#8B5CF6',
    icon: 'Paperclip',
    hsCodePrefix: '4802',
    subfamilies: {
      PAP: { prefix: 'PAP', name: 'Papel, Resmas y Cuadernos', keywords: ['papel', 'resma', 'cuaderno', 'libreta', 'agenda', 'sobre', 'folder'] },
      TON: { prefix: 'TON', name: 'Tóneres, Tintas y Consumibles', keywords: ['toner', 'cartucho', 'tinta', 'cinta', 'drum'] },
      ESC: { prefix: 'ESC', name: 'Instrumentos de Escritura', keywords: ['boligrafo', 'pluma', 'marcador', 'lapiz', 'resaltador', 'corrector'] },
      ARC: { prefix: 'ARC', name: 'Archivo y Organización', keywords: ['archivador', 'carpeta', 'grapa', 'engrapadora', 'clip', 'tijera'] }
    }
  },
  TEX: {
    id: 6,
    prefix: 'TEX',
    name: 'Textil y Uniformes',
    color: '#EC4899',
    icon: 'Shirt',
    hsCodePrefix: '6203',
    subfamilies: {
      UNI: { prefix: 'UNI', name: 'Uniformes Corporativos', keywords: ['camisa', 'playera', 'pantalon', 'bata', 'mandil', 'chaleco'] },
      CAL: { prefix: 'CAL', name: 'Calzado de Trabajo', keywords: ['bota', 'zapato', 'calzado', 'tenis', 'suela'] },
      PRO: { prefix: 'PRO', name: 'Prendas Especiales y Térmicas', keywords: ['impermeable', 'chamarra', 'termico', 'overol'] }
    }
  },
  AUT: {
    id: 7,
    prefix: 'AUT',
    name: 'Repuestos Automotrices',
    color: '#64748B',
    icon: 'Wrench',
    hsCodePrefix: '8708',
    subfamilies: {
      FIL: { prefix: 'FIL', name: 'Filtros y Mantenimiento', keywords: ['filtro', 'aceite', 'aire', 'combustible', 'cabina'] },
      LUB: { prefix: 'LUB', name: 'Lubricantes y Fluidos', keywords: ['lubricante', 'grasa', 'liquido', 'refrigerante', 'frenos'] },
      ELE: { prefix: 'ELE', name: 'Electricidad y Encendido', keywords: ['bujia', 'alternador', 'bateria', 'faro', 'fusible'] }
    }
  },
  GEN: {
    id: 8,
    prefix: 'GEN',
    name: 'General y Varios',
    color: '#6B7280',
    icon: 'Box',
    hsCodePrefix: '9999',
    subfamilies: {
      VAR: { prefix: 'VAR', name: 'Artículos Varios', keywords: [] },
      EMB: { prefix: 'EMB', name: 'Material de Embalaje', keywords: ['caja', 'cinta', 'burbuja', 'plastico', 'stretch'] }
    }
  }
};

/**
 * Clean and normalize a string into an uppercase ASCII alphanumeric code
 */
export function sanitizeCodeSegment(text, maxLength = 3) {
  if (!text) return 'GEN';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .substring(0, maxLength);
}

/**
 * Intelligent detector for subfamilies based on product name keywords
 */
export function detectSubfamily(productName = '', familyPrefix = 'GEN') {
  const family = TAXONOMY_FAMILIES[familyPrefix] || TAXONOMY_FAMILIES.GEN;
  const nameLower = (productName || '').toLowerCase();
  const words = nameLower.split(/[\s,._\-\/]+/);

  for (const [subPrefix, subData] of Object.entries(family.subfamilies)) {
    if (
      subData.keywords &&
      subData.keywords.some(kw => {
        const kwLower = kw.toLowerCase();
        if (kwLower.length <= 3) {
          return words.includes(kwLower);
        }
        return nameLower.includes(kwLower);
      })
    ) {
      return subPrefix;
    }
  }

  // Default to first subfamily of family or 'VAR'
  const firstSub = Object.keys(family.subfamilies)[0];
  return firstSub || 'VAR';
}

/**
 * Map category ID to its taxonomic family
 */
export function getFamilyByCategoryId(categoryId) {
  const idNum = Number(categoryId);
  const found = Object.values(TAXONOMY_FAMILIES).find(f => f.id === idNum);
  return found || TAXONOMY_FAMILIES.GEN;
}

/**
 * Generate a standard taxonomic SKU code
 * Format: [FAMILIA]-[SUBFAMILIA]-[MARCA/MODELO]-[SECUENCIAL]
 * Example: TEC-LAP-HP-001
 */
export function generateTaxonomicSku({
  categoryId = 1,
  productName = '',
  brand = '',
  sequentialId = 1,
  subfamilyCode = null
}) {
  const family = getFamilyByCategoryId(categoryId);
  const familyPrefix = family.prefix;

  const subPrefix = subfamilyCode || detectSubfamily(productName, familyPrefix);
  const brandSegment = brand ? sanitizeCodeSegment(brand, 3) : sanitizeCodeSegment(productName, 3);
  const seqSegment = String(sequentialId || 1).padStart(3, '0');

  return `${familyPrefix}-${subPrefix}-${brandSegment}-${seqSegment}`;
}

/**
 * Calculate EAN-13 check digit (Mod 10 with weights 1 and 3)
 */
export function calculateEan13CheckDigit(first12Digits) {
  const digits = String(first12Digits).padStart(12, '0').slice(0, 12).split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += i % 2 === 0 ? digits[i] * 1 : digits[i] * 3;
  }
  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

/**
 * Generate an official EAN-13 barcode based on Costa Rica prefix (744) + StockPilot (101) + Family + Sequence
 */
export function generateTaxonomicBarcode({ categoryId = 1, sequentialId = 1 }) {
  const countryPrefix = '744'; // GS1 Costa Rica
  const companyPrefix = '101'; // StockPilot Company Code
  const catDigit = String(categoryId || 1).slice(-1);
  const seq5 = String(sequentialId || 1).padStart(5, '0');

  const first12 = `${countryPrefix}${companyPrefix}${catDigit}${seq5}`;
  const checkDigit = calculateEan13CheckDigit(first12);
  return `${first12}${checkDigit}`;
}

/**
 * Parse and decode an existing SKU into its taxonomy components
 */
export function parseSkuTaxonomy(sku = '') {
  if (!sku || typeof sku !== 'string') {
    return { valid: false, message: 'SKU no especificado' };
  }

  const parts = sku.trim().toUpperCase().split('-');
  if (parts.length < 3) {
    return {
      valid: false,
      sku,
      family: 'GEN',
      familyName: 'General',
      subfamily: 'VAR',
      subfamilyName: 'Artículos Varios',
      brand: 'GEN',
      sequence: '001',
      formattedText: `${sku} (Formato legado no taxonómico)`
    };
  }

  const [famPrefix, subPrefix, brandPart, seqPart] = parts;
  const family = TAXONOMY_FAMILIES[famPrefix] || TAXONOMY_FAMILIES.GEN;
  const subfamily = family.subfamilies?.[subPrefix] || { prefix: subPrefix, name: subPrefix };

  return {
    valid: Boolean(TAXONOMY_FAMILIES[famPrefix]),
    sku,
    family: famPrefix,
    familyName: family.name,
    familyColor: family.color,
    subfamily: subPrefix,
    subfamilyName: subfamily.name,
    brand: brandPart || 'GEN',
    sequence: seqPart || '001',
    hsCodePrefix: family.hsCodePrefix,
    formattedText: `${family.name} > ${subfamily.name} > ${brandPart || 'Sin marca'}`
  };
}

export default {
  TAXONOMY_FAMILIES,
  generateTaxonomicSku,
  generateTaxonomicBarcode,
  detectSubfamily,
  parseSkuTaxonomy,
  getFamilyByCategoryId,
  calculateEan13CheckDigit
};
