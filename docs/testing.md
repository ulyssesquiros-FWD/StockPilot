# Estrategia de Testing y Cobertura

StockPilot cuenta con una suite integral de pruebas unitarias y de integración construida con **Jest** y **React Testing Library**.

---

## 1. Comandos de Ejecución

Para correr todas las pruebas una sola vez:
```bash
npm test
```

Para correr en modo observador interactivo:
```bash
npm run test:watch
```

---

## 2. Suites de Pruebas Implementadas

### A. Lógica y Cálculos de Inventario (`src/utils/inventoryCalculations.test.js`)
- Resolución matemática del estado de stock (`out_of_stock`, `low_stock`, `available`).
- Impacto de movimientos: `ENTRY` (+qty), `EXIT` (-qty), `RETURN` (+qty), `ADJUSTMENT` (=qty).
- **Control estricto de no negatividad:** Comprobación de que las salidas que superen las existencias lancen una excepción con mensaje claro.
- Cálculo de valoración monetaria consolidada `sum(stock * purchasePrice)`.
- Agregación y ranking de productos con mayor volumen de movimiento.

### B. Matriz de Permisos y RBAC (`src/tests/permissions.test.js`)
- Comprobación de que el rol `admin` puede acceder a `/usuarios`, `/reportes` y todas las rutas.
- Comprobación de que el rol `manager` no tiene acceso al módulo `/usuarios`.
- Comprobación de que el rol `employee` no tiene acceso ni a `/usuarios` ni a `/reportes` ni a creación de productos.
- Verificación de permisos de mutación (`canCreate`, `canEdit`, `canDelete`).

### C. Autenticación y Persistencia (`src/tests/auth.test.js`)
- Recuperación de sesión segura persistida en `localStorage` con la clave `stockpilot_session`.
- Verificación del comportamiento cuando `localStorage` está vacío.
- Limpieza efectiva de sesión durante `logout`.

### D. Guardianes de Rutas (`src/tests/protectedRoute.test.jsx`)
- Comprobación de redirección automática hacia `/login` cuando no existe usuario autenticado.
- Autorización de renderizado para usuarios con sesión activa.
- Redirección forzada hacia `/login` para cuentas marcadas con estado `inactive`.

### E. Validadores de Formularios (`src/tests/validators.test.js`)
- Formato de correos electrónicos válidos e inválidos.
- Longitud y seguridad de contraseñas.
- Validación de formulario de productos: campos obligatorios, precios positivos y stock no negativo.
- Validación de movimientos impidiendo salidas superiores al stock disponible.

### F. Componentes UI y Accesibilidad (`src/tests/uiComponents.test.jsx`)
- `Button`: renderizado de variantes, deshabilitación durante estado de carga (`aria-busy`).
- `StatusBadge`: garantía de que los estados utilicen **color + icono + texto** (nunca solo color).
- `KpiCard`: verificación de etiquetas, valores métricos e indicadores de tendencia.
- `Input`: asociación semántica entre `<label>` y `<input>` mediante `id`/`htmlFor`, atributos `aria-invalid` y alertas `role="alert"`.
