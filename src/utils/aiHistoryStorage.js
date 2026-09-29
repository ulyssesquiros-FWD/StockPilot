/**
 * StockPilot AI History & Session Storage
 * Manages 1-hour sliding/rolling conversation history retention
 * across browser sessions, route changes, and components.
 */

const STORAGE_KEY = 'stockpilot_ai_session_v1';
export const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour in milliseconds

export const INITIAL_WELCOME_MESSAGE = {
  id: 'welcome-1',
  sender: 'assistant',
  text: '¡Hola! Soy **StockPilot IA**, tu copiloto logístico inteligente. Puedo ayudarte con diagnósticos de existencias, recomendaciones de compra, productos en riesgo de agotamiento y optimización de rotación. ¿Qué deseas consultar hoy?',
  timestamp: new Date().toISOString()
};

/**
 * Generate a unique session identifier
 */
export function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Get active session data from localStorage.
 * Automatically invalidates and creates a new session if older than 1 hour.
 */
export function getActiveSession() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {
      sessionId: generateSessionId(),
      messages: [INITIAL_WELCOME_MESSAGE],
      lastActivity: Date.now()
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = {
        sessionId: generateSessionId(),
        messages: [INITIAL_WELCOME_MESSAGE],
        lastActivity: Date.now()
      };
      saveSession(fresh.sessionId, fresh.messages);
      return fresh;
    }

    const parsed = JSON.parse(raw);
    const now = Date.now();
    const elapsed = now - (parsed.lastActivity || 0);

    // If 1 hour has passed without activity, expire and start fresh session
    if (elapsed > SESSION_TTL_MS) {
      const fresh = {
        sessionId: generateSessionId(),
        messages: [INITIAL_WELCOME_MESSAGE],
        lastActivity: now
      };
      saveSession(fresh.sessionId, fresh.messages);
      return fresh;
    }

    return {
      sessionId: parsed.sessionId || generateSessionId(),
      messages: Array.isArray(parsed.messages) && parsed.messages.length > 0 ? parsed.messages : [INITIAL_WELCOME_MESSAGE],
      lastActivity: parsed.lastActivity || now
    };
  } catch (err) {
    console.warn('Error reading AI history from localStorage:', err);
    return {
      sessionId: generateSessionId(),
      messages: [INITIAL_WELCOME_MESSAGE],
      lastActivity: Date.now()
    };
  }
}

/**
 * Save messages and update lastActivity timestamp to extend the 1-hour window
 */
export function saveSession(sessionId, messages) {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const payload = {
      sessionId: sessionId || generateSessionId(),
      messages,
      lastActivity: Date.now()
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    // Dispatch event to sync all open components/tabs
    window.dispatchEvent(
      new CustomEvent('stockpilot:ai-history-update', {
        detail: payload
      })
    );
  } catch (err) {
    console.warn('Error saving AI history to localStorage:', err);
  }
}

/**
 * Clear conversation and generate a fresh session key
 */
export function clearSession() {
  const fresh = {
    sessionId: generateSessionId(),
    messages: [
      {
        id: `welcome-reset-${Date.now()}`,
        sender: 'assistant',
        text: 'Conversación reiniciada. Se ha generado una nueva sesión con retención de 1 hora. ¿En qué puedo asistirte con el inventario?',
        timestamp: new Date().toISOString()
      }
    ],
    lastActivity: Date.now()
  };

  saveSession(fresh.sessionId, fresh.messages);
  return fresh;
}

/**
 * Calculate remaining minutes for the current 1-hour session window
 */
export function getRemainingMinutes(lastActivity) {
  if (!lastActivity) return 60;
  const elapsed = Date.now() - lastActivity;
  const remainingMs = Math.max(0, SESSION_TTL_MS - elapsed);
  return Math.ceil(remainingMs / (60 * 1000));
}
