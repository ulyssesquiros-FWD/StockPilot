import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import MobileNavigation from '../components/layout/MobileNavigation';
import AIChatWidget from '../components/ui/AIChatWidget';
import alertService from '../services/alertService';
import { Sparkles } from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function checkAlerts() {
      try {
        const data = await alertService.getAll();
        const activeCount = (data || []).filter(a => a.status === 'critical' || a.status === 'warning').length;
        setAlertCount(activeCount);
      } catch {
        // Ignore
      }
    }
    checkAlerts();
  }, []);

  const isFullAIPage = location.pathname === '/asistente-ia';

  return (
    <div className="app-layout">
      {/* Accessibility Skip Link */}
      <a href="#main-dashboard-content" className="skip-to-content">
        Saltar al contenido principal
      </a>

      {/* Screen Reader Live Region */}
      <div id="sr-announcements" className="sr-only" aria-live="polite" aria-atomic="true" />

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        alertCount={alertCount}
        onOpenAI={() => setAiChatOpen(true)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Header
          onMenuClick={() => setSidebarOpen(prev => !prev)}
          onOpenAI={() => setAiChatOpen(true)}
        />
        <main id="main-dashboard-content" className="page-container" tabIndex={-1}>
          <Outlet />
        </main>
        <MobileNavigation
          alertCount={alertCount}
          onOpenAI={() => setAiChatOpen(true)}
        />
      </div>

      {/* Floating AI Chat Widget */}
      {!isFullAIPage && (
        <>
          <AIChatWidget
            isOpen={aiChatOpen}
            onClose={() => setAiChatOpen(false)}
          />

          {/* Quick Floating Trigger Button (when chat is closed) */}
          {!aiChatOpen && (
            <button
              type="button"
              onClick={() => setAiChatOpen(true)}
              className="ai-floating-trigger"
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 1050,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                borderRadius: '50px',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.45)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s',
                animation: 'spModalFadeIn 0.3s ease'
              }}
              title="Abrir Asistente StockPilot IA"
              aria-label="Abrir asistente de inteligencia artificial en la página actual"
            >
              <Sparkles size={18} />
              <span>StockPilot IA</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
