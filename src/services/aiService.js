/**
 * StockPilot AI Service
 * Connects to n8n webhook workflow with an intelligent local deterministic fallback
 * so the academic demonstration never hangs or breaks if n8n is offline.
 */

const N8N_AI_WEBHOOK =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_N8N_AI_WEBHOOK_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.VITE_N8N_AI_WEBHOOK_URL) ||
  'http://localhost:5678/webhook/stockpilot-ai';

export const aiService = {
  /**
   * Send a query to the AI assistant with full inventory context
   */
  async askAssistant(prompt, context = {}) {
    const { products = [], movements = [], alerts = [] } = context;

    // Try n8n webhook first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

      const response = await fetch(N8N_AI_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context: { products, movements, alerts } }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return {
          source: 'n8n_webhook',
          response: data.response || data.text || JSON.stringify(data),
          timestamp: new Date().toISOString()
        };
      }
    } catch {
      // Fallback is activated below
    }

    // Controlled deterministic AI fallback for seamless demo
    return {
      source: 'local_engine',
      response: this.generateLocalIntelligence(prompt, { products, movements, alerts }),
      timestamp: new Date().toISOString(),
      fallbackNote: 'Servicio n8n en espera. Ejecutando motor de inferencia local StockPilot IA.'
    };
  },

  /**
   * Deterministic inference engine based on real store state
   */
  generateLocalIntelligence(prompt, { products, movements, alerts }) {
    const q = (prompt || '').toLowerCase();

    const outOfStock = products.filter(p => Number(p.stock) <= 0);
    const lowStock = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= Number(p.minimumStock));
    const totalValue = products.reduce((acc, p) => acc + (Number(p.stock) * Number(p.purchasePrice)), 0);

    // 1. Recomendación de reabastecimiento / compras
    if (q.includes('reabastecer') || q.includes('compra') || q.includes('pedir') || q.includes('pedido')) {
      const topPriority = [...outOfStock, ...lowStock];
      if (topPriority.length === 0) {
        return `✅ **Excelente estado de inventario**\n\nTodos los productos se encuentran por encima de sus existencias mínimas. No se requiere emitir órdenes de compra inmediatas en este ciclo.`;
      }

      const itemsList = topPriority
        .slice(0, 6)
        .map(
          p =>
            `• **${p.name}** (SKU: \`${p.sku}\`) — Stock actual: **${p.stock}** | Mínimo: **${p.minimumStock}** | Estado: *${p.stock <= 0 ? '🔴 Agotado' : '🟡 Stock Bajo'}*`
        )
        .join('\n');

      return `📦 **Recomendaciones de Reabastecimiento Prioritarias - StockPilot IA**\n\nSe detectaron **${outOfStock.length} productos agotados** y **${lowStock.length} en umbral bajo**:\n\n${itemsList}\n\n💡 **Acción Sugerida:** Contactar a los distribuidores directos para emitir órdenes de compra agrupadas y reducir fletes logísticos.`;
    }

    // 2. Riesgo de agotamiento
    if (q.includes('riesgo') || q.includes('agotarse') || q.includes('próximamente')) {
      const atRisk = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= Number(p.minimumStock) + 2);
      if (atRisk.length === 0) {
        return `🛡️ **Sin riesgo inminente de agotamiento**\n\nLos niveles de stock mantienen un margen seguro por encima de la demanda proyectada.`;
      }

      const list = atRisk.slice(0, 5).map(p => `• **${p.name}**: ${p.stock} unidades disponibles (mínimo de seguridad: ${p.minimumStock})`).join('\n');

      return `⚠️ **Productos en Riesgo Inminente de Agotamiento**\n\nLos siguientes artículos tienen un margen de seguridad inferior a 2 unidades respecto a su punto de reorden:\n\n${list}\n\nRecomendamos anticipar el pedido antes del próximo ciclo de facturación.`;
    }

    // 3. Baja rotación
    if (q.includes('baja rotación') || q.includes('rotacion') || q.includes('estancado') || q.includes('lento')) {
      // Find products without recent exits in movements
      const exitProductIds = new Set(movements.filter(m => m.type === 'EXIT').map(m => m.productId));
      const lowTurnover = products.filter(p => Number(p.stock) > 10 && !exitProductIds.has(p.id));

      if (lowTurnover.length === 0) {
        return `🔄 **Flujo de Rotación Equilibrado**\n\nNo se detectan artículos con sobrestock o inactividad prolongada en las salidas recientes. El inventario rota según lo previsto.`;
      }

      const list = lowTurnover.map(p => `• **${p.name}** (${p.stock} unidades en existencia)`).join('\n');
      return `📉 **Diagnóstico de Baja Rotación**\n\nSe identificaron productos con inventario elevado y bajo registro de salidas:\n\n${list}\n\n💡 **Estrategia sugerida:** Diseñar paquetes promocionales o reubicarlos en zonas de mayor visibilidad en el punto de venta.`;
    }

    // 4. Clasificación inteligente
    if (q.includes('clasifica') || q.includes('categoría') || q.includes('clasificar')) {
      return `🏷️ **Clasificador Inteligente de Referencias StockPilot**\n\nPara clasificar un nuevo ítem, ingrese su nombre y características. Las categorías sugeridas en el sistema son:\n• **Tecnología y Electrónica** (cables, periféricos, equipos)\n• **Ferretería y Construcción** (herramientas, tornillería, EPP)\n• **Alimentos y Bebidas** (granos, abarrotes, insumos de cafetería)\n• **Farmacia y Salud** (botiquines, sanitizantes)\n• **Oficina y Papelería** (tóneres, papel, consumibles)`;
    }

    // 5. Resumen general / salud del inventario
    return `📊 **Resumen Ejecutivo del Inventario - StockPilot IA**\n\n• **Catálogo Activo:** ${products.length} productos registrados.\n• **Valor Patrimonial:** $${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD.\n• **Referencias Agotadas:** ${outOfStock.length} producto(s).\n• **Referencias en Stock Bajo:** ${lowStock.length} producto(s).\n• **Alertas Pendientes:** ${alerts.filter(a => a.status !== 'resolved').length} incidencia(s) activa(s).\n\n📌 **Conclusión del Asistente:** El inventario se encuentra operativo, pero requiere reposición focalizada en los artículos críticos para garantizar la satisfacción de la demanda.`;
  }
};

export default aiService;
