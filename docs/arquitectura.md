# Arquitectura del Sistema StockPilot

## 1. Visión General
**StockPilot** ("Tu inventario, en control") es una plataforma web tipo Software as a Service (SaaS) construida sobre **React 19** y empaquetada con **Vite**, orientada a pequeñas y medianas empresas de diversos sectores (tecnología, retail, ferretería, farmacia, alimentos, etc.).

La arquitectura sigue una separación estricta de responsabilidades en capas desacopladas:

```
[ Capa de Presentación: Pages & Layouts ]
                 ↓
[ Capa de Componentes UI & Estado Reutilizable ]
                 ↓
[ Capa de Contextos Globales & Custom Hooks ]
                 ↓
[ Capa de Lógica de Negocio & Cálculos (/utils) ]
                 ↓
[ Capa de Servicios & Abstracción HTTP (/services) ]
                 ↓
[ Capa de Persistencia: JSON Server / APIs Externas / n8n Webhook ]
```

---

## 2. Estructura de Directorios

```text
src/
├── assets/
│   └── brand/               # Logotipos completos, isotipos, favicon y SVG
├── components/
│   ├── layout/              # Sidebar drawer, Header sticky, MobileNavigation
│   └── ui/                  # Componentes base: Button, Input, Select, DataTable, KpiCard, Modal, StatusBadge, etc.
├── context/
│   ├── AuthContext.jsx      # Sesión de usuario persistente y RBAC
│   ├── ThemeContext.jsx     # Modo claro/oscuro y tamaño de tipografía
│   ├── SettingsContext.jsx  # Configuración global y parámetros de inventario
│   └── NotificationContext.jsx # Sistema accesible de toasts y avisos
├── hooks/
│   ├── useAuth.js           # Acceso rápido a sesión y permisos
│   ├── useTheme.js          # Control de temas visuales
│   ├── useProducts.js       # Estado y operaciones CRUD de productos
│   ├── useInventory.js      # Métricas y actualización en vivo del dashboard
│   ├── useAlerts.js         # Monitoreo de alertas y resolución
│   └── useAI.js             # Conversaciones con el Asistente StockPilot IA
├── layouts/
│   ├── AuthLayout.jsx       # Layout publico para Login y Registro con hero corporativo
│   └── DashboardLayout.jsx  # Layout privado con Sidebar responsive, Header y bottom bar
├── pages/
│   ├── auth/                # LoginPage, RegisterPage
│   ├── dashboard/           # DashboardPage con KPIs y Recharts
│   ├── products/            # ProductsListPage, ProductDetailPage, ProductFormPage
│   ├── categories/          # CategoriesPage con conteo dinámico
│   ├── inventory/           # InventoryPage con pestañas de estado y exportación CSV
│   ├── movements/           # MovementsPage con cálculo en vivo de impacto en stock
│   ├── suppliers/           # SuppliersPage con CRUD y validación de relaciones
│   ├── alerts/              # AlertsPage con filtros y disparo automático
│   ├── reports/             # ReportsPage con gráficas y exportador CSV
│   ├── users/               # UsersPage (Acceso restringido a Administradores)
│   ├── settings/            # SettingsPage con tabs de perfil, empresa y accesibilidad
│   ├── ai/                  # AIAssistantPage con chat interactivo
│   └── NotFoundPage.jsx     # Página 404 personalizada con marca
├── routes/
│   ├── AppRoutes.jsx        # Árbol central de rutas y redirecciones
│   ├── ProtectedRoute.jsx   # Guardián de autenticación y cuentas activas
│   ├── RoleRoute.jsx        # Guardián de permisos basados en rol
│   └── routeConfig.js       # Constantes normalizadas de paths
├── services/
│   ├── api.js               # Cliente HTTP fetch con timeouts y normalización de errores
│   ├── authService.js       # Autenticación, sesión en localStorage y auditoría
│   ├── productService.js    # CRUD de productos y auto-disparo de alertas
│   ├── categoryService.js   # Gestión de categorías
│   ├── inventoryService.js  # Agregaciones de métricas en tiempo real
│   ├── movementService.js   # Control atómico de entradas/salidas sin stock negativo
│   ├── supplierService.js   # Gestión de proveedores
│   ├── alertService.js      # Evaluación y ciclo de vida de alertas
│   ├── reportService.js     # Consolidación de datos y exportación CSV nativa
│   ├── userService.js       # Gestión administrativa de usuarios
│   ├── aiService.js         # Cliente webhook n8n + motor determinista local
│   └── externalService.js   # Conexión en vivo con Open Food Facts API v2
├── styles/
│   ├── variables.css        # Tokens de diseño, colores de marca y tipografías
│   ├── globals.css          # Estilos globales, reseteo, tablas y componentes
│   ├── responsive.css       # Media queries adaptativas (375px, 768px, 1280px+)
│   └── accessibility.css    # Anillos de enfoque, sr-only y soporte de movimiento reducido
└── utils/
    ├── validators.js        # Validaciones de formatos, contraseñas y existencias
    ├── permissions.js       # Matriz RBAC de acciones y rutas
    ├── formatters.js        # Formato de moneda (USD), fechas y tipos de movimiento
    ├── inventoryCalculations.js # Motor matemático de inventario (testeado al 100%)
    └── accessibility.js     # Aplicación dinámica de temas y tamaño de fuentes
```

---

## 3. Flujo de Datos y Estado Global
1. **Context API**: Se utiliza como el backbone reactivo de la aplicación para evitar "prop drilling" excesivo en sesión, temas, configuración y notificaciones.
2. **HTTP Service Layer**: Ningún componente o página realiza `fetch` directo; todas las peticiones pasan a través de `src/services/api.js` garantizando captura homogénea de códigos de estado HTTP (400, 401, 403, 404, 500 y errores de red).
3. **Auditoría Transversal**: Las mutaciones en servicios (crear/editar producto, movimiento, usuario, proveedor) registran de forma automática eventos en la colección `/activities` de JSON Server.
