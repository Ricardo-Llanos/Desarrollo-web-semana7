import React, { useState, useContext, useCallback } from 'react';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ExamProvider } from './context/ExamContext';
import initialCoursesData from './data/CoursesData.json';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CourseList } from './components/CourseList';
import { CourseContent } from './components/CourseContent';
import { Profile } from './components/Profile';
import { Introduction } from './components/Introduction';
import { AdminDashboard } from './components/AdminDashboard';
import { Login } from './components/Login';
import { UserManagement } from './components/UserManagement';
import { CertificateView } from './components/CertificateView';
import { ExamCreator } from './components/ExamCreator';
import { TakeExam } from './components/TakeExam';
import { ResumeCV } from './components/ResumeCV';
import { getCertificateByCode } from './utils/certificates';

// Barra de navegación por rol (Req. 1, 2, 4, 5)
const NavTabs = ({ view, setView, isAdmin, isDark }) => {
  const tabs = isAdmin
    ? [
        { id: 'courses', label: '📚 Cursos' },
        { id: 'users', label: '👥 Usuarios' },
        { id: 'admin', label: '⚙️ Admin Cursos' },
      ]
    : [
        { id: 'courses', label: '📚 Cursos' },
        { id: 'cv', label: '🎓 Mi CV' },
      ];

  return (
    <div style={{
      display: 'flex', gap: '8px', padding: '10px 40px', overflowX: 'auto',
      backgroundColor: isDark ? '#0f172a' : '#fff',
      borderBottom: `1px solid ${isDark ? '#1e293b' : '#f0f0f0'}`
    }}>
      {tabs.map(t => {
        const active = view === t.id;
        return (
          <button key={t.id} onClick={() => setView(t.id)} className="btn-anim"
            style={{
              whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
              border: `1px solid ${active ? '#2563eb' : (isDark ? '#334155' : '#e5e7eb')}`,
              backgroundColor: active ? '#2563eb' : 'transparent',
              color: active ? '#fff' : (isDark ? '#94a3b8' : '#4b5563'),
              fontWeight: 600, fontSize: '0.85rem'
            }}>
            {t.label}
          </button>
        );
      })}
    </div>
  );
};

