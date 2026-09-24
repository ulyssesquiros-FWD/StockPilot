import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { isValidEmail } from '../../utils/validators';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LogoFull from '../../assets/brand/LogoFull';
import Modal from '../../components/ui/Modal';
import { LogIn, KeyRound, Mail, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { notifySuccess, notifyError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [recoveryModal, setRecoveryModal] = useState(false);

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
    if (!formData.email.trim()) {
      errs.email = 'El correo electrónico es obligatorio.';
    } else if (!isValidEmail(formData.email)) {
      errs.email = 'Introduzca una dirección de correo válida.';
    }

    if (!formData.password) {
      errs.password = 'La contraseña es obligatoria.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      notifySuccess(`¡Bienvenido de nuevo, ${user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      notifyError(err.message || 'Error al iniciar sesión.');
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (email, pass) => {
    setFormData(prev => ({ ...prev, email, password: pass }));
  };

  return (
    <div>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', marginBottom: '16px' }}>
          <LogoFull size={38} showTagline={true} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>
          Iniciar Sesión
        </h2>
        <p className="text-secondary" style={{ marginTop: '4px' }}>
          Accede a tu plataforma de inventario inteligente
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
            fontSize: '13px',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}
          role="alert"
        >
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Correo Electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="ejemplo@stockpilot.com"
          error={errors.email}
          required
          icon={<Mail size={16} />}
          autoComplete="email"
        />

        <Input
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
          required
          icon={<KeyRound size={16} />}
          autoComplete="current-password"
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              cursor: 'pointer',
              color: 'var(--text-main)'
            }}
          >
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary-blue)' }}
            />
            Recordar sesión
          </label>

          <button
            type="button"
            onClick={() => setRecoveryModal(true)}
            className="btn-ghost"
            style={{ fontSize: '13px', color: 'var(--color-primary-blue)', padding: '2px 4px' }}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          icon={<LogIn size={18} />}
          style={{ width: '100%', marginBottom: '16px' }}
        >
          Iniciar Sesión
        </Button>

        <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          ¿Aún no tienes una cuenta?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-primary-blue)' }}>
            Registrarse
          </Link>
        </div>
      </form>

      {/* Demo Credentials Section for Academic Evaluation */}
      <div
        style={{
          marginTop: '32px',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface-alt)',
          border: '1px dashed var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--color-primary-blue)' }}>
          <Sparkles size={14} /> ACCESO RÁPIDO PARA EVALUACIÓN ACADÉMICA
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
          Haz clic en cualquier rol para autocompletar credenciales de prueba:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@stockpilot.com', 'Admin123!')}
            className="btn btn-secondary btn-sm"
            style={{ justifyContent: 'space-between', fontSize: '11px' }}
          >
            <span>👑 <strong>Administrador:</strong> admin@stockpilot.com</span>
            <span style={{ color: 'var(--color-primary-blue)' }}>Admin123!</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('manager@stockpilot.com', 'Manager123!')}
            className="btn btn-secondary btn-sm"
            style={{ justifyContent: 'space-between', fontSize: '11px' }}
          >
            <span>📦 <strong>Encargado:</strong> manager@stockpilot.com</span>
            <span style={{ color: 'var(--color-primary-blue)' }}>Manager123!</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('employee@stockpilot.com', 'Employee123!')}
            className="btn btn-secondary btn-sm"
            style={{ justifyContent: 'space-between', fontSize: '11px' }}
          >
            <span>👤 <strong>Empleado:</strong> employee@stockpilot.com</span>
            <span style={{ color: 'var(--color-primary-blue)' }}>Employee123!</span>
          </button>
        </div>
      </div>

      {/* Password Recovery Modal */}
      <Modal
        isOpen={recoveryModal}
        onClose={() => setRecoveryModal(false)}
        title="Recuperar Acceso a StockPilot"
        footer={
          <Button variant="primary" onClick={() => setRecoveryModal(false)}>
            Entendido
          </Button>
        }
      >
        <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-main)' }}>
          En este entorno de evaluación académica con JSON Server, los usuarios demo predeterminados son:
        </p>
        <ul style={{ marginTop: '12px', paddingLeft: '20px', fontSize: '13px', lineHeight: 1.8 }}>
          <li><strong>Admin:</strong> admin@stockpilot.com (Clave: Admin123!)</li>
          <li><strong>Encargado:</strong> manager@stockpilot.com (Clave: Manager123!)</li>
          <li><strong>Empleado:</strong> employee@stockpilot.com (Clave: Employee123!)</li>
        </ul>
      </Modal>
    </div>
  );
}
