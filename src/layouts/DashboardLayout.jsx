import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import MobileNavigation from '../components/layout/MobileNavigation';
import alertService from '../services/alertService';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

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
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Header
          onMenuClick={() => setSidebarOpen(prev => !prev)}
        />
        <main id="main-dashboard-content" className="page-container" tabIndex={-1}>
          <Outlet />
        </main>
        <MobileNavigation alertCount={alertCount} />
      </div>
    </div>
  );
}
