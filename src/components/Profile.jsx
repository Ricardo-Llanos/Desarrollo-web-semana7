// src/components/Profile.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

export const Profile = ({ setView }) => {
  // Consumimos los contextos de forma directa e independiente
  const { user, setUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // Función para simular una actualización de perfil dentro del estado global
  const handleUpgradeLevel = () => {
    setUser(prevUser => ({
      ...prevUser,
      level: prevUser.level === 'Intermedio' ? 'Avanzado ' : 'Intermedio'
    }));
  };

return (
    <div style={{ padding: '10px' }}>
      <button 
        onClick={() => setView('courses')} 
        style={{ marginBottom: '20px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '500' }}
      >
        Volver a mis cursos
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // 2 Columnas solicitadas
        gap: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.02)',
        border: '1px solid #f0f0f0'
      }}>
        {/* COLUMNA 1: Información Académica del Alumno */}
        <div style={{ borderRight: '1px solid #f3f4f6', paddingRight: '30px' }}>
          <h2 style={{ margin: '0 0 6px 0', color: '#111827' }}>Mi Perfil Universitario</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '25px' }}>Administra tu nivel técnico de la plataforma.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase' }}>Estudiante</label>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>{user.name}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase' }}>Nivel de Desarrollo</label>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2563eb', marginTop: '4px' }}>{user.level}</div>
            </div>
          </div>

          <button 
            onClick={handleUpgradeLevel}
            style={{
              marginTop: '35px',
              padding: '12px 20px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
            }}
          >
            Subir Rango de Experiencia
          </button>
        </div>

        {/* COLUMNA 2: Foto y Datos Institucionales (UNCP) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', borderRadius: '12px', padding: '20px' }}>
          {/* Avatar Simulado Grande */}
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            U
          </div>

          {/* Sello / Información UNCP */}
          <h3 style={{ margin: '0 0 4px 0', color: '#111827', textAlign: 'center', fontSize: '1.1rem' }}>
            UNIVERSIDAD NACIONAL DEL CENTRO DEL PERÚ 
          </h3>
          <span style={{ fontSize: '0.85rem', color: '#e11d48', fontWeight: '700', marginBottom: '15px' }}>
            FACULTAD DE INGENIERÍA DE SISTEMAS 
          </span>
          
          <div style={{ width: '100%', borderTop: '1px solid #e5e7eb', paddingTop: '15px', fontSize: '0.85rem', color: '#4b5563', textAlign: 'center' }}>
            <p style={{ margin: '4px 0' }}><strong>Programa:</strong> Ingeniería de Sistemas</p>
            <p style={{ margin: '4px 0' }}><strong>Sede:</strong> Huancayo, Perú</p>
            <p style={{ margin: '4px 0', color: '#9ca3af', fontSize: '0.75rem' }}>Asignatura: Desarrollo de Aplicaciones Web</p>
          </div>
        </div>
      </div>
    </div>
  );
};