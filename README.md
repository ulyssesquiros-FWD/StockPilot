# StockPilot — Tu inventario, en control.

> **Proyecto Final FWD Academy · Desarrollo Frontend con React**  
> Plataforma SaaS inteligente de gestión de inventarios, movimientos, compras, alertas automáticas y analítica con Inteligencia Artificial.

---

## 1. Acerca del Proyecto
**StockPilot** es una solución integral diseñada para optimizar las operaciones de almacenamiento y control de existencias en pequeñas y medianas empresas (PyMEs) de múltiples sectores comerciales (tecnología, ferreterías, alimentos, farmacias, tiendas textiles, talleres y distribuidoras).

La plataforma resuelve los desafíos cotidianos de desabastecimiento, sobrestock y falta de visibilidad financiera a través de:
- Control de catálogo multirubro con categorización y proveedores.
- Trazabilidad estricta de entradas, salidas, ajustes de conteo físico y devoluciones.
- Cálculo automático de estados de existencias y reglas anti-stock negativo.
- Disparo proactivo de alertas cuando los artículos caen bajo el stock mínimo o se agotan.
- Cuadro de mandos ejecutivo con KPIs financieros y visualizaciones interactivas en Recharts.
- Copiloto logístico **StockPilot IA** con soporte para n8n y motor determinista local.
- Integración en tiempo real con la base de datos pública global **Open Food Facts API v2** mediante código de barras.

---

## 2. Tecnologías Utilizadas

- **Núcleo:** React 19, JavaScript (ESM / JSX)
- **Empaquetador y Entorno:** Vite 8
- **Enrutamiento:** React Router DOM v7 (layouts anidados, rutas protegidas y control RBAC)
- **Backend Simulado:** JSON Server (`db.json` con usuarios, productos, categorías, proveedores, movimientos, alertas, ajustes y auditoría)
- **Visualización de Datos:** Recharts
- **Iconografía:** Lucide React
- **Estilos:** CSS3 Moderno (Custom Properties, modo claro/oscuro, diseño adaptativo a 375px, 768px y 1280px+)
- **Testing:** Jest, React Testing Library, JSDOM, Babel
- **Automatización y Flujos:** n8n Workflows
- **API Externa:** Open Food Facts REST API v2

---

## 3. Usuarios Demo para Evaluación

La aplicación cuenta con cuentas precargadas en `db.json` listas para probar los diferentes niveles de acceso:

| Rol | Correo Electrónico | Contraseña | Permisos y Alcance |
|---|---|---|---|
| 👑 **Administrador** | `admin@stockpilot.com` | `Admin123!` | Acceso total: Dashboard, Productos, Inventario, Movimientos, Proveedores, Alertas, Reportes, **Usuarios**, Configuración e IA. |
| 📦 **Encargado de Inventario** | `manager@stockpilot.com` | `Manager123!` | Operación completa de inventario, productos, movimientos, alertas y reportes. Sin acceso a usuarios. |
| 👤 **Empleado** | `employee@stockpilot.com` | `Employee123!` | Consulta de existencias, registro de movimientos, alertas e IA. Sin acceso a usuarios ni reportes analíticos. |

> *Nota:* En la pantalla de inicio de sesión (`/login`) se dispone además de una sección de acceso rápido con botones para autocompletar estas credenciales con un solo clic.

---

## 4. Instalación y Puesta en Marcha

### Prerrequisitos
- Node.js versión 18 o superior
- npm versión 9 o superior

### Paso 1: Clonar / Posicionarse en el repositorio e instalar dependencias
```bash
npm install
```

### Paso 2: Configuración de Variables de Entorno
Copia el archivo `.env.example` a `.env` (ya viene preconfigurado para entorno local):
```bash
# Windows PowerShell
copy .env.example .env
```
Contenido de `.env`:
```env
VITE_API_URL=http://localhost:3001
VITE_N8N_AI_WEBHOOK_URL=http://localhost:5678/webhook/stockpilot-ai
```

### Paso 3: Iniciar el Servidor de Datos (Terminal 1)
Inicia JSON Server en el puerto 3001:
```bash
npm run server
```

### Paso 4: Iniciar la Aplicación Frontend (Terminal 2)
Inicia el servidor de desarrollo de Vite:
```bash
npm run dev
```
Abre tu navegador en `http://localhost:5173` para ingresar a StockPilot.

---

## 5. Scripts de NPM Disponibles

| Comando | Acción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo local con Vite. |
| `npm run server` | Inicia JSON Server en el puerto 3001 sirviendo `db.json`. |
| `npm test` | Ejecuta las 6 suites de pruebas con Jest y React Testing Library. |
| `npm run test:watch` | Ejecuta Jest en modo observador continuo. |
| `npm run lint` | Ejecuta el análisis estático de código con linter. |
| `npm run build` | Genera el bundle de producción optimizado en la carpeta `dist/`. |
| `npm run preview` | Previsualiza localmente el build de producción generado. |

---

## 6. Arquitectura del Proyecto

