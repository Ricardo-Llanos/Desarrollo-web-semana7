import React, { useMemo, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Pagination } from './Pagination';

export const CourseList = ({ courses, searchTerm, tabActive, favorites, toggleFavorite, currentPage, setCurrentPage, setSelectedCourse, setView }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const ITEMS_PER_PAGE = 15;

  const processedCourses = useMemo(() => {
    let result = [...courses];

    if (tabActive === 'novedades') {
      result = result.filter(c => !favorites.includes(c.id) && c.id % 2 === 0);
    } else if (tabActive === 'mis-cursos') {
      result = result.filter(c => favorites.includes(c.id));
    } else if (tabActive === 'todos') {
      result = [...courses];
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

  return (
    <div style={{ padding: '10px 0' }}>
      <h2 style={{ fontSize: '1.6rem', color: isDark ? '#f8fafc' : '#111827', margin: '0 0 20px 0', textTransform: 'capitalize' }}>
        {tabActive === 'todos' ? 'Todos los Cursos' : tabActive === 'mis-cursos' ? 'Mis Cursos (Favoritos ❤️)' : 'Novedades'}
        <span style={{ fontSize: '1rem', color: '#6b7280', marginLeft: '10px' }}>({processedCourses.length} encontrados)</span>
      </h2>

      {paginatedCourses.length === 0 ? (
        <p style={{ color: '#6b7280', backgroundColor: isDark ? '#1e293b' : '#fff', padding: '20px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}` }}>
          No se encontraron cursos.
        </p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {paginatedCourses.map((course) => {
              const isFav = favorites.includes(course.id);
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
                  position: 'relative'
                }}>
                  <button
                    onClick={e => { e.stopPropagation(); toggleFavorite(course.id); }}
                    style={{
                      position: 'absolute', top: '12px', right: '12px',
                      backgroundColor: isDark ? '#334155' : '#ffffff',
                      border: 'none', borderRadius: '50%',
                      width: '32px', height: '32px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', fontSize: '1.2rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)', zIndex: 10
                    }}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>

                  <div style={{ height: '110px', background: gradientBg, width: '100%' }}></div>
              
                  <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 'bold', textTransform: 'uppercase' }}>{course.category}</span>
                    
                    <h3 style={{ fontSize: '1.1rem', margin: '6px 0 10px 0', color: isDark ? '#f1f5f9' : '#111827', fontWeight: '600' }}>
                      {course.title}
                    </h3>
                    
                    <p style={{ fontSize: '0.88rem', color: isDark ? '#94a3b8' : '#6b7280', margin: '0 0 15px 0', lineHeight: '1.4', flexGrow: 1 }}>
                      {course.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${isDark ? '#334155' : '#f3f4f6'}`, paddingTop: '12px', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#6b7280' }}>
                        <span>📖 {course.lessonsCount} Clases</span>
                        <span>📊 {course.quizzesCount} Tests</span>
                      </div>

                      <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: `conic-gradient(#2563eb ${progress * 3.6}deg, ${isDark ? '#334155' : '#e5e7eb'} 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: isDark ? '#1e293b' : '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '700', color: isDark ? '#f1f5f9' : '#1f2937' }}>
                          {progress}%
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedCourse(course); 
                        setView('intro');
                      }}
                      style={{ width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                    >
                      Ver Contenido
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination totalItems={processedCourses.length} itemsPerPage={ITEMS_PER_PAGE} currentPage={currentPage} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  );
};