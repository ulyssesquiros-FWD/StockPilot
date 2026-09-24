import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api';

export const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  company: {
    companyName: 'StockPilot Solutions',
    commercialName: 'StockPilot Distribuciones',
    taxId: '3-101-765432',
    businessType: 'Distribución Multirubro',
    currency: 'USD',
    currencySymbol: '$',
    address: 'San José, Costa Rica',
    phone: '+506 2200-9000',
    email: 'contacto@stockpilot.com'
  },
  inventory: {
    defaultMinimumStock: 5,
    allowNegativeStock: false,
    autoGenerateAlerts: true,
    skuPrefix: 'STK-',
    barcodeFormat: 'EAN-13'
  },
  notifications: {
    emailAlerts: true,
    criticalStockNotification: true,
    movementDigest: true,
    systemUpdates: true
  },
  security: {
    requireStrongPassword: true,
    sessionTimeoutMinutes: 120,
    mfaEnabled: false
  },
  appearance: {
    theme: 'light',
    fontSize: 'normal',
    compactTables: false
  }
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const remote = await apiClient.get('/settings');
        if (remote) {
          setSettings(prev => ({ ...prev, ...remote }));
        }
      } catch {
        // Fallback to default in memory if network issue
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const updateSection = async (section, data) => {
    const updated = {
      ...settings,
      [section]: {
        ...settings[section],
        ...data
      }
    };
    setSettings(updated);

    try {
      await apiClient.put('/settings', updated);
    } catch {
      // Local state is updated
    }
    return updated;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSection, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export default SettingsContext;
