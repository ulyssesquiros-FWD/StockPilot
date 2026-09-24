/**
 * StockPilot API Client
 * Central HTTP client with configurable base URL, timeout, and normalized error handling.
 */

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) ||
  'http://localhost:3001';

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = '';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.message || errorJson.error || JSON.stringify(errorJson);
    } catch {
      errorDetail = response.statusText;
    }

    switch (response.status) {
      case 400:
        throw new ApiError(`Solicitud inválida (400): ${errorDetail || 'Verifique los datos enviados.'}`, 400);
      case 401:
        throw new ApiError('No autorizado (401). Inicie sesión nuevamente.', 401);
      case 403:
        throw new ApiError('Acceso denegado (403). No cuenta con permisos suficientes.', 403);
      case 404:
        throw new ApiError(`Recurso no encontrado (404): ${errorDetail || 'El elemento no existe o fue movido.'}`, 404);
      case 500:
        throw new ApiError('Error interno del servidor (500). Intente más tarde.', 500);
      default:
        throw new ApiError(`Error en el servidor (${response.status}): ${errorDetail}`, response.status);
    }
  }

  // Check empty response (e.g. 204 No Content or empty DELETE)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return null;
}

async function request(endpoint, options = {}, timeoutMs = 8000) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      },
      signal: controller.signal
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError('Tiempo de espera agotado al conectar con el servidor (Timeout).', 408);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'No se pudo establecer conexión con el servidor. Verifique que JSON Server esté ejecutándose en el puerto 3001.',
      0
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export const apiClient = {
  get: (endpoint, params) => {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      const normalized = { ...params };

      // Normalize json-server v1 sort syntax (_sort=-field instead of _order=desc)
      if (normalized._sort && normalized._order) {
        if (String(normalized._order).toLowerCase() === 'desc' && !String(normalized._sort).startsWith('-')) {
          normalized._sort = `-${normalized._sort}`;
        }
        delete normalized._order;
      }

      Object.entries(normalized).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, val);
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    return request(url, { method: 'GET' });
  },

  post: (endpoint, body) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    }),

  patch: (endpoint, body) =>
    request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    }),

  delete: (endpoint) =>
    request(endpoint, {
      method: 'DELETE'
    })
};

export default apiClient;
