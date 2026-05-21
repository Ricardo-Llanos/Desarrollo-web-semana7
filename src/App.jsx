import React, { useState, useContext, useCallback } from 'react';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import initialCoursesData from './data/CoursesData.json';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CourseList } from './components/CourseList';
import { CourseContent } from './components/CourseContent';
import { Profile } from './components/Profile';

const MainApp = () => {
  const { theme, toggleTheme } = React.useContext(ThemeContext); 
  const isDark = theme === 'dark';

  const [view, setView] = useState('courses'); 
  const [sidebarTab, setSidebarTab] = useState('todos'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  
  // Estado para capturar qué curso con su estructura JSON interna fue clickeado
  const [selectedCourse, setSelectedCourse] = useState(null); 

  const toggleFavorite = React.useCallback((courseId) => {
    setFavorites(prev => prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]);
    setCurrentPage(1);
  }, []);

  const isContentView = view === 'content';

  return (
    <div style={{ 
      backgroundColor: isDark ? '#0f172a' : '#f9fafb', color: isDark ? '#f8fafc' : '#000000',
      minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', transition: 'all 0.3s ease'
    }}>
      <Navbar setView={setView} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div style={{ display: 'flex' }}>
        {!isContentView && (
          <Sidebar currentTab={sidebarTab} setCurrentTab={setSidebarTab} setView={setView} />
        )}

        <main style={{ flexGrow: 1, padding: '40px' }}>
          {view === 'profile' && <Profile setView={setView} />}
          
          {view === 'courses' && (
            <CourseList 
              courses={initialCoursesData}
              searchTerm={searchTerm} 
              tabActive={sidebarTab} 
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              setSelectedCourse={setSelectedCourse}
              setView={setView}
            />
          )}

          {view === 'content' && selectedCourse && (
            <CourseContent course={selectedCourse} setView={setView} />
          )}
        </main>
      </div>

      <button onClick={toggleTheme} style={{ position: 'fixed', bottom: '25px', right: '25px', padding: '12px 20px', borderRadius: '30px', cursor: 'pointer', zIndex: 1000 }}>
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