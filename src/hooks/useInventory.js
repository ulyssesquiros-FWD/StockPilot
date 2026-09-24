import { useState, useEffect, useCallback } from 'react';
import inventoryService from '../services/inventoryService';
import movementService from '../services/movementService';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export default function useInventory() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { notifySuccess, notifyError } = useNotification();
  const { user } = useAuth();

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Error al cargar métricas de inventario');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const registerMovement = async (movementData) => {
    try {
      const result = await movementService.create(movementData, user);
      notifySuccess('Movimiento registrado y stock actualizado con éxito.');
      await loadStats(); // refresh stats immediately
      return result;
    } catch (err) {
      notifyError(err.message || 'Error al procesar el movimiento.');
      throw err;
    }
  };

  return {
    stats,
    loading,
    error,
    reload: loadStats,
    registerMovement
  };
}
