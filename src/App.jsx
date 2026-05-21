import React, { useState, useContext, useCallback } from 'react';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useFetch } from './hooks/useFetch';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CourseList } from './components/CourseList';
import { Profile } from './components/Profile';

const MainApp = () => { 
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const { user } = useContext(AuthContext);
  
  // Enrutador de estado simple: 'courses' o 'profile'
  const [view, setView] = useState('courses');
  const [sidebarTab, setSidebarTab] = useState('todos'); // 'novedades', 'todos', 'mis-cursos'
  const [searchTerm, setSearchTerm] = useState('');

  // Consumo de la API con los datos de cursos/tareas
  const { data: apiCourses, loading } = useFetch('https://jsonplaceholder.typicode.com/todos');

  const [currentPage, setCurrentPage] = useState(1); // Estado para controlar la página actual
  const [favorites, setFavorites] = useState([]); // Estado para "Mis Cursos"

  const toggleFavorite = useCallback((courseId) => {
    setFavorites(prev => 
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
    // Reiniciamos la página a 1 si se quita un curso tildado estando en la pestaña "Mis Cursos"
    setCurrentPage(1);
  }, []);

  // Manejador del cambio de pestañas en el Sidebar
  const handleTabChange = (tabId) => {
    setSidebarTab(tabId);
    setCurrentPage(1); // Resetea el paginado al cambiar de vista para evitar desbordamientos
    setView('courses');
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Resetea el paginado al escribir letra por letra
  };
  return (
    <div style={{ backgroundColor: isDark ? '#0f172a' : '#f9fafb', color: isDark ? '#f8fafc' : '#000000', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Barra de Navegación Superior */}
      <Navbar setView={setView} searchTerm={searchTerm} setSearchTerm={handleSearchChange} />

      {/* Contenedor Split Layout */}
      <div style={{ display: 'flex' }}>
        {/* Barra Lateral */}
        <Sidebar currentTab={sidebarTab} setCurrentTab={handleTabChange} setView={setView} />

        {/* Panel de visualización principal */}
        <main style={{ flexGrow: 1, padding: '40px', backgroundColor: '#f9fafb' }}>
          {view === 'profile' ? (
            <Profile setView={setView} />
          ) : (
            <>
              {loading ? (
                <p style={{ color: '#2563eb', fontWeight: '600' }}>Sincronizando catálogo desde la API...</p>
              ) : (
                <CourseList 
                  courses={apiCourses} 
                  searchTerm={searchTerm} 
                  tabActive={sidebarTab} 
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Cambio de tema  */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          padding: '12px 20px',
          borderRadius: '30px',
          border: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`,
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          color: isDark ? '#fbbf24' : '#1e293b',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1000,
          transition: 'transform 0.2s ease, background-color 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        title="Alternar Modo de Color Completo"
      >
        <span>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
      </button>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </AuthProvider>
  );
}