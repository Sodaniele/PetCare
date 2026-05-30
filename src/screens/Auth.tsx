import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { Mail, Lock, User, LogIn, UserPlus, Sparkles, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const Auth: React.FC = () => {
  const { login, register } = usePet();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI States
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (activeTab === 'login') {
      const success = login(email, password);
      if (!success) {
        setErrorMsg('Credenciales incorrectas. Intenta con sofia@example.com / 123');
      }
    } else {
      if (!name) {
        setErrorMsg('Por favor introduce tu nombre completo.');
        return;
      }
      if (password.length < 3) {
        setErrorMsg('La contraseña debe tener al menos 3 caracteres.');
        return;
      }
      
      const success = register(name, email, password);
      if (success) {
        setSuccessMsg('¡Cuenta registrada con éxito! Iniciando sesión...');
      } else {
        setErrorMsg('Esta dirección de correo electrónico ya está registrada.');
      }
    }
  };

  return (
    <div 
      className="flex-center" 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        background: 'linear-gradient(135deg, var(--bg) 0%, hsl(var(--primary-h), var(--primary-s), 96%) 100%)',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 500,
        padding: '20px'
      }}
    >
      <div 
        className="card-premium" 
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          padding: '32px 24px', 
          boxShadow: 'var(--shadow-lg), 0 10px 40px -10px hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          backgroundColor: 'hsla(var(--card-h), var(--card-s), var(--card-l), 0.95)',
          backdropFilter: 'blur(10px)',
          animation: 'scaleIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.15) forwards'
        }}
      >
        {/* App Logo & Header */}
        <div className="flex-center" style={{ flexDirection: 'column', gap: '8px' }}>
          <div 
            style={{ 
              backgroundColor: 'var(--primary)', 
              color: '#fff', 
              borderRadius: '16px', 
              width: '48px', 
              height: '48px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Sparkles size={24} />
          </div>
          <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.5px' }}>
            PetCare 🐾
          </span>
          <span className="text-caption" style={{ fontSize: '12px', fontWeight: 600 }}>
            Ficha Médica & Control de Mascotas
          </span>
        </div>

        {/* Dynamic Tab Switcher */}
        <div 
          style={{ 
            display: 'flex', 
            backgroundColor: 'var(--bg)', 
            borderRadius: 'var(--radius-md)', 
            padding: '4px',
            border: '1px solid var(--border-color)'
          }}
        >
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeTab === 'login' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'login' ? '#fff' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeTab === 'register' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'register' ? '#fff' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Registrarse
          </button>
        </div>

        {/* Message Banners */}
        {errorMsg && (
          <div 
            style={{ 
              padding: '12px 14px', 
              borderRadius: '12px', 
              backgroundColor: 'var(--danger-light)', 
              color: 'var(--danger)', 
              fontSize: '12.5px',
              fontWeight: 500,
              textAlign: 'left',
              border: '1px solid hsla(var(--danger-h), var(--danger-s), var(--danger-l), 0.15)',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div 
            style={{ 
              padding: '12px 14px', 
              borderRadius: '12px', 
              backgroundColor: 'var(--primary-light)', 
              color: 'var(--primary-dark)', 
              fontSize: '12.5px',
              fontWeight: 500,
              textAlign: 'left',
              border: '1px solid hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.15)',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            {successMsg}
          </div>
        )}

        {/* Login/Register Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeTab === 'register' && (
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Nombre Completo *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input 
                  type="text" 
                  className="input-premium" 
                  style={{ paddingLeft: '44px' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Sofía Daniele"
                  required 
                />
              </div>
            </div>
          )}

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Correo Electrónico *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="email" 
                className="input-premium" 
                style={{ paddingLeft: '44px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@email.com"
                required 
              />
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Contraseña *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="input-premium" 
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: 'var(--text-tertiary)' 
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '8px', padding: '14px' }}>
            {activeTab === 'login' ? (
              <>
                <LogIn size={18} />
                Acceder a Ficha
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Crear mi Cuenta
              </>
            )}
          </button>
        </form>

        {/* Demo Account Indicator */}
        {activeTab === 'login' && (
          <div 
            style={{ 
              padding: '12px', 
              borderRadius: '12px', 
              backgroundColor: 'var(--primary-light)', 
              border: '1px solid var(--border-color)',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start',
              textAlign: 'left'
            }}
          >
            <ShieldCheck size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-dark)' }}>
                CUENTA DEMO PRECARGADA:
              </span>
              <span className="text-caption" style={{ fontSize: '11.5px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                Email: **sofia@example.com**  
                Clave: **123**
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
