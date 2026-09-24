# Automatizaciones con n8n

En la carpeta raíz `n8n/` se han creado tres flujos de trabajo en formato JSON estándar, listos para ser importados en cualquier instancia local o remota de n8n.

---

## Flujos Disponibles

### 1. `01-registro-usuario.json`
- **Nombre:** StockPilot - 01 Registro de Usuario
- **Ruta del Webhook:** `POST /stockpilot/register`
- **Entrada Esperada:**
  ```json
  {
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "password": "Password123!",
    "role": "employee",
    "businessName": "Mi Negocio"
  }
  ```
- **Lógica de Ejecución:**
  1. Recibe el payload del registro.
  2. Valida la presencia de campos obligatorios (`name`, `email`, `password`).
  3. Realiza una petición `GET` a JSON Server para verificar si el correo ya existe.
  4. Si no existe, realiza un `POST /users` persistiendo el nuevo usuario activo.
  5. Responde con código `201 Created` y los datos del usuario registrado.

---

### 2. `02-alerta-stock-bajo.json`
- **Nombre:** StockPilot - 02 Alerta de Stock Bajo
- **Ruta del Webhook:** `POST /stockpilot/stock-alert`
- **Entrada Esperada:**
  ```json
  {
    "id": 2,
    "name": "Mouse Logitech MX Master 3S",
    "stock": 3,
    "minimumStock": 8
  }
  ```
- **Lógica de Ejecución:**
  1. Recibe la referencia del producto tras un movimiento.
  2. Evalúa la condición: `Number(stock) <= Number(minimumStock)`.
  3. Si la condición se cumple, determina si es `critical` (stock 0) o `warning` (stock bajo).
  4. Envía un `POST /alerts` a JSON Server con la acción recomendada de reposición.
  5. Retorna `201 Created` informando la emisión de la alerta.

---

### 3. `03-asistente-ia.json`
- **Nombre:** StockPilot - 03 Asistente IA de Inventario
- **Ruta del Webhook:** `POST /stockpilot/ai-assistant`
- **Entrada Esperada:**
  ```json
  {
    "prompt": "¿Qué productos debería reabastecer?",
    "context": {
      "products": [...],
      "movements": [...],
      "alerts": [...]
    }
  }
  ```
- **Lógica de Ejecución:**
  1. Recibe la consulta en lenguaje natural junto con el contexto del inventario.
  2. Agrupa métricas de productos agotados, stock bajo y valoración global.
  3. Conecta con el nodo de IA / motor de inferencia analítica con un System Prompt especializado en logística.
  4. Devuelve una respuesta estructurada con listas de viñetas, prioridades y recomendaciones prácticas.

---

## Cómo Importar los Flujos en n8n
1. Iniciar n8n en su equipo (`npx n8n` o mediante contenedor Docker en `http://localhost:5678`).
2. En la interfaz web de n8n, ir a **Workflows** > **Import from File...**
3. Seleccionar los archivos desde la carpeta `n8n/` del proyecto.
4. Activar los flujos pulsando en **Active**.
