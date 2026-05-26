import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const Introduction = ({ course, setView }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const card = isDark ? '#1e293b' : '#ffffff';
  const text = isDark ? '#f1f5f9' : '#111827';
  const sub = isDark ? '#94a3b8' : '#6b7280';
  const border = isDark ? '#334155' : '#e5e7eb';

  if (!course) return null;

  const gradients = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
  ];
  const gradient = gradients[course.id % 4];

  const outcomes = [
    { icon: '🚀', text: `Dominarás "${course.title}" con confianza para aplicarlo en proyectos reales` },
    { icon: '📝', text: `Completarás ${course.quizzesCount} evaluaciones y ejercicios prácticos` },
    { icon: '💼', text: 'Contarás con un proyecto finalizado para tu portafolio profesional' },
  ];

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 20px' }}>

      {/* Volver */}
      <button
        onClick={() => setView('courses')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#2563eb', fontWeight: '600', fontSize: '0.9rem',
          marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0,
        }}
      >
        ← Volver al catálogo
      </button>

      {/* Hero */}
      <div style={{
        background: gradient, borderRadius: '16px', padding: '48px 40px',
        marginBottom: '32px', color: '#ffffff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '200px', height: '200px',
          backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '50%'
        }} />
        <p style={{ fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.12em', opacity: 0.8, marginBottom: '10px' }}>
          {course.category?.toUpperCase()} · CURSO #{course.id}
        </p>
        <h1 style={{ fontSize: '1.9rem', fontWeight: '800', marginBottom: '16px', lineHeight: 1.2 }}>
          {course.title}
        </h1>
        <p style={{ fontSize: '0.95rem', opacity: 0.92, lineHeight: 1.7, maxWidth: '600px' }}>
          {course.description}
        </p>
        <div style={{ display: 'flex', gap: '14px', marginTop: '28px', flexWrap: 'wrap' }}>
          {[
            ['🕒', `${course.durationHours}h de contenido`],
            ['📖', `${course.lessonsCount} lecciones`],
            ['🧠', `${course.quizzesCount} quizzes`],
            ['🗂️', `${course.sections?.length || 0} secciones`],
          ].map(([icon, label]) => (
            <div key={label} style={{
              backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: '8px',
              padding: '8px 16px', fontSize: '0.82rem', fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <span>{icon}</span> {label}
            </div>
          ))}
        </div>
      </div>

      {/* Descripción */}
      <div style={{ backgroundColor: card, borderRadius: '12px', padding: '32px', marginBottom: '24px', border: `1px solid ${border}` }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: text, marginBottom: '14px' }}>📋 Descripción del curso</h2>
        <p style={{ color: sub, lineHeight: 1.8, fontSize: '0.95rem' }}>{course.description}</p>
      </div>

      {/* Secciones del curso */}
      <div style={{ backgroundColor: card, borderRadius: '12px', padding: '32px', marginBottom: '24px', border: `1px solid ${border}` }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: text, marginBottom: '20px' }}>📚 Contenido del curso</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {course.sections?.map((section, i) => (
            <div key={section.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px', borderRadius: '10px',
              backgroundColor: isDark ? '#0f172a' : '#f9fafb',
              border: `1px solid ${border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: section.completed ? '#2563eb' : (isDark ? '#334155' : '#e5e7eb'),
                  color: section.completed ? '#fff' : sub,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.78rem', fontWeight: '700', flexShrink: 0,
                }}>
                  {section.completed ? '✓' : i + 1}
                </span>
                <span style={{ fontSize: '0.9rem', color: text, fontWeight: '500' }}>{section.title}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: sub, whiteSpace: 'nowrap', marginLeft: '12px' }}>{section.duration}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Al terminar sabrás */}
      <div style={{ backgroundColor: card, borderRadius: '12px', padding: '32px', marginBottom: '32px', border: `1px solid ${border}` }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: text, marginBottom: '20px' }}>🎯 Al terminar este curso sabrás...</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {outcomes.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px', borderRadius: '10px',
              backgroundColor: isDark ? '#0f172a' : '#f9fafb',
              border: `1px solid ${border}`,
            }}>
              <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
              <p style={{ color: text, fontSize: '0.92rem', fontWeight: '500', margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CONTENEDOR DE ACCIONES (Botones inferiores de navegación) */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Botón tradicional: Ir al contenido */}
        <button
          onClick={() => setView('content')}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 36px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          Ir al contenido del curso
        </button>

        {/* NUEVO BOTÓN: Dar examen (Se renderiza condicionalmente si el curso incluye certificación) */}
        {course.hasCertificationExam && (
          <button
            onClick={() => setView('take-exam')}
            style={{
              backgroundColor: '#238636',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 36px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 6px -1px rgba(35, 134, 54, 0.2)',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e6f2f'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#238636'}
          >
            🎓 Dar Examen de Certificación
          </button>
        )}
      </div>
    </div>
  );
};