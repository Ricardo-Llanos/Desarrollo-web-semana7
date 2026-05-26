import React, { useState, useContext, useCallback } from 'react';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import initialCoursesData from './data/CoursesData.json';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CourseList } from './components/CourseList';
import { CourseContent } from './components/CourseContent';
import { Profile } from './components/Profile';
import { Introduction } from './components/Introduction';
import { AdminDashboard } from './components/AdminDashboard';
import { ExamCreator } from './components/ExamCreator';
import { TakeExam } from './components/TakeExam';

const MainApp = () => {
  const { theme, toggleTheme } = useContext(ThemeContext); 
  const isDark = theme === 'dark';

  const [view, setView] = useState('courses'); 
  const [sidebarTab, setSidebarTab] = useState('todos'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error loading courses from localStorage", e);
      }
    }
    return initialCoursesData;
  });
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [activeExamData, setActiveExamData] = useState({
    courseId: null,
    courseTitle: ''
  });

  const toggleFavorite = useCallback((courseId) => {
    setFavorites(prev => prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]);
    setCurrentPage(1);
  }, []);

  const isContentView = view === 'content';
  const isExamEditor = typeof view === 'object' && view?.name === 'EXAM_EDITOR';
  const isAdminView = view === 'admin' || isExamEditor;
  
  return (
    <div style={{ 
      backgroundColor: isDark ? '#0f172a' : '#f9fafb', color: isDark ? '#f8fafc' : '#000000',
      minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', transition: 'all 0.3s ease'
    }}>
      <Navbar setView={setView} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div style={{ display: 'flex' }}>
        {!isContentView && !isAdminView && (
          <Sidebar currentTab={sidebarTab} setCurrentTab={setSidebarTab} setView={setView} />
        )}

        <main style={{ flexGrow: 1, padding: '40px' }}>
          {view === 'profile' && <Profile setView={setView} />}
          
          {isExamEditor ? (
            <ExamCreator 
              courseId={view.courseId}
              courseTitle={view.courseTitle}
              onBack={() => setView('admin')}
            />
          ) : view === 'admin' ? (
            <AdminDashboard courses={courses} setCourses={setCourses} setView={setView} />
          ) : null}
          
          {/* {view === 'admin' && (
            activeExamData.courseId ? (
              <ExamCreator 
                courseId={activeExamData.courseId}
                courseTitle={activeExamData.courseTitle}
                onBack={() => setActiveExamData({ courseId: null, courseTitle: '' })}
              />
            ) : (
              <AdminDashboard 
                setView={setView} 
                // Enviamos una función puente en lugar de setView directo para capturar el salto al examen
                setExamView={(id, title) => setActiveExamData({ courseId: id, courseTitle: title })}
              />
            )
          )} */}

          {view === 'courses' && (
            <CourseList 
              courses={courses}
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

          {view === 'intro' && selectedCourse && (
            <Introduction course={selectedCourse} setView={setView} />
          )}

          {view === 'content' && selectedCourse && (
            <CourseContent course={selectedCourse} setView={setView} />
          )}

          {/* Debajo del condicional de view === 'content' de tu archivo original */}
          {view === 'take-exam' && selectedCourse && (
            <TakeExam 
              course={selectedCourse} 
              setView={setView} 
            />
          )}
        </main>
      </div>

      <button onClick={toggleTheme} style={{ position: 'fixed', bottom: '25px', right: '25px', padding: '12px 20px', borderRadius: '30px', cursor: 'pointer', zIndex: 1000 }}>
        <span>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
      </button>

      <button 
        onClick={() => setView(isAdminView ? 'courses' : 'admin')} 
        style={{ 
          position: 'fixed', 
          bottom: '25px', 
          right: '200px', 
          padding: '12px 20px', 
          borderRadius: '30px', 
          cursor: 'pointer', 
          zIndex: 1000,
          backgroundColor: isAdminView ? '#dc2626' : '#2563eb',
          color: '#fff',
          border: 'none',
          fontWeight: '600'
        }}
      >
        <span>{isAdminView ? 'Salir Admin' : 'Admin'}</span>
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