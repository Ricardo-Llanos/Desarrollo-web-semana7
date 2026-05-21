<<<<<<< HEAD
import React, { useState, useMemo, useCallback } from 'react';
import { Pagination } from './Pagination';

export const CourseList = ({ courses, searchTerm, tabActive, favorites, toggleFavorite, currentPage, setCurrentPage, setView, setSelectedCourse }) => {
=======
import React, { useState, useMemo, useCallback, useRef, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Pagination } from './Pagination';

export const CourseList = ({ courses, searchTerm, tabActive, favorites, toggleFavorite, currentPage, setCurrentPage, setSelectedCourse, setView }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

>>>>>>> 4065e1b58d4e9b016e45429c3efb422d83fbd51c
  const ITEMS_PER_PAGE = 15;

  const processedCourses = useMemo(() => {
    let result = [...courses];

<<<<<<< HEAD
=======
    // 1. Filtrar por Tab de la Barra Lateral
>>>>>>> 4065e1b58d4e9b016e45429c3efb422d83fbd51c
    if (tabActive === 'novedades') {
      result = result.filter(c => !favorites.includes(c.id) && c.id % 2 === 0);
    } else if (tabActive === 'mis-cursos') {
      result = result.filter(c => favorites.includes(c.id));
<<<<<<< HEAD
=======

    } else if (tabActive === 'todos') {
      result = [...courses];
>>>>>>> 4065e1b58d4e9b016e45429c3efb422d83fbd51c
    }

    if (searchTerm) {
      result = result.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return result;
  }, [courses, searchTerm, tabActive, favorites]);

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedCourses, currentPage]);

  const gradients = [
    'linear-gradient(135deg, #fecdd3, #fda4af)',
    'linear-gradient(135deg, #ccfbf1, #99f6e4)',
    'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    'linear-gradient(135deg, #ffedd5, #fed7aa)',
  ];

  return (
    <div style={{ padding: '10px 0' }}>
<<<<<<< HEAD
      <h2 style={{ fontSize: '1.6rem', color: '#111827', margin: '0 0 20px 0' }}>
        {tabActive === 'todos' ? 'Todos los Cursos' : tabActive === 'mis-cursos' ? 'Mis Cursos ❤️' : 'Novedades'}
=======
      <h2 style={{ fontSize: '1.6rem', color: isDark ? '#f8fafc' : '#111827', margin: '0 0 20px 0', textTransform: 'capitalize' }}>
        {tabActive === 'todos' ? 'Todos los Cursos' : tabActive === 'mis-cursos' ? 'Mis Cursos (Favoritos ❤️)' : 'Novedades'}
>>>>>>> 4065e1b58d4e9b016e45429c3efb422d83fbd51c
        <span style={{ fontSize: '1rem', color: '#6b7280', marginLeft: '10px' }}>({processedCourses.length} encontrados)</span>
      </h2>

      {paginatedCourses.length === 0 ? (
        <p style={{ color: '#6b7280', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          No se encontraron cursos.
        </p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {paginatedCourses.map((course) => {
              const isFav = favorites.includes(course.id);
<<<<<<< HEAD

              return (
                <div
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setView('intro');
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    border: '1px solid #f3f4f6',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
                  }}
                >
                  {/* Corazón */}
=======
              const progress = course.progress || 0;
              const gradientBg = [
                'linear-gradient(135deg, #fecdd3, #fda4af)',
                'linear-gradient(135deg, #ccfbf1, #99f6e4)',
                'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                'linear-gradient(135deg, #ffedd5, #fed7aa)'
              ][course.id % 4];

              return (
                <div key={course.id} style={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.02)',
                  border: `1px solid ${isDark ? '#334155' : '#f3f4f6'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative' // Para posicionar el corazón encima
                }}>

                  {/* REQUERIMIENTO: Corazón encima de la tarjeta */}
>>>>>>> 4065e1b58d4e9b016e45429c3efb422d83fbd51c
                  <button
                    onClick={e => { e.stopPropagation(); toggleFavorite(course.id); }}
                    style={{
<<<<<<< HEAD
                      position: 'absolute', top: '12px', right: '12px',
                      backgroundColor: '#ffffff', border: 'none', borderRadius: '50%',
                      width: '32px', height: '32px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', fontSize: '1.1rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)', zIndex: 10,
=======
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: isDark ? '#334155' : '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      zIndex: 10,
                      transition: 'transform 0.1s ease'
>>>>>>> 4065e1b58d4e9b016e45429c3efb422d83fbd51c
                    }}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>

<<<<<<< HEAD
                  {/* Banner de color */}
                  <div style={{ height: '110px', background: gradients[course.id % 4], position: 'relative' }}>
                    <span style={{
                      position: 'absolute', bottom: '10px', left: '14px',
                      backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: '20px',
                      padding: '3px 10px', fontSize: '0.72rem', fontWeight: '700', color: '#374151'
                    }}>
                      {course.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '0.98rem', margin: '0 0 10px 0', color: '#111827', fontWeight: '700', lineHeight: '1.4' }}>
                      {course.title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '0 0 14px 0', lineHeight: '1.5' }}>
                      {course.description.slice(0, 80)}...
                    </p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', color: '#6b7280', marginBottom: '14px' }}>
                      <span>📖 {course.lessonsCount} lecciones</span>
                      <span>📝 {course.quizzesCount} quizzes</span>
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ height: '5px', backgroundColor: '#e5e7eb', borderRadius: '3px' }}>
                        <div style={{ height: '100%', width: isFav ? '100%' : '15%', backgroundColor: '#2563eb', borderRadius: '3px', transition: 'width 0.3s' }} />
                      </div>
=======
                  <div style={{ height: '110px', background: gradientBg, width: '100%' }}></div>
              
              <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 'bold', textTransform: 'uppercase' }}>{course.category}</span>
                
                <h3 style={{ fontSize: '1.1rem', margin: '6px 0 10px 0', color: isDark ? '#f1f5f9' : '#111827', fontWeight: '600' }}>
                  {course.title}
                </h3>
                
                <p style={{ fontSize: '0.88rem', color: isDark ? '#94a3b8' : '#6b7280', margin: '0 0 15px 0', lineHeight: '1.4', flexGrow: 1 }}>
                  {course.description}
                </p>

                {/* AREA INTERACTIVA DE PROGRESO (DISEÑO SPLIT: CRONOLOGÍA Y BARRA CIRCULAR) */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderTop: `1px solid ${isDark ? '#334155' : '#f3f4f6'}`, 
                  paddingTop: '12px',
                  marginBottom: '15px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#6b7280' }}>
                    <span>📖 {course.lessonsCount} Clases</span>
                    <span>📊 {course.quizzesCount} Tests</span>
                  </div>

                  {/* REQUERIMIENTO: BARRA DE PROGRESO CIRCULAR CON CSS CONIC-GRADIENT */}
                  <div 
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      // El degradado cónico rellena proporcionalmente el porcentaje en azul (#2563eb)
                      background: `conic-gradient(#2563eb ${progress * 3.6}deg, ${isDark ? '#334155' : '#e5e7eb'} 0deg)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                    title={`Progreso: ${progress}%`}
                  >
                    {/* Círculo interno para crear el efecto de anillo (Donut Chart) */}
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      color: isDark ? '#f1f5f9' : '#1f2937'
                    }}>
                      {progress}%
>>>>>>> 4065e1b58d4e9b016e45429c3efb422d83fbd51c
                    </div>
                  </div>
                </div>

<<<<<<< HEAD
          <Pagination
            totalItems={processedCourses.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
=======
                <button 
                  onClick={() => {
                    setSelectedCourse(course); 
                    setView('content');       
                  }}
                  style={{
                    width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#fff',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem'
                  }}
                >
                  Ver Contenido 🚀
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination totalItems={processedCourses.length} currentPage={currentPage} onPageChange={setCurrentPage} />
>>>>>>> 4065e1b58d4e9b016e45429c3efb422d83fbd51c
        </>
      )}
    </div>
  );
};