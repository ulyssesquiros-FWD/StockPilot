import { useState, useEffect, useCallback } from 'react';
import aiService from '../services/aiService';
import productService from '../services/productService';
import movementService from '../services/movementService';
import alertService from '../services/alertService';
import categoryService from '../services/categoryService';
import {
  getActiveSession,
  saveSession,
  clearSession,
  getRemainingMinutes
} from '../utils/aiHistoryStorage';

export default function useAI() {
  const [session, setSession] = useState(() => getActiveSession());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remainingMinutes, setRemainingMinutes] = useState(() =>
    getRemainingMinutes(session.lastActivity)
  );

  // Sync state with storage updates (e.g. across widget <-> page navigation or tabs)
  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) {
        setSession({
          sessionId: e.detail.sessionId,
          messages: e.detail.messages,
          lastActivity: e.detail.lastActivity
        });
        setRemainingMinutes(getRemainingMinutes(e.detail.lastActivity));
      }
    };

    window.addEventListener('stockpilot:ai-history-update', handleUpdate);

    // Refresh remaining minutes every 60 seconds
    const interval = setInterval(() => {
      const active = getActiveSession();
      setRemainingMinutes(getRemainingMinutes(active.lastActivity));
    }, 60000);

    return () => {
      window.removeEventListener('stockpilot:ai-history-update', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const sendMessage = useCallback(async (userPrompt) => {
    if (!userPrompt || !userPrompt.trim()) return;

    // Verify session hasn't expired before sending
    const currentSession = getActiveSession();

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userPrompt.trim(),
      timestamp: new Date().toISOString()
    };

    const messagesWithUser = [...currentSession.messages, userMsg];
    saveSession(currentSession.sessionId, messagesWithUser);
    setSession({
      ...currentSession,
      messages: messagesWithUser,
      lastActivity: Date.now()
    });
    setRemainingMinutes(60);

    setLoading(true);
    setError(null);

    try {
      // Gather live context to feed the AI (products, movements, alerts, categories)
      const [products, movements, alerts, categories] = await Promise.all([
        productService.getAll().catch(() => []),
        movementService.getAll().catch(() => []),
        alertService.getAll().catch(() => []),
        categoryService.getAll().catch(() => [])
      ]);

      const result = await aiService.askAssistant(
        userPrompt,
        {
          products,
          movements,
          alerts,
          categories
        },
        currentSession.sessionId
      );

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: result.response,
        source: result.source,
        fallbackNote: result.fallbackNote,
        timestamp: result.timestamp
      };

      const finalMessages = [...messagesWithUser, aiMsg];
      saveSession(currentSession.sessionId, finalMessages);
      setSession({
        ...currentSession,
        messages: finalMessages,
        lastActivity: Date.now()
      });
      setRemainingMinutes(60);

      return result;
    } catch (err) {
      setError(err.message || 'Error al comunicarse con el asistente');
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Lo siento, ocurrió un problema al procesar tu solicitud. Por favor intenta de nuevo.',
        timestamp: new Date().toISOString()
      };
      const messagesWithError = [...messagesWithUser, errorMsg];
      saveSession(currentSession.sessionId, messagesWithError);
      setSession({
        ...currentSession,
        messages: messagesWithError,
        lastActivity: Date.now()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    const fresh = clearSession();
    setSession(fresh);
    setRemainingMinutes(60);
  }, []);

  return {
    messages: session.messages,
    sessionId: session.sessionId,
    lastActivity: session.lastActivity,
    remainingMinutes,
    loading,
    error,
    sendMessage,
    clearChat
  };
}
