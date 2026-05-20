import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Pagination } from './Pagination';

export const CourseList = ({ courses, searchTerm, tabActive, favorites, toggleFavorite, currentPage, setCurrentPage }) => {
  const ITEMS_PER_PAGE = 15;

  // IA: Redundancia de renderizado por filtros múltiples -> Solución manual: useMemo unificado para tab + búsqueda
  const processedCourses = useMemo(() => {
    let result = [...courses];
    
    // 1. Filtrar por Tab de la Barra Lateral
    if (tabActive === 'novedades') {
      result = result.filter(c => !favorites.includes(c.id) && c.id % 2 === 0);

    } else if (tabActive === 'mis-cursos') {
      result = result.filter(c => favorites.includes(c.id));

    }else if (tabActive === 'todos') {
      result = [...courses];
    }

    // 2. Filtrar por término de búsqueda del Navbar
    if (searchTerm) {
      result = result.filter(c => c.title.toLowerCase().trim().startsWith(searchTerm.toLowerCase().trim()));
    }

    return result;
  }, [courses, searchTerm, tabActive, favorites]);

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedCourses, currentPage]);
  return (
    <div style={{ padding: '10px 0' }}>
      <h2 style={{ fontSize: '1.6rem', color: '#111827', margin: '0 0 20px 0', textTransform: 'capitalize' }}>
        {tabActive === 'todos' ? 'Todos los Cursos' : tabActive === 'mis-cursos' ? 'Mis Cursos (Favoritos ❤️)' : 'Novedades'} 
        <span style={{ fontSize: '1rem', color: '#6b7280', marginLeft: '10px' }}>({processedCourses.length} encontrados)</span>
      </h2>
      
      {paginatedCourses.length === 0 ? (
        <p style={{ color: '#6b7280', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          No se encontraron cursos que coincidan exactamente desde el inicio con el término buscado.
        </p>
      ) : (
        <>
          {/* DISEÑO EN MOSAICO */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {paginatedCourses.map((course, idx) => {
              const isFav = favorites.includes(course.id);
              const gradientBg = [
                'linear-gradient(135deg, #fecdd3, #fda4af)',
                'linear-gradient(135deg, #ccfbf1, #99f6e4)',
                'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                'linear-gradient(135deg, #ffedd5, #fed7aa)'
              ][course.id % 4];

              return (
                <div key={course.id} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  border: '1px solid #f3f4f6',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative' // Para posicionar el corazón encima
                }}>
                  
                  {/* REQUERIMIENTO: Corazón encima de la tarjeta */}
                  <button
                    onClick={() => toggleFavorite(course.id)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: '#ffffff',
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
                    }}
                    title={isFav ? "Quitar de mis cursos" : "Agregar a mis cursos"}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>

                  {/* Imagen Estilizada */}
                  <div style={{ height: '110px', background: gradientBg, width: '100%' }}></div>
                  
                  {/* Detalles del Curso */}
                  <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 'bold', marginBottom: '4px' }}>
                      ID: #{course.id}
                    </span>
                    <h3 style={{ fontSize: '1rem', margin: '0 0 12px 0', color: '#111827', textTransform: 'capitalize', fontWeight: '600', lineHeight: '1.4' }}>
                      {course.title.split(' ').slice(0, 3).join(' ')} 7th Grade
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#6b7280', marginBottom: '15px' }}>
                      <span>📖 32 Lecciones</span>
                      <span>📊 4 Quizzes</span>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ height: '6px', width: '100%', backgroundColor: '#e5e7eb', borderRadius: '3px' }}>
                        <div style={{ height: '100%', width: isFav ? '100%' : '20%', backgroundColor: '#2563eb', borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Renderizado de la Paginación Reutilizable */}
          <Pagination
            totalItems={processedCourses.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};