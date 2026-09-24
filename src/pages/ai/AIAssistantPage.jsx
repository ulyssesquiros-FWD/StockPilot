import React, { useState, useRef, useEffect } from 'react';
import useAI from '../../hooks/useAI';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LogoIsotype from '../../assets/brand/LogoIsotype';
import { Sparkles, Send, Trash2, Bot, User, Zap, RefreshCw } from 'lucide-react';

export default function AIAssistantPage() {
  const { messages, loading, error, sendMessage, clearChat } = useAI();
  const [inputPrompt, setInputPrompt] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputPrompt.trim() || loading) return;
    const text = inputPrompt;
    setInputPrompt('');
    await sendMessage(text);
  };

  const quickPrompts = [
    { label: '📊 Resumen general', query: 'Resume el estado actual de mi inventario.' },
    { label: '🛒 Recomendación de compra', query: '¿Qué productos debería reabastecer urgentemente?' },
    { label: '⚠️ Riesgo de agotamiento', query: '¿Qué productos están en riesgo inminente de agotarse?' },
    { label: '📉 Baja rotación', query: '¿Qué productos tienen baja rotación y poco movimiento?' },
    { label: '🏷️ Clasificación de catálogo', query: '¿Cómo clasificar nuevas referencias de inventario?' }
  ];

  return (
    <div className="ai-assistant-page" style={{ height: 'calc(100vh - var(--header-height) - 48px)', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <div className="page-header-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1>StockPilot IA</h1>
            <span className="badge badge-success" style={{ gap: '4px' }}>
              <Sparkles size={12} /> Copiloto Logístico
            </span>
          </div>
          <p className="text-secondary">
            Asistente inteligente con análisis predictivo de existencias y webhook n8n
          </p>
        </div>
        <div className="page-header-actions">
          <Button
            variant="secondary"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={clearChat}
          >
            Limpiar Chat
          </Button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div
        className="sp-card"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        {/* Messages Stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {messages.map((msg) => {
            const isAI = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignSelf: isAI ? 'flex-start' : 'flex-end',
                  maxWidth: '85%'
                }}
              >
                {isAI && (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Bot size={20} />
                  </div>
                )}

                <div
                  style={{
                    backgroundColor: isAI ? 'var(--bg-surface-alt)' : 'var(--color-primary-blue)',
                    color: isAI ? 'var(--text-main)' : 'var(--color-white)',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-lg)',
                    borderBottomLeftRadius: isAI ? '4px' : 'var(--radius-lg)',
                    borderBottomRightRadius: !isAI ? '4px' : 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.text}

                  {msg.fallbackNote && (
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--color-primary-green)',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Zap size={13} />
                      <span>{msg.fallbackNote}</span>
                    </div>
                  )}
                </div>

                {!isAI && (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-dark-blue)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <User size={20} />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={20} />
              </div>
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-surface-alt)',
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw size={16} className="animate-spin" />
                <span>Analizando parámetros del inventario en tiempo real...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface-alt)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendMessage(p.query)}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px', padding: '5px 12px', borderRadius: 'var(--radius-full)' }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Prompt Input Form */}
        <form
          onSubmit={handleSend}
          style={{
            padding: '16px',
            display: 'flex',
            gap: '12px',
            borderTop: '1px solid var(--border-color)'
          }}
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Pregúntale a StockPilot IA sobre compras, stock crítico, rotación..."
            disabled={loading}
            className="form-input"
            style={{ borderRadius: 'var(--radius-full)', paddingLeft: '20px' }}
            aria-label="Mensaje para el Asistente IA"
          />
          <Button
            type="submit"
            variant="success"
            disabled={loading || !inputPrompt.trim()}
            icon={<Send size={16} />}
            style={{ borderRadius: 'var(--radius-full)', padding: '0 20px' }}
          >
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );
}
