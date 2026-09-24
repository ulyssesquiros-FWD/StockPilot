# Documentación de Endpoints y Servicios HTTP

## 1. Configuración de API
La variable de entorno en `.env` define el punto de enlace de JSON Server:
```env
VITE_API_URL=http://localhost:3001
```

Todas las llamadas se canalizan a través de `src/services/api.js`, implementando:
- Encabezados estandarizados `Content-Type: application/json`
- Timeouts automáticos de 8 segundos mediante `AbortController`
- Normalización de errores técnicos a mensajes comprensibles para el usuario

---

## 2. Endpoints Locales (JSON Server)

### Usuarios (`/users`)
- `GET /users`: Listado de usuarios. Soporta filtros `?email=...` y ordenación.
- `GET /users/:id`: Obtiene datos de un usuario.
- `POST /users`: Registra un nuevo usuario con rol y estado.
- `PATCH /users/:id`: Actualiza campos específicos (como `lastLogin` o `status`).
- `DELETE /users/:id`: Remueve permanentemente un usuario.

### Productos (`/products`)
- `GET /products`: Catálogo completo. Admite parámetros de búsqueda y filtro por categoría.
- `GET /products/:id`: Detalle completo con fotos, márgenes y ubicación.
- `POST /products`: Crea un nuevo producto y dispara la auto-evaluación de stock para alertas.
- `PUT /products/:id`: Actualiza la ficha técnica y existencias.
- `DELETE /products/:id`: Elimina la referencia del inventario.

### Categorías (`/categories`)
- `GET /categories`: Lista de rubros taxonómicos.
- `POST /categories`: Registro de nueva categoría.
- `PUT /categories/:id`: Modificación de nombre y descripción.
- `DELETE /categories/:id`: Eliminación protegida (valida si existen productos asociados antes de borrar).

### Proveedores (`/suppliers`)
- `GET /suppliers`: Listado de distribuidores y empresas asociadas.
- `POST /suppliers`: Nuevo proveedor con datos de contacto.
- `PUT /suppliers/:id`: Actualización de términos comerciales.
- `DELETE /suppliers/:id`: Eliminación con chequeo de productos dependientes.

### Movimientos (`/movements`)
- `GET /movements`: Historial auditado de entradas, salidas, ajustes y devoluciones.
- `POST /movements`: Registro atómico que valida disponibilidad, recalcula el stock del producto, persiste el movimiento y audita la actividad.

### Alertas (`/alerts`)
- `GET /alerts`: Incidencias de stock crítico (`out_of_stock`) y stock bajo (`low_stock`).
- `PATCH /alerts/:id`: Permite marcar alertas como `resolved`.

### Auditoría de Actividades (`/activities`)
- `GET /activities`: Registro cronológico de acciones relevantes (inicios de sesión, cambios de stock, eliminaciones).
- `POST /activities`: Inserción de nuevos eventos de auditoría.

---

## 3. Endpoint Externo Real (Open Food Facts API v2)
- **Proveedor:** Open Food Facts (Base de datos abierta mundial)
- **URL Base:** `https://world.openfoodfacts.org/api/v2/product/{barcode}.json`
- **Servicio Frontend:** `src/services/externalService.js`
- **Método:** `lookupBarcode(barcode)`
- **Uso en Interfaz:** Disponible en el formulario de producto (`ProductFormPage.jsx`). Al introducir un código de barras internacional (por ejemplo `7622210449283`), consulta la API pública, extrae el nombre comercial, fabricante, imagen y descripción y ofrece autocompletar la ficha con un solo clic. Si el código no existe o no es un producto catalogado, muestra un estado informativo controlado sin romper el flujo de trabajo.