const MainApp = () => {
  const { theme, toggleTheme } = useContext(ThemeContext); 
  const { currentUser, isAdmin } = useContext(AuthContext);
  const isDark = theme === 'dark';

  const [view, setView] = useState('courses'); 
  const [sidebarTab, setSidebarTab] = useState('todos'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [courses, setCourses] = useState(() => {
    let rawCourses = [];
    const saved = localStorage.getItem('courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          rawCourses = parsed;
        }
      } catch (e) {
        console.error("Error loading courses from localStorage", e);
      }
    }
    if (rawCourses.length === 0) {
      rawCourses = initialCoursesData;
    }

    // Automatically enable certification exams for React (ID: 1) and Node.js (ID: 2)
    const mapped = rawCourses.map(c => {
      if (c.id === 1 || c.id === 2) {
        return { ...c, hasCertificationExam: true };
      }
      return c;
    });

    localStorage.setItem('courses', JSON.stringify(mapped));
    return mapped;
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

  // Sembrado automático de exámenes por defecto para React y Node.js
  React.useEffect(() => {
    // 1. Examen de React (ID: 1)
    const reactKey = 'exam_course_1';
    if (!localStorage.getItem(reactKey)) {
      const reactExam = {
        passingScore: 80,
        questions: [
          {
            id: 101,
            text: '¿Cuál de los siguientes Hooks de React se utiliza para memoizar valores computados costosos?',
            options: [
              { id: 'A', text: 'useCallback', isCorrect: false },
              { id: 'B', text: 'useMemo', isCorrect: true },
              { id: 'C', text: 'useEffect', isCorrect: false },
              { id: 'D', text: 'useRef', isCorrect: false }
            ]
          },
          {
            id: 102,
            text: '¿Cuáles de los siguientes Hooks de React ayudan a evitar re-renderizados innecesarios de componentes hijos? (Selección Múltiple)',
            options: [
              { id: 'A', text: 'useMemo', isCorrect: true },
              { id: 'B', text: 'useCallback', isCorrect: true },
              { id: 'C', text: 'useState', isCorrect: false },
              { id: 'D', text: 'useReducer', isCorrect: false }
            ]
          },
          {
            id: 103,
            text: 'En React, ¿para qué sirve el segundo argumento de useEffect (el array de dependencias)?',
            options: [
              { id: 'A', text: 'Define el estado inicial del efecto.', isCorrect: false },
              { id: 'B', text: 'Indica a React cuándo debe volver a ejecutarse el efecto.', isCorrect: true },
              { id: 'C', text: 'Controla la cantidad de re-renders del componente.', isCorrect: false },
              { id: 'D', text: 'Limpia los event listeners automáticamente.', isCorrect: false }
            ]
          },
          {
            id: 104,
            text: '¿Qué regla es obligatoria al utilizar React Hooks?',
            options: [
              { id: 'A', text: 'Deben declararse dentro de ciclos for o condicionales.', isCorrect: false },
              { id: 'B', text: 'Solo deben llamarse en el nivel superior de funciones de React.', isCorrect: true },
              { id: 'C', text: 'Solo pueden declararse en componentes de clase.', isCorrect: false },
              { id: 'D', text: 'Requieren obligatoramente la importación de ReactDOM.', isCorrect: false }
            ]
          },
          {
            id: 105,
            text: '¿Cuáles de las siguientes afirmaciones sobre el Hook useRef son verdaderas? (Selección Múltiple)',
            options: [
              { id: 'A', text: 'Mutar .current no provoca un re-renderizado del componente.', isCorrect: true },
              { id: 'B', text: 'Puede usarse para persistir valores entre renders sin alertar al ciclo de vida.', isCorrect: true },
              { id: 'C', text: 'Renderiza el componente cada vez que cambia su valor.', isCorrect: false },
              { id: 'D', text: 'Solo sirve para referenciar elementos del DOM.', isCorrect: false }
            ]
          }
        ]
      };
      localStorage.setItem(reactKey, JSON.stringify(reactExam));
    }

    // 2. Examen de Node.js (ID: 2)
    const nodeKey = 'exam_course_2';
    if (!localStorage.getItem(nodeKey)) {
      const nodeExam = {
        passingScore: 80,
        questions: [
          {
            id: 201,
            text: '¿Qué módulo nativo de Node.js se utiliza para crear un servidor HTTP básico sin dependencias externas?',
            options: [
              { id: 'A', text: 'fs', isCorrect: false },
              { id: 'B', text: 'http', isCorrect: true },
              { id: 'C', text: 'path', isCorrect: false },
              { id: 'D', text: 'express', isCorrect: false }
            ]
          },
          {
            id: 202,
            text: 'En Express, ¿cuáles son los parámetros estándar que recibe una función de middleware? (Selección Múltiple)',
            options: [
              { id: 'A', text: 'req (Request)', isCorrect: true },
              { id: 'B', text: 'res (Response)', isCorrect: true },
              { id: 'C', text: 'next (Siguiente middleware)', isCorrect: true },
              { id: 'D', text: 'err (Solo para middlewares de error)', isCorrect: true }
            ]
          },
          {
            id: 203,
            text: '¿Cuál es el propósito del Event Loop en Node.js?',
            options: [
              { id: 'A', text: 'Ejecutar código de múltiples hilos en paralelo mediante CPU bound operations.', isCorrect: false },
              { id: 'B', text: 'Manejar operaciones de Entrada/Salida asíncronas no bloqueantes en un solo hilo.', isCorrect: true },
              { id: 'C', text: 'Compilar el código JavaScript directamente a código de máquina binario.', isCorrect: false },
              { id: 'D', text: 'Optimizar las consultas de base de datos MongoDB.', isCorrect: false }
            ]
          },
          {
            id: 204,
            text: 'En Express, ¿cómo se accede a los parámetros de ruta en una URL como /users/:id?',
            options: [
              { id: 'A', text: 'req.body.id', isCorrect: false },
              { id: 'B', text: 'req.query.id', isCorrect: false },
              { id: 'C', text: 'req.params.id', isCorrect: true },
              { id: 'D', text: 'req.headers.id', isCorrect: false }
            ]
          },
          {
            id: 205,
            text: '¿Cuáles de los siguientes son middlewares populares y de uso común en Express para seguridad y parseo? (Selección Múltiple)',
            options: [
              { id: 'A', text: 'cors', isCorrect: true },
              { id: 'B', text: 'helmet', isCorrect: true },
              { id: 'C', text: 'express.json()', isCorrect: true },
              { id: 'D', text: 'fs.readFile()', isCorrect: false }
            ]
          }
        ]
      };
      localStorage.setItem(nodeKey, JSON.stringify(nodeExam));
    }
  }, []);

  // 0) RUTAS PÚBLICAS (sin sesión):
  const params = new URLSearchParams(window.location.search);
  const certCode = params.get('cert');           // ?cert=CODIGO  -> certificado (Req. 3)
  if (certCode) return <CertificateView cert={getCertificateByCode(certCode)} isPublic />;
  const cvId = params.get('cv');                  // ?cv=ID        -> currículum (Req. 5)
  if (cvId) return <ResumeCV userId={cvId} isPublic />;

  // 1) Sin sesión -> login
  if (!currentUser) return <Login />;

  const isContentView = view === 'content';
  const isExamEditor = typeof view === 'object' && view?.name === 'EXAM_EDITOR';
  const isAdminView = view === 'admin' || isExamEditor;
  
  return (
    <div style={{ 
      backgroundColor: isDark ? '#0f172a' : '#f9fafb', color: isDark ? '#f8fafc' : '#000000',
      minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', transition: 'all 0.3s ease'
    }}>
      <Navbar setView={setView} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {!isContentView && isAdmin && <NavTabs view={view} setView={setView} isAdmin={isAdmin} isDark={isDark} />}

      <div style={{ display: 'flex' }}>
        {view === 'courses' && (
          <Sidebar currentTab={sidebarTab} setCurrentTab={setSidebarTab} setView={setView} />
        )}

        <main style={{ flexGrow: 1, padding: '40px' }}>
          {view === 'profile' && <Profile setView={setView} />}

          {/* Vistas solo administrador (doble protección) */}
          {view === 'admin' && isAdmin && <AdminDashboard courses={courses} setCourses={setCourses} setView={setView} />}
          {view === 'users' && isAdmin && <UserManagement setView={setView} />}

          {/* Vistas de usuario */}
          {view === 'take' && !isAdmin && <TakeExam setView={setView} />}
          {view === 'cv' && !isAdmin && <ResumeCV userId={currentUser.id} setView={setView} />}
          
          {isExamEditor ? (
            <ExamCreator 
              courseId={view.courseId}
              courseTitle={view.courseTitle}
              onBack={() => setView('admin')}
            />
          ) : view === 'admin' ? (
            <AdminDashboard courses={courses} setCourses={setCourses} setView={setView} />
          ) : null}

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
      
      {/* <button 
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
      </button> */}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ExamProvider>
        <ThemeProvider>
          <MainApp />
        </ThemeProvider>
      </ExamProvider>
    </AuthProvider>
  );
}