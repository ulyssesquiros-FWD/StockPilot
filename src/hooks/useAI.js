import { useState } from 'react';
import aiService from '../services/aiService';
import productService from '../services/productService';
import movementService from '../services/movementService';
import alertService from '../services/alertService';
import categoryService from '../services/categoryService';

export default function useAI() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: '¡Hola! Soy **StockPilot IA**, tu copiloto logístico inteligente. Puedo ayudarte con diagnósticos de existencias, recomendaciones de compra, productos en riesgo de agotamiento y optimización de rotación. ¿Qué deseas consultar hoy?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (userPrompt) => {
    if (!userPrompt || !userPrompt.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userPrompt.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
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

      const result = await aiService.askAssistant(userPrompt, {
        products,
        movements,
        alerts,
        categories
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: result.response,
        source: result.source,
        fallbackNote: result.fallbackNote,
        timestamp: result.timestamp
      };

      setMessages(prev => [...prev, aiMsg]);
      return result;
    } catch (err) {
      setError(err.message || 'Error al comunicarse con el asistente');
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Lo siento, ocurrió un problema al procesar tu solicitud. Por favor intenta de nuevo.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: 'Conversación reiniciada. ¿En qué puedo asistirte con el inventario?',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat
  };
}
