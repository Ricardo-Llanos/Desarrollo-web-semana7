import React from 'react';

export const Sidebar = ({ currentTab, setCurrentTab, setView }) => {
  const tabs = [
    { id: 'novedades', label: '✨ Novedades' },
    { id: 'todos', label: '📚 Todos los cursos' },
    { id: 'mis-cursos', label: '📖 Mis cursos' }
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #f0f0f0',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minHeight: 'calc(100vh - 71px)'
    }}>
      {tabs.map(tab => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              setCurrentTab(tab.id);
              setView('courses'); // Asegura regresar al catálogo si estaba en perfil
            }}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isActive ? '#f3f4f6' : 'transparent',
              color: isActive ? '#2563eb' : '#4b5563',
              fontWeight: isActive ? '600' : '500',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </aside>
  );
};