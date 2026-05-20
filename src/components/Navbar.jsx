import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

export const Navbar = ({ setView, searchTerm, setSearchTerm }) => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isDark = theme === 'dark';

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
        <div style={{ width: '24px', height: '24px', backgroundColor: '#3b82f6', borderRadius: '6px' }}></div>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#111827' }}>Scholarly</span>
      </div>

      {/* Buscador Dinámico */}
      <div style={{ position: 'relative', width: '350px' }}>
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
        {/* INTERRUPTOR DE TEMA REINTEGRADO */}
        <button
          onClick={toggleTheme}
          style={{
            padding: '8px 12px',
            borderRadius: '20px',
            border: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`,
            backgroundColor: isDark ? '#334155' : '#ffffff',
            color: isDark ? '#fbbf24' : '#4b5563',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.85rem'
          }}
        >
          {isDark ? 'Claro' : 'Oscuro'}
        </button>

        {/* Perfil del Estudiante */}
        <div
          onClick={() => setView('profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
            {/* {user.name} */}
          </span>

          
            <span style={{ fontWeight: '600', fontSize: '0.95rem', color: '#1f2937', hover: { textDecoration: 'underline' } }}>
              {user.name}
            </span>
            {/* Avatar circular */}
            <div style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              backgroundColor: '#e0e7ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.85rem'
            }}>
              UN
            </div>
          </div>
        </div>
    </nav>
  );
};