# Matriz de Trazabilidad y Cumplimiento de Rúbrica

| Requisito / Rubro | Implementación Técnica | Archivo / Ubicación en el Proyecto | Estado de Validación |
| :--- | :--- | :--- | :---: |
| **Framework Base** | React 19 + Vite 8 | `package.json`, `vite.config.js`, `main.jsx` | **Completo** (100%) |
| **Enrutamiento** | React Router DOM v7 con layouts anidados | `src/routes/AppRoutes.jsx`, `routeConfig.js` | **Completo** (100%) |
| **Protección de Rutas** | `ProtectedRoute` con persistencia en recarga | `src/routes/ProtectedRoute.jsx` | **Completo** (100%) |
| **Control de Roles (RBAC)**| `RoleRoute` y utilidades de autorización | `src/routes/RoleRoute.jsx`, `src/utils/permissions.js` | **Completo** (100%) |
| **Backend Simulado** | JSON Server en puerto 3001 con persistencia | `db.json`, `package.json` (`npm run server`) | **Completo** (100%) |
| **Capa de Servicios HTTP** | Cliente API desacoplado con timeouts y error handling | `src/services/api.js`, `authService.js`, `productService.js`, etc. | **Completo** (100%) |
| **Endpoint Externo Real** | Open Food Facts API v2 por código de barras | `src/services/externalService.js`, `ProductFormPage.jsx` | **Completo** (100%) |
| **Autenticación Completa** | Login, Registro, persistencia `stockpilot_session` | `src/pages/auth/LoginPage.jsx`, `RegisterPage.jsx` | **Completo** (100%) |
| **CRUD de Productos** | Crear, Leer, Editar, Eliminar con ConfirmDialog | `src/pages/products/*` | **Completo** (100%) |
| **CRUD de Categorías** | Gestión taxonómica con validación de dependencias | `src/pages/categories/CategoriesPage.jsx` | **Completo** (100%) |
| **CRUD de Proveedores** | Gestión de contactos comerciales y catálogo | `src/pages/suppliers/SuppliersPage.jsx` | **Completo** (100%) |
| **Gestión de Movimientos** | Entradas, Salidas, Ajustes, Devoluciones (sin stock negativo) | `src/pages/movements/MovementsPage.jsx` | **Completo** (100%) |
| **Alertas Automáticas** | Disparo automático si stock <= mínimo o stock === 0 | `src/services/alertService.js`, `AlertsPage.jsx` | **Completo** (100%) |
| **Dashboard y KPIs** | 4 KPIs, gráficos Recharts, actividad y alertas | `src/pages/dashboard/DashboardPage.jsx` | **Completo** (100%) |
| **Visualizaciones** | Recharts (BarChart, PieChart, Donut, Tooltips) | `src/components/ui/ChartCard.jsx`, `DashboardPage.jsx`, `ReportsPage.jsx` | **Completo** (100%) |
| **Informes y Exportación** | Reportes consolidados y exportación a CSV | `src/pages/reports/ReportsPage.jsx`, `reportService.js` | **Completo** (100%) |
| **Módulo de Usuarios** | CRUD administrativo con roles y estados | `src/pages/users/UsersPage.jsx` | **Completo** (100%) |
| **StockPilot IA** | Asistente conversacional contextualizado con inventario | `src/pages/ai/AIAssistantPage.jsx`, `aiService.js` | **Completo** (100%) |
| **Fallback de IA** | Motor determinista local si n8n no responde | `src/services/aiService.js` | **Completo** (100%) |
| **Flujos de n8n** | 3 Workflows documentados y listos para importar | `n8n/01-registro-usuario.json`, `02-alerta-stock-bajo.json`, `03-asistente-ia.json` | **Completo** (100%) |
| **Tema Claro / Oscuro** | Modo claro y oscuro con persistencia local | `src/context/ThemeContext.jsx`, `variables.css` | **Completo** (100%) |
| **Tamaño de Texto** | 3 niveles de tipografía accesibles | `src/styles/variables.css`, `SettingsPage.jsx` | **Completo** (100%) |
| **Accesibilidad WCAG** | Semántica, ARIA, foco visible, no solo color | `src/styles/accessibility.css`, `StatusBadge.jsx` | **Completo** (100%) |
| **Diseño Responsive** | Optimizado para 375px, 768px y 1280px+ (con drawer y mobile cards) | `src/styles/responsive.css`, `DataTable.jsx` | **Completo** (100%) |
| **Pruebas Unitarias** | 6 suites y 42 tests pasando con Jest y RTL | `src/tests/*`, `src/utils/inventoryCalculations.test.js` | **Completo** (100%) |
| **Linter y Build** | 0 errores en linter y empaquetado Vite limpio | `npm run lint`, `npm run build` | **Completo** (100%) |
