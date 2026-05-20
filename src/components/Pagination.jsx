import React from 'react';

export const Pagination = ({ totalItems, itemsPerPage = 15, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Si no hay suficientes elementos para paginar, no renderizamos nada
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      marginTop: '30px',
      padding: '10px 0'
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          backgroundColor: '#fff',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1
        }}
      >
        Anterior
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            backgroundColor: currentPage === page ? '#2563eb' : '#fff',
            color: currentPage === page ? '#fff' : '#374151',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          backgroundColor: '#fff',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1
        }}
      >
        Siguiente
      </button>
    </div>
  );
};