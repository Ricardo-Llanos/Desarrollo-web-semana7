import React, { useState, useMemo, useCallback } from 'react';
import { Pagination } from './Pagination';

export const CourseList = ({ courses, searchTerm, tabActive, favorites, toggleFavorite, currentPage, setCurrentPage, setView, setSelectedCourse }) => {
  const ITEMS_PER_PAGE = 15;

  const processedCourses = useMemo(() => {
    let result = [...courses];

    if (tabActive === 'novedades') {
      result = result.filter(c => !favorites.includes(c.id) && c.id % 2 === 0);
    } else if (tabActive === 'mis-cursos') {
      result = result.filter(c => favorites.includes(c.id));
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
      <h2 style={{ fontSize: '1.6rem', color: '#111827', margin: '0 0 20px 0' }}>
        {tabActive === 'todos' ? 'Todos los Cursos' : tabActive === 'mis-cursos' ? 'Mis Cursos ❤️' : 'Novedades'}
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
                  <button
                    onClick={e => { e.stopPropagation(); toggleFavorite(course.id); }}
                    style={{
                      position: 'absolute', top: '12px', right: '12px',
                      backgroundColor: '#ffffff', border: 'none', borderRadius: '50%',
                      width: '32px', height: '32px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', fontSize: '1.1rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)', zIndex: 10,
                    }}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>

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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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