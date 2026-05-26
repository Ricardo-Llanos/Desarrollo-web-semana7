import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

export const Navbar = ({ setView, searchTerm, setSearchTerm }) => {
  const { user, isAdmin, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // Extract initials dynamically from user name
  const initials = (user?.name || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 40px',
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderBottom: `1px solid ${isDark ? '#334155' : '#f0f0f0'}`,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'all 0.3s ease'
    }}>
      {/* Logotipo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setView('courses')}>
        <div style={{ width: '24px', height: '24px', backgroundColor: '#2563eb', borderRadius: '6px' }}></div>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: isDark ? '#f8fafc' : '#111827' }}>Scholarly</span>
      </div>

      {/* Buscador Dinámico */}
      <div style={{ position: 'relative', width: '300px' }}>
        <input
          type="text"
          placeholder="Buscar cursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: '20px',
            border: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`,
            backgroundColor: isDark ? '#0f172a' : '#f9fafb',
            color: isDark ? '#f8fafc' : '#111827',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'border 0.2s'
          }}
        />
      </div>

      {/* Controles y Perfil */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* Fecha del día */}
        <span style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#6b7280', fontWeight: '500' }}>
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
        </span>

        {/* Interruptor de tema */}
        <button
          onClick={toggleTheme}
          style={{
            padding: '8px 14px',
            borderRadius: '20px',
            border: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`,
            backgroundColor: isDark ? '#334155' : '#ffffff',
            color: isDark ? '#fbbf24' : '#4b5563',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.82rem'
          }}
        >
          {isDark ? '☀️ Claro' : '🌙 Oscuro'}
        </button>

        {/* Perfil del Usuario logueado */}
        <div
          onClick={() => setView(isAdmin ? 'profile' : 'cv')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: '1.2' }}>
            <span style={{ fontWeight: '600', fontSize: '0.92rem', color: isDark ? '#f1f5f9' : '#1f2937' }}>
              {user?.name}
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '10px',
              backgroundColor: isAdmin ? (isDark ? '#5c3d0b' : '#fde68a') : (isDark ? '#1e3a5f' : '#dbeafe'),
              color: isAdmin ? (isDark ? '#fde68a' : '#92400e') : (isDark ? '#93c5fd' : '#1d4ed8'),
              marginTop: '2px'
            }}>
              {isAdmin ? 'ADMINISTRADOR' : 'ALUMNO'}
            </span>
          </div>

          {/* Avatar circular dinámico */}
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: isAdmin ? '#f59e0b' : (isDark ? '#2563eb' : '#e0e7ff'),
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.88rem',
            border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`
          }}>
            {initials}
          </div>
        </div>

        {/* Botón de Cerrar Sesión */}
        <button
          onClick={() => { logout(); setView('courses'); }}
          style={{
            padding: '8px 14px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.82rem',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#dc2626'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ef4444'}
        >
          Salir
        </button>
      </div>
    </nav>
  );
};