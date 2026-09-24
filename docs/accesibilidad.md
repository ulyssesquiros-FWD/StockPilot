# Accesibilidad y Experiencia Inclusiva en StockPilot

StockPilot fue desarrollado con un enfoque prioritario en la accesibilidad web (WCAG 2.1 AA), asegurando que cualquier usuario o evaluador pueda operar el sistema de manera eficiente y sin barreras.

---

## 1. Cuatro Prácticas Clave Implementadas

### Práctica 1: Tema Claro y Oscuro de Alto Contraste
- Selector global accesible desde el encabezado y desde la pantalla de configuración.
- Implementado a través del atributo `data-theme="light|dark"` en el elemento raíz `<html>`.
- Persistencia automática en el almacenamiento local bajo la clave `stockpilot_theme`.
- Paletas calibradas para garantizar ratios de contraste WCAG superiores a 4.5:1 para texto normal y 3:1 para elementos interactivos.

### Práctica 2: Escalado de Tamaño de Tipografía
- Tres niveles de tamaño de texto seleccionables:
  - **Normal (100%):** Cuerpo 14px, Encabezados hasta 32px.
  - **Grande (115%):** Cuerpo 16px, Encabezados hasta 36px (`.font-size-large`).
  - **Muy grande (130%):** Cuerpo 18px, Encabezados hasta 40px (`.font-size-xlarge`).
- La escala se aplica mediante variables CSS dinámicas, preservando la proporción visual sin generar desbordamientos en tablas ni colapso de componentes.
- Persistencia en `localStorage` con la clave `stockpilot_font_size`.

### Práctica 3: Soporte para Lectores de Pantalla y Navegación por Teclado
- Utilidad `.sr-only` para proveer contexto adicional a lectores de pantalla (por ejemplo, en campos de búsqueda e íconos).
- Región en vivo accesible: `<div id="sr-announcements" class="sr-only" aria-live="polite">` para anunciar cambios críticos de estado.
- Atributos semánticos:
  - `role="dialog"` y `aria-modal="true"` en modales con bloqueo de foco y cierre mediante la tecla `Escape`.
  - `role="tab"` y `aria-selected` en la navegación por pestañas.
  - `aria-invalid` y `aria-describedby` vinculados a los mensajes de error en formularios.
  - Enlace de salto inicial accesible con la tecla Tab: `<a href="#main-dashboard-content" class="skip-to-content">Saltar al contenido principal</a>`.
- Anillos de foco explícitos `:focus-visible` de 2px en color primario azul para asegurar la orientación visual al navegar con el teclado.

### Práctica 4: No Dependencia Exclusiva del Color
- **Regla inquebrantable:** Ningún estado operativo se comunica únicamente mediante colores.
- Cada insignia de estado (`StatusBadge`) combina **color de fondo/borde + icono semántico representativo + texto explícito en español**:
  - `✓ Activo` / `✓ Disponible`
  - `⚠ Stock bajo` / `⚠ Advertencia`
  - `✕ Agotado` / `✕ Crítico`
- Esto garantiza accesibilidad total para personas con daltonismo o baja visión cromática.