```text
src/
├── assets/brand/          # Logotipos completos, isotipo, favicon y versiones claras/oscuras
├── components/
│   ├── layout/            # Sidebar drawer, Header sticky, MobileNavigation
│   └── ui/                # Button, Input, Select, DataTable, KpiCard, Modal, StatusBadge, etc.
├── context/               # AuthContext, ThemeContext, SettingsContext, NotificationContext
├── hooks/                 # useAuth, useTheme, useProducts, useInventory, useAlerts, useAI
├── layouts/               # AuthLayout (público), DashboardLayout (privado)
├── pages/
│   ├── auth/              # LoginPage, RegisterPage
│   ├── dashboard/         # DashboardPage
│   ├── products/          # ProductsListPage, ProductDetailPage, ProductFormPage
│   ├── categories/        # CategoriesPage
│   ├── inventory/         # InventoryPage
│   ├── movements/         # MovementsPage
│   ├── suppliers/         # SuppliersPage
│   ├── alerts/            # AlertsPage
│   ├── reports/           # ReportsPage
│   ├── users/             # UsersPage (Solo Admin)
│   ├── settings/          # SettingsPage
│   ├── ai/                # AIAssistantPage
│   └── NotFoundPage.jsx   # Pantalla 404
├── routes/                # AppRoutes, ProtectedRoute, RoleRoute, routeConfig
├── services/              # api.js, authService, productService, inventoryService, aiService, etc.
├── styles/                # variables.css, globals.css, responsive.css, accessibility.css
├── utils/                 # validators, permissions, formatters, inventoryCalculations
└── tests/                 # Suites de pruebas unitarias y de integración
```

---

## 7. Módulos y Funcionalidades Destacadas

### A. Productos y Consulta de Código de Barras (API Externa)
- Catálogo completo con buscador, filtros por categoría y estado de existencias, ordenamiento dinámico y paginación.
- **Integración Open Food Facts:** En el formulario de producto, al ingresar un código de barras internacional (ej. `7622210449283`), se consulta la API pública v2 en tiempo real y permite autocompletar la descripción, fabricante e imagen.

### B. Movimientos y Reglas de Inventario
- Registro de **Entradas**, **Salidas**, **Ajustes** y **Devoluciones**.
- **Cálculo atómico en vivo:** Muestra en pantalla el nuevo stock proyectado antes de confirmar.
- **Seguridad contable:** Impide de forma estricta cualquier salida que genere existencias negativas.

### C. Alertas de Suministro Automáticas
- Evaluación inmediata tras cada movimiento o edición de producto.
- Generación de estados: `critical` (Agotado, stock 0) y `warning` (Stock bajo, `stock <= minimumStock`).
- Acciones directas para reabastecer o marcar como resuelta.

### D. StockPilot IA y Automatizaciones n8n
- Asistente conversacional con System Prompt logístico especializado.
- **Fallback Determinista Local:** Si n8n no está ejecutándose, StockPilot IA analiza el inventario en memoria y genera recomendaciones precisas sin bloquear la interfaz.
- Tres flujos listos para importar ubicados en `n8n/`:
  - `01-registro-usuario.json`
  - `02-alerta-stock-bajo.json`
  - `03-asistente-ia.json`

### E. Accesibilidad (WCAG 2.1 AA)
1. **Modo Claro / Modo Oscuro** con persistencia en `stockpilot_theme`.
2. **Escalado Tipográfico** (Normal 100%, Grande 115%, Muy Grande 130%) en `stockpilot_font_size`.
3. **No dependencia exclusiva del color:** Todos los estados emplean triple indicador (color + icono + texto).
4. **Soporte de lectores de pantalla:** ARIA labels, roles de diálogo, alerts en vivo y skip link accesible por teclado (`Tab`).

---

## 8. Documentación Adicional

En la carpeta [`docs/`](file:///c:/Users/dell5/UQV/Proyecto%20Frontend/docs/README.md) se encuentran disponibles los manuales técnicos complementarios:
- [Arquitectura del Sistema](file:///c:/Users/dell5/UQV/Proyecto%20Frontend/docs/arquitectura.md)
- [Matriz de Roles y Permisos](file:///c:/Users/dell5/UQV/Proyecto%20Frontend/docs/roles-y-permisos.md)
- [Especificación de APIs y Endpoints](file:///c:/Users/dell5/UQV/Proyecto%20Frontend/docs/api.md)
- [Manual de StockPilot IA](file:///c:/Users/dell5/UQV/Proyecto%20Frontend/docs/ia.md)
- [Workflows de n8n](file:///c:/Users/dell5/UQV/Proyecto%20Frontend/docs/n8n.md)
- [Estrategia y Resultados de Pruebas](file:///c:/Users/dell5/UQV/Proyecto%20Frontend/docs/testing.md)
- [Directrices de Accesibilidad](file:///c:/Users/dell5/UQV/Proyecto%20Frontend/docs/accesibilidad.md)
- [Matriz de Trazabilidad de Rúbrica](file:///c:/Users/dell5/UQV/Proyecto%20Frontend/docs/checklist-rubrica.md)

---
© 2026 StockPilot Inc. Desarrollado con dedicación para FWD Academy.
