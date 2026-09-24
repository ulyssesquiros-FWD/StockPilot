import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { notifySuccess, notifyError } = useNotification();
  const { user } = useAuth();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar productos');
      notifyError('No se pudieron obtener los productos del servidor.');
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (productData) => {
    try {
      const created = await productService.create(productData, user);
      setProducts(prev => [created, ...prev]);
      notifySuccess(`Producto "${created.name}" registrado correctamente.`);
      return created;
    } catch (err) {
      notifyError(err.message || 'Error al crear el producto.');
      throw err;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const updated = await productService.update(id, productData, user);
      setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
      notifySuccess(`Producto "${updated.name}" actualizado correctamente.`);
      return updated;
    } catch (err) {
      notifyError(err.message || 'Error al actualizar el producto.');
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.delete(id, user);
      setProducts(prev => prev.filter(p => p.id !== id));
      notifySuccess('Producto eliminado satisfactoriamente.');
      return true;
    } catch (err) {
      notifyError(err.message || 'Error al eliminar el producto.');
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    reload: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
}
