import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAI from '../../hooks/useAI';
import Button from './Button';
import {
  Sparkles,
  Send,
  Trash2,
  Bot,
  User,
  Zap,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock
} from 'lucide-react';

export default function AIChatWidget({ isOpen, onClose }) {
  const { messages, loading, sendMessage, clearChat, remainingMinutes } = useAI();
  const [inputPrompt, setInputPrompt] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom when messages update or loading
  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputPrompt.trim() || loading) return;
    const text = inputPrompt;
    setInputPrompt('');
    await sendMessage(text);
  };

  const handleExpandToPage = () => {
    onClose();
    navigate('/asistente-ia');
  };

  const quickPrompts = [
    { label: '📊 Resumen general', query: 'Resume el estado actual de mi inventario.' },
    { label: '🛒 Reabastecimiento', query: '¿Qué productos debería reabastecer urgentemente?' },
    { label: '⚠️ Stock crítico', query: '¿Qué productos están en riesgo inminente de agotarse?' },
    { label: '📉 Baja rotación', query: '¿Qué productos tienen baja rotación y poco movimiento?' }
  ];

  return (
    <div
      className="ai-chat-widget-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: isMinimized ? '280px' : 'min(440px, calc(100vw - 32px))',
        height: isMinimized ? '50px' : 'min(620px, calc(100vh - 100px))',
        backgroundColor: isMinimized ? '#0F172A' : 'var(--bg-surface)',
        borderRadius: isMinimized ? '25px' : 'var(--radius-lg)',
        border: isMinimized
          ? isHovered
            ? '1px solid rgba(59, 130, 246, 0.5)'
            : '1px solid rgba(59, 130, 246, 0.3)'
          : '1px solid var(--border-color)',
        boxShadow: isMinimized
          ? isHovered
            ? '0 14px 32px -4px rgba(10, 46, 91, 0.5), 0 0 18px rgba(16, 185, 129, 0.35)'
            : '0 10px 24px -4px rgba(0, 0, 0, 0.4), 0 0 14px rgba(16, 185, 129, 0.2)'
          : '0 20px 40px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.2)',
        transform: isMinimized && isHovered ? 'translateY(-2px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1100,
        overflow: 'hidden',
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.25s, box-shadow 0.2s, transform 0.2s',
        animation: 'spModalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: isMinimized ? 'pointer' : 'default'
      }}
      role="dialog"
      aria-label="Ventana flotante de StockPilot IA"
      aria-modal="false"
      onClick={() => {
        if (isMinimized) setIsMinimized(false);
      }}
    >
      {/* Widget Header */}
      <div
        style={{
          padding: isMinimized ? '6px 10px 6px 8px' : '12px 16px',
          background: 'linear-gradient(135deg, #0A2E5B 0%, #0F172A 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: isMinimized ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
          height: isMinimized ? '100%' : 'auto',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: isMinimized ? '8px' : '10px', minWidth: 0, flex: 1 }}>
          {/* Avatar with Live Indicator */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div
              style={{
                width: isMinimized ? '34px' : '36px',
                height: isMinimized ? '34px' : '36px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.55)'
              }}
            >
              <Sparkles size={isMinimized ? 16 : 18} />
            </div>
            {/* Live pulsating dot */}
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#34D399',
                border: '2px solid #0F172A',
                boxShadow: '0 0 6px #10B981'
              }}
            />
          </div>

          {/* Title & Status */}
          {isMinimized ? (
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px', lineHeight: 1.2 }}>
                <span>StockPilot IA</span>
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(16, 185, 129, 0.25)',
                    color: '#34D399',
                    padding: '1px 5px',
                    borderRadius: '6px'
                  }}
                >
                  Activo
                </span>
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Clock size={10} style={{ color: '#38BDF8' }} />
                <span>1h ({remainingMinutes}m) • Abrir</span>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                StockPilot IA
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    backgroundColor: 'rgba(16, 185, 129, 0.25)',
                    color: '#34D399',
                    padding: '2px 6px',
                    borderRadius: '10px'
                  }}
                >
                  En línea
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Copiloto Logístico</span>
                <span>•</span>
                <span style={{ color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '3px' }} title="El historial conversacional y la memoria contextual se preservan activamente por 1 hora">
                  <Clock size={11} /> Historial 1h ({remainingMinutes}m)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {isMinimized ? (
            <>
              <button
                type="button"
                className="btn-icon btn-ghost"
                onClick={() => setIsMinimized(false)}
                title="Expandir ventana"
                aria-label="Expandir ventana del Asistente IA"
                style={{
                  color: '#94A3B8',
                  padding: '5px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronUp size={17} />
              </button>
              <button
                type="button"
                className="btn-icon btn-ghost"
                onClick={onClose}
                title="Cerrar asistente"
                aria-label="Cerrar ventana del Asistente IA"
                style={{
                  color: '#EF4444',
                  padding: '5px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-icon btn-ghost"
                onClick={() => setIsMinimized(true)}
                title="Minimizar ventana"
                aria-label="Minimizar ventana"
                style={{ color: '#94A3B8', padding: '6px' }}
              >
                <ChevronDown size={18} />
              </button>

              <button
                type="button"
                className="btn-icon btn-ghost"
                onClick={handleExpandToPage}
                title="Abrir en página completa"
                aria-label="Abrir asistente en pantalla completa"
                style={{ color: '#94A3B8', padding: '6px' }}
              >
                <ExternalLink size={15} />
              </button>

              <button
                type="button"
                className="btn-icon btn-ghost"
                onClick={onClose}
                title="Cerrar ventana"
                aria-label="Cerrar ventana del Asistente IA"
                style={{ color: '#EF4444', padding: '6px' }}
              >
                <X size={17} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Body (Only visible when not minimized) */}
      {!isMinimized && (
        <>
          {/* Header Sub-bar */}
          <div
            style={{
              padding: '8px 14px',
              backgroundColor: 'var(--bg-surface-alt)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'var(--text-muted)'
            }}
          >
            <span>Analiza datos de inventario en tiempo real</span>
            <button
              type="button"
              onClick={clearChat}
              className="btn-ghost"
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Reiniciar chat"
            >
              <Trash2 size={13} />
              <span>Limpiar</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: 'var(--bg-surface)'
            }}
          >
            {messages.map((msg) => {
              const isAI = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignSelf: isAI ? 'flex-start' : 'flex-end',
                    maxWidth: '92%'
                  }}
                >
                  {isAI && (
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      <Bot size={16} />
                    </div>
                  )}

                  <div
                    style={{
                      backgroundColor: isAI ? 'var(--bg-surface-alt)' : 'var(--color-primary-blue)',
                      color: isAI ? 'var(--text-main)' : 'var(--color-white)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      borderBottomLeftRadius: isAI ? '2px' : 'var(--radius-md)',
                      borderBottomRightRadius: !isAI ? '2px' : 'var(--radius-md)',
                      boxShadow: 'var(--shadow-sm)',
                      fontSize: '13px',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {msg.text}

                    {msg.fallbackNote && (
                      <div
                        style={{
                          marginTop: '8px',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          color: 'var(--color-primary-green)',
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Zap size={12} />
                        <span>{msg.fallbackNote}</span>
                      </div>
                    )}
                  </div>

                  {!isAI && (
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-dark-blue)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      <User size={16} />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Bot size={16} />
                </div>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-alt)',
                    color: 'var(--text-muted)',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Consultando agente logístico...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Questions Pills */}
          <div
            style={{
              padding: '8px 12px',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface-alt)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none'
            }}
          >
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(p.query)}
                disabled={loading}
                className="btn-ghost"
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '12px',
              display: 'flex',
              gap: '8px',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface)'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Haz una consulta a la IA sobre tu inventario..."
              disabled={loading}
              className="form-input"
              style={{
                borderRadius: 'var(--radius-full)',
                paddingLeft: '14px',
                fontSize: '13px',
                height: '38px'
              }}
              aria-label="Escribe tu mensaje para StockPilot IA"
            />
            <Button
              type="submit"
              variant="success"
              size="sm"
              disabled={loading || !inputPrompt.trim()}
              icon={<Send size={15} />}
              style={{ borderRadius: 'var(--radius-full)', height: '38px', padding: '0 14px' }}
              ariaLabel="Enviar mensaje a la IA"
            />
          </form>
        </>
      )}
    </div>
  );
}
