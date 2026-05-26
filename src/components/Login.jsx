import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

export const Login = () => {
  const { login, register } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [regData, setRegData] = useState({ fullName: '', email: '', document: '', specialty: '' });
  const [message, setMessage] = useState(null);       // { type: 'error'|'ok', text }
  const [credentials, setCredentials] = useState(null); // credenciales generadas al registrarse

  const handleLogin = () => {
    setMessage(null);
    const res = login(loginData.username.trim(), loginData.password.trim());
    if (!res.ok) setMessage({ type: 'error', text: res.error });
  };

  const handleRegister = () => {
    setMessage(null);
    const res = register(regData);
    if (!res.ok) {
      setMessage({ type: 'error', text: res.error });
      setCredentials(null);
    } else {
      setMessage({ type: 'ok', text: 'Registro exitoso. Usa estas credenciales para entrar:' });
      setCredentials({ username: res.username, password: res.password });
      setRegData({ fullName: '', email: '', document: '', specialty: '' });
    }
  };

  // Estilos reutilizables
  const inputStyle = {
    width: '100%', padding: '12px 14px', marginTop: '6px',
    borderRadius: '10px', border: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`,
    backgroundColor: isDark ? '#0f172a' : '#f9fafb', color: isDark ? '#f8fafc' : '#111827',
    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box'
  };
  const labelStyle = { fontSize: '0.8rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#6b7280' };
  const fieldStyle = { marginBottom: '14px' };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: isDark ? '#0f172a' : '#f3f4f6', padding: '20px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div className="pop-in" style={{
        width: '100%', maxWidth: '420px', backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderRadius: '18px', padding: '34px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        border: `1px solid ${isDark ? '#334155' : '#f0f0f0'}`
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: '26px', height: '26px', backgroundColor: '#2563eb', borderRadius: '6px' }} />
          <span style={{ fontWeight: 'bold', fontSize: '1.3rem', color: isDark ? '#f8fafc' : '#111827' }}>Scholarly</span>
        </div>
        <p style={{ textAlign: 'center', color: isDark ? '#94a3b8' : '#6b7280', fontSize: '0.85rem', marginBottom: '24px' }}>
          {mode === 'login' ? 'Inicia sesión para ver tus cursos' : 'Regístrate para obtener tu acceso'}
        </p>

        {/* Mensaje de error / éxito */}
        {message && (
          <div className={message.type === 'error' ? 'shake' : 'fade-in'} style={{
            padding: '10px 12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem',
            backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
            color: message.type === 'error' ? '#b91c1c' : '#15803d'
          }}>
            {message.text}
            {credentials && (
              <div style={{ marginTop: '8px', fontWeight: 700 }}>
                Usuario: {credentials.username}<br />
                Contraseña: {credentials.password}
              </div>
            )}
          </div>
        )}

        {/* FORMULARIO DE LOGIN */}
        {mode === 'login' && (
          <>
            <div style={fieldStyle}>
              <label style={labelStyle}>Usuario</label>
              <input style={inputStyle} value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                placeholder="admin" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Contraseña</label>
              <input style={inputStyle} type="password" value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="••••••"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
            </div>
            <button onClick={handleLogin} className="btn-anim" style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
              backgroundColor: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: '4px'
            }}>
              Ingresar
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '18px', color: isDark ? '#94a3b8' : '#6b7280' }}>
              ¿No eres usuario?{' '}
              <span onClick={() => { setMode('register'); setMessage(null); setCredentials(null); }}
                className="link-anim" style={{ color: '#2563eb', fontWeight: 700 }}>
                Regístrate
              </span>
            </p>
          </>
        )}

        {/* FORMULARIO DE REGISTRO */}
        {mode === 'register' && (
          <>
            <div style={fieldStyle}>
              <label style={labelStyle}>Nombre completo</label>
              <input style={inputStyle} value={regData.fullName}
                onChange={(e) => setRegData({ ...regData, fullName: e.target.value })} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Correo electrónico</label>
              <input style={inputStyle} type="email" value={regData.email}
                onChange={(e) => setRegData({ ...regData, email: e.target.value })} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Número de documento</label>
              <input style={inputStyle} value={regData.document}
                onChange={(e) => setRegData({ ...regData, document: e.target.value })} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Especialidad</label>
              <input style={inputStyle} value={regData.specialty}
                onChange={(e) => setRegData({ ...regData, specialty: e.target.value })} />
            </div>
            <button onClick={handleRegister} className="btn-anim" style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
              backgroundColor: '#16a34a', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: '4px'
            }}>
              Registrarme
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '18px', color: isDark ? '#94a3b8' : '#6b7280' }}>
              ¿Ya tienes cuenta?{' '}
              <span onClick={() => { setMode('login'); setMessage(null); }}
                className="link-anim" style={{ color: '#2563eb', fontWeight: 700 }}>
                Inicia sesión
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
