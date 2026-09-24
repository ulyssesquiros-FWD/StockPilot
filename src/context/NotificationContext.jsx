import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, message, type };

    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const notifySuccess = useCallback((msg) => showToast(msg, 'success'), [showToast]);
  const notifyError = useCallback((msg) => showToast(msg, 'error', 5000), [showToast]);
  const notifyWarning = useCallback((msg) => showToast(msg, 'warning', 4500), [showToast]);
  const notifyInfo = useCallback((msg) => showToast(msg, 'info'), [showToast]);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color="#10B981" aria-hidden="true" />;
      case 'error':
        return <AlertCircle size={20} color="#EF4444" aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle size={20} color="#F59E0B" aria-hidden="true" />;
      default:
        return <Info size={20} color="#0B4D9B" aria-hidden="true" />;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        showToast,
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo,
        removeToast
      }}
    >
      {children}
      {/* Toast Render Container */}
      <div className="toast-container" role="region" aria-label="Notificaciones del sistema">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`} role="alert">
            <div style={{ flexShrink: 0, marginTop: '2px' }}>{getToastIcon(toast.type)}</div>
            <div style={{ flex: 1, fontSize: '14px', color: 'var(--text-main)' }}>{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="btn-icon btn-ghost"
              aria-label="Cerrar notificación"
              style={{ padding: '2px', marginLeft: '8px' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationContext;
