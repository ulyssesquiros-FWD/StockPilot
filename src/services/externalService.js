/**
 * External Service - Integrates real external Open Food Facts public API
 * Used for barcode lookups and automatic product metadata population.
 */

export const externalService = {
  /**
   * Look up product details by barcode in Open Food Facts database
   * @param {string} barcode
   * @returns {Promise<{ found: boolean, data?: object, message?: string }>}
   */
  async lookupBarcode(barcode) {
    if (!barcode || !barcode.trim()) {
      throw new Error('Debe proporcionar un código de barras válido.');
    }

    const cleanBarcode = barcode.trim();
    const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(cleanBarcode)}.json`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'StockPilot - Frontend Academy Project - Version 1.0'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            found: false,
            message: `No se encontró información en la base externa para el código ${cleanBarcode}. Puede completar los datos manualmente.`
          };
        }
        throw new Error(`El servicio externo respondió con estado ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 1 && result.product) {
        const p = result.product;
        return {
          found: true,
          data: {
            name: p.product_name || p.product_name_es || p.product_name_en || 'Producto importado',
            brand: p.brands || 'Sin marca',
            description: p.generic_name || p.categories || 'Producto obtenido desde Open Food Facts.',
            image: p.image_url || p.image_front_url || '',
            barcode: cleanBarcode,
            source: 'Open Food Facts API v2'
          },
          message: 'Información del producto encontrada exitosamente en la base de datos global.'
        };
      } else {
        return {
          found: false,
          message: `El código ${cleanBarcode} no se encuentra en el catálogo global de Open Food Facts. Puede continuar con el registro manual.`
        };
      }
    } catch (err) {
      if (err.message && err.message.includes('Debe proporcionar')) {
        throw err;
      }
      return {
        found: false,
        message: 'No fue posible consultar el servicio externo en este momento. Puede registrar el producto de forma manual.'
      };
    }
  }
};

export default externalService;
