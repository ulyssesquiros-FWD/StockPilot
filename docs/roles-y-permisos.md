# Matriz de Roles y Permisos (RBAC)

En StockPilot la autorización se basa en roles persistidos en el backend (`db.json`) y validados tanto a nivel de enrutador (`RoleRoute.jsx`) como en los componentes visuales mediante utilidades funcionales en `src/utils/permissions.js`.

---

## 1. Definición de Roles

| Rol | Identificador | Descripción |
|---|---|---|
| **Administrador** | `admin` | Acceso irrestricto a todos los módulos, gestión de usuarios, auditoría, configuración y operaciones de eliminación. |
| **Encargado de Inventario** | `manager` | Control operativo pleno de productos, categorías, proveedores, movimientos, alertas y reportes. Sin acceso al módulo de usuarios. |
| **Empleado** | `employee` | Operación diaria: consulta de existencias, registro de movimientos de entrada/salida y consulta de alertas/IA. Sin acceso a usuarios ni reportes analíticos. |

---

## 2. Matriz de Acceso a Rutas

| Ruta | Nombre del Módulo | Administrador | Encargado | Empleado |
|---|---|:---:|:---:|:---:|
| `/dashboard` | Panel de Control | ✅ | ✅ | ✅ |
| `/productos` | Catálogo de Productos | ✅ | ✅ | ✅ |
| `/productos/nuevo` | Creación de Producto | ✅ | ✅ | ❌ |
| `/productos/:id` | Detalle del Producto | ✅ | ✅ | ✅ |
| `/productos/:id/editar` | Edición de Producto | ✅ | ✅ | ❌ |
| `/categorias` | Categorías de Catálogo | ✅ | ✅ | ❌ |
| `/inventario` | Control de Existencias | ✅ | ✅ | ✅ |
| `/movimientos` | Registro de Movimientos | ✅ | ✅ | ✅ |
| `/proveedores` | Directorio Proveedores | ✅ | ✅ | ❌ |
| `/alertas` | Alertas de Stock | ✅ | ✅ | ✅ |
| `/reportes` | Informes y Analítica | ✅ | ✅ | ❌ |
| `/usuarios` | Gestión de Usuarios | ✅ | ❌ | ❌ |
| `/configuracion` | Configuración | ✅ | ✅ | ✅ |
| `/asistente-ia` | StockPilot IA | ✅ | ✅ | ✅ |

---

## 3. Matriz de Permisos por Acción

| Recurso | Acción | Administrador | Encargado | Empleado |
|---|---|:---:|:---:|:---:|
| **Productos** | Crear / Editar | ✅ | ✅ | ❌ |
| **Productos** | Eliminar | ✅ | ✅ | ❌ |
| **Categorías** | Crear / Editar | ✅ | ✅ | ❌ |
| **Categorías** | Eliminar | ✅ | ❌ | ❌ |
| **Proveedores**| Crear / Editar | ✅ | ✅ | ❌ |
| **Proveedores**| Eliminar | ✅ | ❌ | ❌ |
| **Movimientos**| Registrar Entrada/Salida | ✅ | ✅ | ✅ |
| **Usuarios**   | Crear / Editar / Eliminar | ✅ | ❌ | ❌ |
| **Usuarios**   | Activar / Inactivar | ✅ | ❌ | ❌ |

---

## 4. Implementación en Código
- **`RoleRoute`**: Envoltorio de rutas de React Router DOM que redirige a `/dashboard` si el usuario no cuenta con un rol permitido.
- **`canAccessRoute(user, path)`**: Función utilitaria evaluada por el Sidebar para ocultar enlaces no autorizados.
- **`canCreate()`, `canEdit()`, `canDelete()`**: Funciones que condicionan la visibilidad y ejecución de botones de acción en formularios y tablas.
