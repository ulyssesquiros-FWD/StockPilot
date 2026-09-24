# Integración de Inteligencia Artificial: StockPilot IA

## 1. Concepto y Objetivos
**StockPilot IA** actúa como el copiloto logístico senior para los encargados y administradores del inventario. No es un chatbot genérico: está profundamente contextualizado con los datos de existencias, puntos de reorden, flujo de salidas y alertas críticas del negocio.

---

## 2. Arquitectura de Integración

```text
[ React Frontend (AIAssistantPage) ]
                 ↓
      [ src/services/aiService.js ]
                 ↓
    [ n8n Webhook: POST /webhook/stockpilot-ai ]
                 ↓
  [ Nodo de Preparación de Contexto de Inventario ]
                 ↓
    [ Modelo LLM / Inferencia de Inventarios ]
                 ↓
 [ Respuesta Estructurada en Formato Markdown ]
                 ↓
[ Renderizado en Pantalla con Sugerencias y Formato ]
```

---

## 3. Funcionalidades Clave
1. **Resumen Inteligente del Inventario:** Síntesis del número de referencias, valoración monetaria en almacén y diagnóstico de salud operativa.
2. **Recomendación de Compra y Reabastecimiento:** Identificación prioritaria de productos agotados y artículos bajo el stock de seguridad, con sugerencias de pedidos consolidados por proveedor.
3. **Detección de Riesgo de Agotamiento:** Análisis predictivo de artículos con margen de seguridad menor a dos unidades respecto a su punto de reorden.
4. **Diagnóstico de Baja Rotación:** Detección de productos con stock elevado que no registran salidas en los movimientos recientes.
5. **Clasificación Automática:** Sugerencia de categorías óptimas para nuevas referencias que se incorporan al catálogo.
6. **Búsqueda y Consultas en Lenguaje Natural:** Capacidad de responder a preguntas libres sobre las existencias.

---

## 4. Estrategia de Fallback Controlado
Para garantizar que la demostración académica funcione al 100% incluso en entornos donde n8n no se encuentre levantado o se interrumpa la conectividad:
- El servicio `aiService.js` implementa un temporizador de 4 segundos hacia el webhook de n8n.
- En caso de inactividad o error de red, se activa automáticamente el **Motor Analítico Local StockPilot IA**.
- El motor local inspecciona el estado reactivo real del inventario (productos, movimientos y alertas) y genera respuestas analíticas deterministas de alta fidelidad, acompañadas por una insignia discreta que informa al usuario: *"Servicio n8n en espera. Ejecutando motor de inferencia local StockPilot IA"*.
- Con esto se evitan bloqueos, pantallas en blanco o loaders infinitos.
