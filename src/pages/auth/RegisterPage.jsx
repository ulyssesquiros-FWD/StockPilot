import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { isValidEmail, isValidPassword } from '../../utils/validators';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import LogoFull from '../../assets/brand/LogoFull';
import { UserPlus, User, Mail, Lock, Building, Store } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { notifySuccess, notifyError } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: 'tecnologia',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const businessTypes = [
    { value: 'tecnologia', label: 'Tienda de Tecnología / Electrónica' },
    { value: 'ferreteria', label: 'Ferretería / Construcción' },
    { value: 'restaurante', label: 'Restaurante / Cafetería' },
    { value: 'farmacia', label: 'Farmacia / Salud' },
    { value: 'ropa', label: 'Tienda de Ropa / Textil' },
    { value: 'supermercado', label: 'Supermercado / Abarrotes' },
    { value: 'taller', label: 'Taller Mecánico / Repuestos' },
    { value: 'distribuidor', label: 'Distribuidora Mayorista' },
    { value: 'otro', label: 'Otro rubro comercial' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = 'El nombre completo es obligatorio.';
    }

    if (!formData.email.trim()) {
      errs.email = 'El correo electrónico es obligatorio.';
    } else if (!isValidEmail(formData.email)) {
      errs.email = 'Introduzca un correo electrónico válido.';
    }

    if (!formData.password) {
      errs.password = 'La contraseña es obligatoria.';
    } else if (!isValidPassword(formData.password)) {
      errs.password = 'La contraseña debe contener al menos 6 caracteres.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (!formData.businessName.trim()) {
      errs.businessName = 'El nombre de la empresa es obligatorio.';
    }

    if (!formData.acceptTerms) {
      errs.acceptTerms = 'Debe aceptar los términos y condiciones del servicio.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        businessName: formData.businessName,
        businessType: formData.businessType
      });
      notifySuccess('¡Cuenta creada exitosamente! Bienvenido a StockPilot.');
      navigate('/dashboard');
    } catch (err) {
      notifyError(err.message || 'Error al registrar la cuenta.');
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', marginBottom: '16px' }}>
          <LogoFull size={38} showTagline={true} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>
          Crear una Cuenta
        </h2>
        <p className="text-secondary" style={{ marginTop: '4px' }}>
          Configura tu empresa e inicia la gestión de tu inventario
        </p>
      </div>

      {errors.form && (
        <div
          style={{
            backgroundColor: 'var(--color-danger-red-light)',
            color: 'var(--color-danger-red)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            fontSize: '13px'
          }}
          role="alert"
        >
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Nombre Completo"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej. Juan Pérez"
          error={errors.name}
          required
          icon={<User size={16} />}
        />

        <Input
          label="Correo Electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="correo@empresa.com"
          error={errors.email}
          required
          icon={<Mail size={16} />}
        />

        <div className="form-grid-2">
          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            error={errors.password}
            required
            icon={<Lock size={16} />}
          />
          <Input
            label="Confirmar Contraseña"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repite la contraseña"
            error={errors.confirmPassword}
            required
            icon={<Lock size={16} />}
          />
        </div>

        <div className="form-grid-2">
          <Input
            label="Nombre de Empresa"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Ej. Suministros Norte"
            error={errors.businessName}
            required
            icon={<Building size={16} />}
          />
          <Select
            label="Tipo de Negocio"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            options={businessTypes}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '13px',
              cursor: 'pointer',
              color: 'var(--text-main)'
            }}
          >
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              style={{ marginTop: '2px', accentColor: 'var(--color-primary-blue)' }}
            />
            <span>
              He leído y acepto los <strong>Términos de Servicio</strong> y la <strong>Política de Privacidad</strong> de StockPilot.
            </span>
          </label>
          {errors.acceptTerms && (
            <div style={{ color: 'var(--color-danger-red)', fontSize: '12px', marginTop: '4px' }}>
              {errors.acceptTerms}
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          icon={<UserPlus size={18} />}
          style={{ width: '100%', marginBottom: '16px' }}
        >
          Registrar Empresa
        </Button>

        <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-primary-blue)' }}>
            Iniciar sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
