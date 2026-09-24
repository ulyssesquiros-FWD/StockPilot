import React, { useState, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import Tabs from '../../components/ui/Tabs';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';
import Avatar from '../../components/ui/Avatar';
import {
  User,
  Building,
  Boxes,
  Bell,
  Palette,
  Save,
  Sun,
  Moon,
  Sparkles,
  Download,
  Image,
  Eye,
  Type,
  Upload,
  Trash2,
  Camera
} from 'lucide-react';
import LogoFull from '../../assets/brand/LogoFull';
import LogoIsotype from '../../assets/brand/LogoIsotype';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { settings, updateSection, loading } = useSettings();
  const { theme, setTheme, fontSize, setFontSize, a11yPrefs, setA11yPrefs } = useTheme();
  const { notifySuccess, notifyError } = useNotification();

  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Local form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    language: user?.language || 'es'
  });
  const [companyData, setCompanyData] = useState(settings?.company || {});
  const [inventoryData, setInventoryData] = useState(settings?.inventory || {});
  const [notificationData, setNotificationData] = useState(settings?.notifications || {});

  // Sync profile when logged-in user changes or loads
  React.useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        language: user.language || 'es'
      });
    }
  }, [user]);

  // Sync company, inventory and notifications when system settings load
  React.useEffect(() => {
    if (settings) {
      setCompanyData(settings.company || {});
      setInventoryData(settings.inventory || {});
      setNotificationData(settings.notifications || {});
    }
  }, [settings]);

  if (loading) return <LoadingState message="Cargando configuración..." />;

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notifyError('Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP, GIF).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      notifyError('La imagen no debe superar los 3 MB de tamaño.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setProfileData(prev => ({ ...prev, avatar: base64 }));
      notifySuccess('Imagen cargada en la vista previa. Haz clic en "Guardar Perfil" para aplicar los cambios.');
    };
    reader.onerror = () => {
      notifyError('Error al procesar el archivo de imagen.');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (section, data) => {
    setSaving(true);
    try {
      if (section === 'profile') {
        if (updateProfile) {
          await updateProfile({
            name: data.name,
            email: data.email,
            phone: data.phone,
            avatar: data.avatar,
            language: data.language
          });
        }
      } else {
        await updateSection(section, data);
      }

      notifySuccess('Configuración guardada exitosamente.');
    } catch {
      notifyError('No se pudo guardar la configuración.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil Personal', icon: <User size={16} /> },
    { id: 'company', label: 'Empresa', icon: <Building size={16} /> },
    { id: 'inventory', label: 'Parámetros Inventario', icon: <Boxes size={16} /> },
    { id: 'notifications', label: 'Notificaciones', icon: <Bell size={16} /> },
    { id: 'appearance', label: 'Apariencia y Accesibilidad', icon: <Palette size={16} /> },
    { id: 'brand', label: 'Identidad de Marca y Logos', icon: <Sparkles size={16} /> }
  ];

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="page-header-info">
          <h1>Configuración del Sistema</h1>
          <p className="text-secondary">
            Preferencias de la empresa, inventario, notificaciones y opciones de accesibilidad
          </p>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Perfil Personal */}
      {activeTab === 'profile' && (
        <Card
          title={`Perfil de Usuario: ${user?.name || 'Usuario Activo'}`}
          subtitle={`Sesión iniciada como ${user?.role === 'admin' ? 'Administrador' : user?.role === 'manager' ? 'Encargado de Inventario' : 'Empleado'} (${user?.email || ''})`}
        >
          <form onSubmit={(e) => { e.preventDefault(); handleSave('profile', profileData); }}>
            {/* Avatar Upload Banner */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '20px',
                padding: '18px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                marginBottom: '24px'
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Avatar
                  src={profileData?.avatar || user?.avatar || ''}
                  name={profileData?.name || user?.name || 'Usuario'}
                  size={84}
                />
              </div>

              <div style={{ flex: 1, minWidth: '240px' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Foto de Perfil
                </h4>
                <p className="text-secondary" style={{ fontSize: '13px', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                  Sube una foto desde tu computadora o dispositivo (PNG, JPG, WEBP hasta 3 MB) o pega una URL directa.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    onChange={handleAvatarFileChange}
                    style={{ display: 'none' }}
                    id="avatar-file-upload"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    icon={<Upload size={15} />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Subir Imagen del Equipo
                  </Button>

                  {(profileData?.avatar || user?.avatar) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={15} />}
                      onClick={() => {
                        setProfileData(prev => ({ ...prev, avatar: '' }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                        notifySuccess('Foto de perfil eliminada. Haz clic en "Guardar Perfil" para aplicar.');
                      }}
                      style={{ color: 'var(--color-danger-red)' }}
                    >
                      Quitar Foto
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="form-grid-2">
              <Input
                label="Nombre Completo"
                value={profileData?.name || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                label="Correo Electrónico"
                type="email"
                value={profileData?.email || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="form-grid-2">
              <Input
                label="Teléfono Móvil"
                value={profileData?.phone || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              />
              <div className="form-group">
                <label className="form-label">Idioma de la Plataforma</label>
                <select
                  value={profileData?.language || 'es'}
                  onChange={(e) => setProfileData(prev => ({ ...prev, language: e.target.value }))}
                  className="form-select"
                >
                  <option value="es">Español (América Latina)</option>
                  <option value="en">English (US)</option>
                </select>
              </div>
            </div>
            <div className="form-grid-1" style={{ marginTop: '8px' }}>
              <Input
                label="O ingresar enlace directo (URL de imagen)"
                type="url"
                placeholder="https://ejemplo.com/avatar.jpg"
                value={profileData?.avatar || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, avatar: e.target.value }))}
                helperText="Si prefieres usar una imagen alojada en la web, escribe o pega aquí el enlace."
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button type="submit" variant="primary" loading={saving} icon={<Save size={16} />}>
                Guardar Perfil
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Datos de Empresa */}
      {activeTab === 'company' && (
        <Card title="Datos de la Empresa" subtitle="Parámetros comerciales y fiscales">
          <form onSubmit={(e) => { e.preventDefault(); handleSave('company', companyData); }}>
            <div className="form-grid-2">
              <Input
                label="Razón Social"
                value={companyData?.companyName || ''}
                onChange={(e) => setCompanyData(prev => ({ ...prev, companyName: e.target.value }))}
                required
              />
              <Input
                label="Nombre Comercial"
                value={companyData?.commercialName || ''}
                onChange={(e) => setCompanyData(prev => ({ ...prev, commercialName: e.target.value }))}
              />
            </div>
            <div className="form-grid-3">
              <Input
                label="Cédula Jurídica / Tax ID"
                value={companyData?.taxId || ''}
                onChange={(e) => setCompanyData(prev => ({ ...prev, taxId: e.target.value }))}
              />
              <Input
                label="Rubro o Giro Comercial"
                value={companyData?.businessType || ''}
                onChange={(e) => setCompanyData(prev => ({ ...prev, businessType: e.target.value }))}
              />
              <div className="form-group">
                <label className="form-label">Moneda de Operación</label>
                <select
                  value={companyData?.currency || 'USD'}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, currency: e.target.value }))}
                  className="form-select"
                >
                  <option value="USD">Dólares Estadounidenses (USD $)</option>
                  <option value="CRC">Colones Costarricenses (CRC ₡)</option>
                  <option value="EUR">Euros (EUR €)</option>
                </select>
              </div>
            </div>
            <div className="form-grid-2">
              <Input
                label="Dirección Física"
                value={companyData?.address || ''}
                onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
              />
              <Input
                label="Teléfono de la Empresa"
                value={companyData?.phone || ''}
                onChange={(e) => setCompanyData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button type="submit" variant="primary" loading={saving} icon={<Save size={16} />}>
                Guardar Datos de Empresa
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Parámetros de Inventario */}
      {activeTab === 'inventory' && (
        <Card title="Parámetros de Inventario" subtitle="Reglas centrales y políticas de existencias">
          <form onSubmit={(e) => { e.preventDefault(); handleSave('inventory', inventoryData); }}>
            <div className="form-grid-2">
              <Input
                label="Stock Mínimo Predeterminado"
                type="number"
                value={inventoryData?.defaultMinimumStock || 5}
                onChange={(e) => setInventoryData(prev => ({ ...prev, defaultMinimumStock: Number(e.target.value) }))}
                hint="Valor asignado por defecto a nuevos productos"
              />
              <Input
                label="Prefijo de SKU Sugerido"
                value={inventoryData?.skuPrefix || 'STK-'}
                onChange={(e) => setInventoryData(prev => ({ ...prev, skuPrefix: e.target.value }))}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inventoryData?.autoGenerateAlerts ?? true}
                  onChange={(e) => setInventoryData(prev => ({ ...prev, autoGenerateAlerts: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-blue)' }}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>Generación automática de alertas</div>
                  <div className="text-secondary">Dispara alertas críticas si el stock llega a cero o bajo el mínimo.</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.7, cursor: 'not-allowed' }}>
                <input
                  type="checkbox"
                  checked={false}
                  disabled
                  style={{ width: '18px', height: '18px' }}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>Permitir existencias negativas (Deshabilitado por política)</div>
                  <div className="text-secondary">StockPilot bloquea estrictamente los saldos negativos para garantizar la integridad contable.</div>
                </div>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button type="submit" variant="primary" loading={saving} icon={<Save size={16} />}>
                Guardar Parámetros
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Notificaciones */}
      {activeTab === 'notifications' && (
        <Card title="Notificaciones" subtitle="Canales de difusión de alertas operativas">
          <form onSubmit={(e) => { e.preventDefault(); handleSave('notifications', notificationData); }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '16px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notificationData?.criticalStockNotification ?? true}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, criticalStockNotification: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-blue)' }}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>Alertas de quiebre de stock en tiempo real</div>
                  <div className="text-secondary">Mostrar badge y notificación sonora inmediata al detectar stock cero.</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notificationData?.movementDigest ?? true}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, movementDigest: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-blue)' }}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>Resumen diario de movimientos de almacén</div>
                  <div className="text-secondary">Consolidar balance de entradas y salidas al cierre de turno.</div>
                </div>
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button type="submit" variant="primary" loading={saving} icon={<Save size={16} />}>
                Guardar Notificaciones
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Apariencia y Accesibilidad */}
      {activeTab === 'appearance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <Card title="Tema Visual de la Plataforma" subtitle="Modo claro y modo oscuro de alta fidelidad">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', margin: '16px 0' }} className="form-grid-2">
              <div
                onClick={() => setTheme('light')}
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  border: theme === 'light' ? '2px solid var(--color-primary-blue)' : '1px solid var(--border-color)',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <Sun size={24} color="#F59E0B" />
                <div>
                  <div style={{ fontWeight: 700 }}>Modo Claro (Predeterminado)</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Fondo brillante con contraste óptimo para oficinas</div>
                </div>
              </div>

              <div
                onClick={() => setTheme('dark')}
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  border: theme === 'dark' ? '2px solid var(--color-primary-blue)' : '1px solid var(--border-color)',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <Moon size={24} color="#38BDF8" />
                <div>
                  <div style={{ fontWeight: 700, color: '#FFFFFF' }}>Modo Oscuro</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>Reduce fatiga visual en turnos nocturnos y bodegas</div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Tamaño de Tipografía Accesible" subtitle="Ajusta el escalado global del sistema">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', margin: '16px 0' }} className="form-grid-3">
              {[
                { id: 'normal', title: 'Normal (100%)', desc: '14px cuerpo / 32px encabezados' },
                { id: 'large', title: 'Grande (115%)', desc: '16px cuerpo / 36px encabezados' },
                { id: 'xlarge', title: 'Muy Grande (130%)', desc: '18px cuerpo / 40px encabezados' }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setFontSize(opt.id)}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: fontSize === opt.id ? '2px solid var(--color-primary-blue)' : '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-surface-alt)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{opt.title}</div>
                  <div className="text-secondary" style={{ fontSize: '11px', marginTop: '4px' }}>{opt.desc}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Directrices de Accesibilidad Cumplidas (WCAG 2.1)" subtitle="Garantías implementadas en StockPilot">
            <ul style={{ paddingLeft: '20px', fontSize: '13px', lineHeight: 1.8, color: 'var(--text-main)' }}>
              <li><strong>Información no dependiente exclusivamente del color:</strong> Los estados utilizan triple indicador: color, icono semántico y texto explícito.</li>
              <li><strong>Navegación por teclado completa:</strong> Anillos de foco visibles (`:focus-visible`) y enlace de salto (`skip-to-content`).</li>
              <li><strong>Soporte para lectores de pantalla:</strong> Etiquetas accesibles (`aria-label`, `aria-describedby`, `aria-live`).</li>
              <li><strong>Adaptabilidad visual:</strong> Escalado tipográfico global sin romper la grilla de layouts ni tablas.</li>
            </ul>
          </Card>

          <Card title="Opciones Avanzadas de Inclusión" subtitle="Herramientas cognitivas y visuales">
            <div className="form-grid-2">
              <div
                onClick={() => setA11yPrefs({ dyslexiaFont: !a11yPrefs?.dyslexiaFont })}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: a11yPrefs?.dyslexiaFont ? '2px solid var(--color-primary-blue)' : '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-surface-alt)',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                <Type size={24} color={a11yPrefs?.dyslexiaFont ? 'var(--color-primary-blue)' : 'var(--text-muted)'} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Fuente para Dislexia</div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>Aumenta el espaciado y usa fuente de alta legibilidad</div>
                </div>
              </div>

              <div
                onClick={() => setA11yPrefs({ reducedMotion: !a11yPrefs?.reducedMotion })}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: a11yPrefs?.reducedMotion ? '2px solid var(--color-primary-blue)' : '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-surface-alt)',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                <Eye size={24} color={a11yPrefs?.reducedMotion ? 'var(--color-primary-blue)' : 'var(--text-muted)'} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Reducir Movimiento</div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>Desactiva animaciones y transiciones decorativas</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label className="form-label">Filtros para Daltonismo</label>
              <select
                className="form-select"
                value={a11yPrefs?.colorFilter || 'none'}
                onChange={(e) => setA11yPrefs({ colorFilter: e.target.value })}
              >
                <option value="none">Sin Filtro (Visión Estándar)</option>
                <option value="protanopia">Protanopía (Ceguera al color rojo)</option>
                <option value="deuteranopia">Deuteranopía (Ceguera al color verde)</option>
                <option value="tritanopia">Tritanopía (Ceguera al color azul)</option>
              </select>
            </div>
          </Card>
        </div>
      )}

      {/* Identidad de Marca y Logos */}
      {activeTab === 'brand' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Card
            title="Manual de Identidad Visual · StockPilot"
            subtitle="“Tu inventario, en control.” — Activos oficiales vectoriales implementados en la plataforma"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div>
                <p style={{ fontSize: '14px', color: 'var(--text-main)', margin: 0 }}>
                  Logotipos, isotipos y variantes cromáticas adaptativas diseñadas para interfaces claras, oscuras, iconos de aplicación y favicons web.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <a
                  href="/logo-full-light.svg"
                  download="stockpilot-logo-horizontal-claro.svg"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <Download size={14} /> Logo Claro (SVG)
                </a>
                <a
                  href="/logo-full-dark.svg"
                  download="stockpilot-logo-horizontal-oscuro.svg"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <Download size={14} /> Logo Oscuro (SVG)
                </a>
                <a
                  href="/logo-isotype.svg"
                  download="stockpilot-isotipo.svg"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <Download size={14} /> Isotipo (SVG)
                </a>
                <a
                  href="/favicon.svg"
                  download="stockpilot-favicon.svg"
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <Download size={14} /> Favicon
                </a>
              </div>
            </div>

            {/* Paleta Cromática */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Paleta Cromática Oficial
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                {[
                  { name: 'Azul Navy Base', hex: '#08264E', role: 'Wordmark & Estructura' },
                  { name: 'Azul Cobalto 3D', hex: '#1E6FD9', role: 'Caja Paquete Isométrica' },
                  { name: 'Verde Crecimiento', hex: '#00B67A', role: 'Barras & Orbit Swoosh' },
                  { name: 'Menta Neón Activa', hex: '#00D68B', role: 'Acentos en Modo Oscuro' }
                ].map((c) => (
                  <div
                    key={c.hex}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-surface-alt)'
                    }}
                  >
                    <div style={{ height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: c.hex, marginBottom: '8px' }} />
                    <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--text-main)' }}>{c.name}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)' }}>{c.hex}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{c.role}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN 1: VARIANTES SOBRE FONDO CLARO */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                1. Variantes Oficiales · Fondo Claro
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {/* Logo Principal Horizontal */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                  <LogoFull variant="light" size={42} showTagline={true} />
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Logo Principal (Horizontal)
                  </div>
                </div>

                {/* Logo Vertical */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                  <LogoFull variant="light" orientation="vertical" size={40} showTagline={true} />
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Logo Vertical
                  </div>
                </div>

                {/* Isotipo Fondo Claro */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                  <LogoIsotype variant="light" size={54} />
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Isotipo
                  </div>
                </div>

                {/* App Icon 512x512 */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                  <LogoIsotype asAppIcon={true} size={64} />
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    App Icon (512×512)
                  </div>
                </div>

                {/* Favicon 16x16, 32x32, 48x48 */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <LogoIsotype size={18} />
                      <span style={{ fontSize: '9px', color: '#94A3B8', display: 'block', marginTop: '4px' }}>16×16</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <LogoIsotype size={28} />
                      <span style={{ fontSize: '9px', color: '#94A3B8', display: 'block', marginTop: '4px' }}>32×32</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <LogoIsotype size={38} />
                      <span style={{ fontSize: '9px', color: '#94A3B8', display: 'block', marginTop: '4px' }}>48×48</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Favicon
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: VARIANTES SOBRE FONDO OSCURO */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                2. Variantes Oficiales · Fondo Oscuro
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {/* Logo Principal Horizontal Oscuro */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #1E293B', backgroundColor: '#031427', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                  <LogoFull variant="dark" size={42} showTagline={true} />
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Logo Principal (Horizontal)
                  </div>
                </div>

                {/* Logo Vertical Oscuro */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #1E293B', backgroundColor: '#031427', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                  <LogoFull variant="dark" orientation="vertical" size={40} showTagline={true} />
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Logo Vertical
                  </div>
                </div>

                {/* Isotipo Fondo Oscuro */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #1E293B', backgroundColor: '#031427', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                  <LogoIsotype variant="dark" size={54} />
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Isotipo
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: VERSIONES MONOCROMAS */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                3. Versiones Monocromáticas (Impresión y Contraste Extremo)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {/* Monocromo Negro */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                  <LogoFull variant="monochrome-black" size={40} showTagline={true} />
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Versión Monocroma (Negro) · Fondo Claro
                  </div>
                </div>

                {/* Monocromo Blanco */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #27272A', backgroundColor: '#18181B', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                  <LogoFull variant="monochrome-white" size={40} showTagline={true} />
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#A1A1AA', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Versión Monocroma (Blanco) · Fondo Oscuro
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
