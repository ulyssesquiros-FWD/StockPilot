import { useState, useEffect, useCallback } from 'react';
import alertService from '../services/alertService';
import { useNotification } from '../context/NotificationContext';

export default function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { notifySuccess, notifyError } = useNotification();

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await alertService.getAll();
      setAlerts(data || []);
    } catch (err) {
      setError(err.message || 'Error al obtener alertas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const resolveAlert = async (id) => {
    try {
      await alertService.resolveAlert(id);
      setAlerts(prev => prev.map(a => (a.id === id ? { ...a, status: 'resolved' } : a)));
      notifySuccess('Alerta marcada como resuelta.');
    } catch (err) {
      notifyError(err.message || 'Error al resolver alerta.');
    }
  };

  return {
    alerts,
    loading,
    error,
    reload: fetchAlerts,
    resolveAlert
  };
}
