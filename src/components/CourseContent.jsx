import React, { useState, useMemo, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const CourseContent = ({ courseId, setView }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // Datos simulados de las secciones del curso seleccionado
  const [sections, setSections] = useState([
    { id: 1, title: 'Introducción al Entorno y Configuración', duration: '12 min', completed: true },
    { id: 2, title: 'El Ciclo de Vida en React y Re-renders', duration: '25 min', completed: true },
    { id: 3, title: 'Control de Efectos Secundarios (useEffect)', duration: '18 min', completed: false },
    { id: 4, title: 'Optimización de Memoria con useMemo y useCallback', duration: '30 min', completed: false },
    { id: 5, title: 'Creación de Hooks Personalizados Avanzados', duration: '22 min', completed: false },
  ]);

  const [activeSectionId, setActiveSectionId] = useState(3); // Sección actual en reproducción

  // 1. REQUERIMIENTO: Barra de progreso calculada dinámicamente con useMemo
  const progressPercentage = useMemo(() => {
    // IA: Recálculo masivo en renderizados triviales -> Solución manual: useMemo mapea solo si el array 'sections' cambia
    const completedCount = sections.filter(s => s.completed).length;
    return Math.round((completedCount / sections.length) * 100);
  }, [sections]);

  // Función para alternar el estado de completado de una sección
  const toggleSectionCompleted = (id) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, completed: !section.completed } : section
    ));
  };

  return (
    <div style={{ position: 'relative', paddingTop: '40px' }}>
      
      {/* 2. REQUERIMIENTO: Barra de Progreso en modo STICKY/FIXED en el tope del visor */}
      <div style={{
        position: 'fixed',
        top: '67px', // Justo debajo del Navbar
        left: 0,
        width: '100%',
        height: '4px',
        backgroundColor: isDark ? '#334155' : '#e5e7eb',
        zIndex: 99,
        transition: 'all 0.3s'
      }}>
        <div style={{
          height: '100%',
          width: `${progressPercentage}%`,
          backgroundColor: '#2563eb',
          transition: 'width 0.4s ease-out'
        }}></div>
      </div>

      {/* Cabecera del Visor con botón de regreso */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        {/* 3. REQUERIMIENTO: Botón para regresar a todos los cursos */}
        <button 
          onClick={() => setView('courses')}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`,
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f8fafc' : '#111827',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ⬅️ Regresar a todos los cursos
        </button>

        <span style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>
          Progreso General del Curso: <strong>{progressPercentage}%</strong>
        </span>
      </div>

      {/* 4. REQUERIMIENTO: Layout basado en tu segunda interfaz de ejemplo (2 Columnas) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px', alignItems: 'start' }}>
        
        {/* COLUMNA IZQUIERDA: Video / Contenido de la Clase */}
        <div style={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          borderRadius: '16px',
          border: `1px solid ${isDark ? '#334155' : '#f3f4f6'}`,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          {/* Contenedor de video simulado */}
          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <span style={{ fontSize: '3rem' }}>📺</span>
            <p style={{ fontWeight: '500', padding: '0 20px', textAlign: 'center' }}>
              Reproduciendo Sección #{activeSectionId}: {sections.find(s => s.id === activeSectionId)?.title}
            </p>
          </div>

          {/* Detalles de la clase debajo del video */}
          <div style={{ padding: '24px' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>Descripción del Módulo</h2>
            <p style={{ color: isDark ? '#94a3b8' : '#4b5563', lineHeight: '1.6', margin: 0 }}>
              Bienvenido a esta sesión práctica de la UNCP. En esta sección analizaremos a fondo el comportamiento de los Hooks y cómo evitar fugas de memoria al invocar APIs asíncronas con controladores de aborto.
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: Lista de Secciones y Temario (Estilo Playlist) */}
        <div style={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          borderRadius: '16px',
          border: `1px solid ${isDark ? '#334155' : '#f3f4f6'}`,
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: isDark ? '#f8fafc' : '#111827' }}>
            Contenido del Curso
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sections.map((section) => {
              const isActive = section.id === activeSectionId;
              return (
                <div 
                  key={section.id}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: isActive ? (isDark ? '#334155' : '#f3f4f6') : 'transparent',
                    border: `1px solid ${isActive ? '#2563eb' : 'transparent'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    transition: 'all 0.2s'
                  }}
                >
                  {/* Checkbox interactivo para simular progreso */}
                  <input 
                    type="checkbox" 
                    checked={section.completed}
                    onChange={() => toggleSectionCompleted(section.id)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    title="Marcar como completado"
                  />

                  {/* Título de la sección clicable para cambiar el video */}
                  <div 
                    onClick={() => setActiveSectionId(section.id)}
                    style={{ flexGrow: 1, cursor: 'pointer' }}
                  >
                    <div style={{ 
                      fontSize: '0.88rem', 
                      fontWeight: isActive ? '600' : '500',
                      color: isActive ? '#2563eb' : (isDark ? '#cbd5e1' : '#374151'),
                      lineHeight: '1.4'
                    }}>
                      {section.title}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>⏱️ {section.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};