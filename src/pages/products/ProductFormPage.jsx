import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import supplierService from '../../services/supplierService';
import externalService from '../../services/externalService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { validateProductForm } from '../../utils/validators';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingState from '../../components/ui/LoadingState';
import {
  Save,
  ArrowLeft,
  Search,
  Globe,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ProductFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifySuccess, notifyError, notifyInfo } = useNotification();

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    description: '',
    categoryId: '',
    brand: '',
    supplierId: '',
    purchasePrice: '',
    salePrice: '',
    stock: '',
    minimumStock: '5',
    location: '',
    status: 'active',
    image: ''
  });
  const [errors, setErrors] = useState({});

  // External API lookup state (Open Food Facts)
  const [externalLookupLoading, setExternalLookupLoading] = useState(false);
  const [externalLookupResult, setExternalLookupResult] = useState(null);

  useEffect(() => {
    async function loadSelects() {
      try {
        const [cats, sups] = await Promise.all([
          categoryService.getAll(),
          supplierService.getAll()
        ]);
        setCategories(cats || []);
        setSuppliers(sups || []);
      } catch {
        // Ignore
      }
    }
    loadSelects();

    if (isEditing) {
      productService
        .getById(id)
        .then(prod => {
          if (prod) {
            setFormData({
              name: prod.name || '',
              sku: prod.sku || '',
              barcode: prod.barcode || '',
              description: prod.description || '',
              categoryId: prod.categoryId || '',
              brand: prod.brand || '',
              supplierId: prod.supplierId || '',
              purchasePrice: prod.purchasePrice ?? '',
              salePrice: prod.salePrice ?? '',
              stock: prod.stock ?? '',
              minimumStock: prod.minimumStock ?? '5',
              location: prod.location || '',
              status: prod.status || 'active',
              image: prod.image || ''
            });
          }
        })
        .catch(err => {
          notifyError('No se pudo cargar el producto para edición.');
          navigate('/productos');
        })
        .finally(() => setLoadingInitial(false));
    }
  }, [id, isEditing, navigate, notifyError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // External Barcode Lookup via Open Food Facts (Section 34)
  const handleExternalLookup = async () => {
    if (!formData.barcode || !formData.barcode.trim()) {
      notifyError('Debe ingresar un código de barras para consultar el servicio externo.');
      return;
    }

    setExternalLookupLoading(true);
    setExternalLookupResult(null);

    try {
      const result = await externalService.lookupBarcode(formData.barcode.trim());
      setExternalLookupResult(result);
      if (result.found) {
        notifySuccess('¡Producto localizado en Open Food Facts! Puedes aplicar sus datos.');
      } else {
        notifyInfo(result.message);
      }
    } catch (err) {
      setExternalLookupResult({
        found: false,
        message: err.message || 'Error al conectar con el servicio externo.'
      });
      notifyError('No se pudo consultar el servicio externo.');
    } finally {
      setExternalLookupLoading(false);
    }
  };

  const handleApplyExternalData = () => {
    if (!externalLookupResult?.data) return;
    const { name, brand, description, image } = externalLookupResult.data;

    setFormData(prev => ({
      ...prev,
      name: name || prev.name,
      brand: brand || prev.brand,
      description: description || prev.description,
      image: image || prev.image
    }));

    notifySuccess('Datos externos importados a los campos del formulario.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateProductForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      notifyError('Por favor corrija los errores marcados en el formulario.');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await productService.update(id, formData, user);
        notifySuccess('Producto actualizado correctamente.');
      } else {
        await productService.create(formData, user);
        notifySuccess('Producto registrado en el inventario.');
      }
      navigate('/productos');
    } catch (err) {
      notifyError(err.message || 'Error al guardar el producto.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingInitial) {
    return <LoadingState message="Cargando datos del producto..." />;
  }

  return (
    <div className="product-form-page">
      <Breadcrumbs
        items={[
          { label: 'Productos', to: '/productos' },
          { label: isEditing ? 'Editar Producto' : 'Nuevo Producto' }
        ]}
      />

      <div className="page-header">
        <div className="page-header-info">
          <h1>{isEditing ? 'Editar Producto' : 'Registrar Nuevo Producto'}</h1>
          <p className="text-secondary">
            {isEditing
              ? 'Actualice las características, precios y parámetros de inventario'
              : 'Complete la ficha técnica para incorporar la referencia al catálogo'}
          </p>
        </div>
        <div className="page-header-actions">
          <Button
            variant="secondary"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/productos')}
          >
            Cancelar
          </Button>
        </div>
      </div>

      {/* External Open Food Facts Integration Box (Section 34) */}
      <Card
        style={{
          marginBottom: 'var(--space-lg)',
          borderColor: 'rgba(59, 130, 246, 0.3)',
          backgroundColor: 'rgba(11, 77, 155, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Globe size={18} color="var(--color-primary-blue)" />
          <h4 style={{ fontSize: '15px', color: 'var(--color-primary-blue)' }}>
            Integración de Catálogo Externo (Open Food Facts API v2)
          </h4>
        </div>
        <p className="text-secondary" style={{ marginBottom: '14px' }}>
          Ingresa un código de barras internacional (EAN/UPC) y presiona "Consultar" para autocompletar la ficha desde la base de datos abierta global.
        </p>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <Input
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="Ej. 7622210449283 (Galletas) o código EAN"
              hint="Prueba con códigos como 7622210449283 o ingresa uno propio"
            />
          </div>
          <Button
            variant="outline"
            icon={<Search size={16} />}
            onClick={handleExternalLookup}
            loading={externalLookupLoading}
            style={{ marginTop: '2px' }}
          >
            Consultar Información Externa
          </Button>
        </div>

        {/* External Result Card */}
        {externalLookupResult && (
          <div
            style={{
              marginTop: '16px',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: externalLookupResult.found ? 'var(--color-primary-green-light)' : 'var(--bg-surface-alt)',
              border: `1px solid ${externalLookupResult.found ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {externalLookupResult.found ? (
                <CheckCircle2 size={24} color="var(--color-primary-green)" />
              ) : (
                <AlertCircle size={24} color="var(--text-muted)" />
              )}
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>
                  {externalLookupResult.found ? externalLookupResult.data.name : 'Sin coincidencias externas'}
                </div>
                <div className="text-secondary" style={{ fontSize: '12px' }}>
                  {externalLookupResult.message}
                </div>
              </div>
            </div>

            {externalLookupResult.found && (
              <Button variant="success" size="sm" onClick={handleApplyExternalData}>
                Usar Información Externa
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} noValidate>
        <Card title="Datos Generales de la Mercancía" style={{ marginBottom: 'var(--space-lg)' }}>
          <div className="form-grid-2">
            <Input
              label="Nombre del Producto"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Monitor Curvo 27 pulgadas"
              error={errors.name}
              required
            />
            <Input
              label="Código SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Ej. TEC-MON-27C"
              error={errors.sku}
              required
            />
          </div>

          <div className="form-grid-3">
            <Select
              label="Categoría"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              options={categories.map(c => ({ value: c.id, label: c.name }))}
              placeholder="Seleccionar categoría"
              error={errors.categoryId}
              required
            />
            <Input
              label="Marca / Fabricante"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Ej. Samsung, Logitech"
            />
            <Select
              label="Proveedor Principal"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              options={suppliers.map(s => ({ value: s.id, label: s.company || s.name }))}
              placeholder="Seleccionar proveedor"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Descripción Detallada
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Especificaciones, material, dimensiones..."
            />
          </div>
        </Card>

        {/* Financial & Stock Details */}
        <Card title="Precios, Existencias y Almacén" style={{ marginBottom: 'var(--space-lg)' }}>
          <div className="form-grid-2">
            <Input
              label="Precio de Compra (Costo)"
              name="purchasePrice"
              type="number"
              step="0.01"
              value={formData.purchasePrice}
              onChange={handleChange}
              placeholder="0.00"
              error={errors.purchasePrice}
              required
            />
            <Input
              label="Precio de Venta al Público"
              name="salePrice"
              type="number"
              step="0.01"
              value={formData.salePrice}
              onChange={handleChange}
              placeholder="0.00"
              error={errors.salePrice}
              required
            />
          </div>

          <div className="form-grid-3">
            <Input
              label="Stock Inicial / Actual"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              error={errors.stock}
              required
            />
            <Input
              label="Stock Mínimo (Punto de Reorden)"
              name="minimumStock"
              type="number"
              value={formData.minimumStock}
              onChange={handleChange}
              placeholder="5"
              error={errors.minimumStock}
              hint="Genera alerta automática si el stock llega a este nivel"
              required
            />
            <Input
              label="Ubicación en Bodega"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ej. Bodega Central - Pasillo B2"
            />
          </div>

          <div className="form-grid-2">
            <Input
              label="URL de Imagen del Producto"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              hint="URL directa de la fotografía de muestra"
            />
            <Select
              label="Estado Operativo"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'active', label: 'Activo (Disponible para venta)' },
                { value: 'inactive', label: 'Inactivo (Pausado)' }
              ]}
            />
          </div>
        </Card>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button
            variant="secondary"
            onClick={() => navigate('/productos')}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            icon={<Save size={18} />}
          >
            {isEditing ? 'Guardar Cambios' : 'Registrar Producto'}
          </Button>
        </div>
      </form>
    </div>
  );
}
