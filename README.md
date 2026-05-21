Scholarly — Dashboard de Gestión de Cursos
Asignatura: Desarrollo de Aplicaciones Web (IS093A)
Unidad I: Desarrollo Web Frontend
Tema: React Hooks: useState, useEffect, useContext, useCallback, useMemo y Hooks Personalizados
Semana: 07 — Laboratorio

Descripción General
Scholarly es un dashboard académico de gestión de cursos desarrollado con React 19 + Vite. Consume una API REST externa, permite filtrar y paginar cursos, guardar favoritos, cambiar entre tema claro/oscuro y navegar entre vistas (catálogo y perfil), todo aplicando los hooks de React de forma estratégica y justificada.

Instalación y Ejecución

Instalar dependencias
npm install

Ejecutar en modo desarrollo
npm run dev

Verificar ESLint
npm run lint

Estructura del Proyecto
src/
├── context/
│   ├── ThemeContext.jsx     # useContext — tema claro/oscuro global
│   └── AuthContext.jsx      # useContext — datos del usuario autenticado
├── hooks/
│   └── useFetch.js          # Hook personalizado — fetch + useEffect + cleanup
├── components/
│   ├── Navbar.jsx           # Buscador dinámico + toggle de tema
│   ├── Sidebar.jsx          # Navegación por pestañas (Todos / Novedades / Mis Cursos)
│   ├── CourseList.jsx       # useMemo × 2 — filtrado + paginación
│   ├── Pagination.jsx       # Componente reutilizable de paginación
│   └── Profile.jsx          # Vista de perfil con datos de AuthContext
├── App.jsx                  # Composición principal: useState, useCallback, routing de vistas
└── main.jsx

Diagrama de Flujo de Estado y Ciclo de Render
┌──────────────────────────────────────────────────────────────────┐
│  App() (root)                                                     │
│  ├── AuthProvider  →  AuthContext { user, setUser }              │
│  └── ThemeProvider →  ThemeContext { theme, toggleTheme }        │
│                                                                   │
│       MainApp                                                     │
│       ├── useState: view, sidebarTab, searchTerm                 │
│       ├── useState: currentPage, favorites[]                     │
│       ├── useFetch(url) ──► useEffect[url] + AbortController    │
│       │         └── { data: apiCourses, loading }                │
│       └── useCallback: toggleFavorite                            │
│                │                                                  │
│                ▼                                                  │
│         CourseList (recibe props)                                 │
│         ├── useMemo[courses, searchTerm, tabActive, favorites]   │
│         │       └── processedCourses (filtrado por tab + search) │
│         └── useMemo[processedCourses, currentPage]               │
│                 └── paginatedCourses (slice de la página actual) │
└──────────────────────────────────────────────────────────────────┘

CICLO DE RENDER AL BUSCAR UN CURSO:
Usuario escribe en Navbar
        │
        ▼
handleSearchChange(term) → setSearchTerm + setCurrentPage(1)
        │
        ▼
MainApp re-renderiza → pasa searchTerm como prop a CourseList
        │
        ▼
CourseList: useMemo detecta que searchTerm cambió
        │
        ▼
processedCourses se recalcula (filter por startsWith)
        │
        ▼
paginatedCourses se recalcula (slice página 1)
        │
        ▼
Tarjetas renderizadas actualizadas ✓

CICLO DE RENDER AL CAMBIAR TEMA:
toggleTheme() → ThemeContext cambia
        │
        ▼
Navbar, Profile re-renderizan (consumen ThemeContext)
        │
        ▼
CourseList NO re-renderiza (no consume ThemeContext) ✓

Justificación Técnica de Cada Hook
useContext — ThemeContext y AuthContext
Se implementaron dos contextos separados para evitar prop drilling desde App hasta componentes profundos como Navbar o Profile.
Sin useContextCon useContext (elegido)theme pasado como prop a App → MainApp → Navbar → botónNavbar llama directamente useContext(ThemeContext)Cambiar nombre de usuario requeriría pasar setUser por 3 nivelesProfile accede a AuthContext directamente
Decisión de diseño: Se usaron dos contextos independientes (ThemeContext y AuthContext) en lugar de uno combinado, para que un cambio de tema no dispare re-render en componentes que solo consumen datos del usuario, y viceversa.

useFetch — Hook Personalizado con useEffect + cleanup
js// src/hooks/useFetch.js
export const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController(); // cleanup: cancela la petición
    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        const result = await response.json();
        setData(result);
      } catch (error) {
        if (error.name !== 'AbortError') console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort(); // ← CLEANUP activo
  }, [url]);

  return { data, loading };
};
¿Por qué un hook personalizado y no useEffect directo en App?

Reutilizable: cualquier componente puede llamar useFetch(otraUrl) sin duplicar código.
Encapsulación: la lógica de loading, error y cleanup queda aislada.
Cleanup con AbortController: si el componente se desmonta antes de que termine el fetch (navegación rápida), la petición se cancela y se evitan memory leaks y actualizaciones de estado en componentes desmontados.


useState — Estado local de UI en MainApp
Se usaron múltiples useState en MainApp para valores de UI independientes entre sí:
jsconst [view, setView] = useState('courses');        // vista activa
const [sidebarTab, setSidebarTab] = useState('todos'); // pestaña del sidebar
const [searchTerm, setSearchTerm] = useState('');   // texto del buscador
const [currentPage, setCurrentPage] = useState(1); // página activa
const [favorites, setFavorites] = useState([]);    // IDs de cursos guardados
¿Por qué useState y no useReducer aquí?
Cada valor es independiente y tiene un único setter simple. No existe lógica condicional cruzada entre ellos que justifique centralizar en un reducer. useReducer habría agregado complejidad sin beneficio real en este caso.

useCallback — toggleFavorite estable
jsconst toggleFavorite = useCallback((courseId) => {
  setFavorites(prev =>
    prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
  );
  setCurrentPage(1);
}, []); // deps vacías: solo depende del setter de useState (estable por garantía de React)
toggleFavorite se pasa como prop a CourseList. Sin useCallback, cada render de MainApp crearía una nueva referencia de función, causando re-renders innecesarios en CourseList aunque los datos no hayan cambiado.

useMemo × 2 — Filtrado y paginación en CourseList
js// Memo 1: filtrado unificado por tab + búsqueda
const processedCourses = useMemo(() => {
  let result = [...courses];
  if (tabActive === 'novedades') result = result.filter(c => !favorites.includes(c.id) && c.id % 2 === 0);
  else if (tabActive === 'mis-cursos') result = result.filter(c => favorites.includes(c.id));
  if (searchTerm) result = result.filter(c => c.title.toLowerCase().trim().startsWith(searchTerm.toLowerCase().trim()));
  return result;
}, [courses, searchTerm, tabActive, favorites]);

// Memo 2: paginación sobre el resultado ya filtrado
const paginatedCourses = useMemo(() => {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  return processedCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
}, [processedCourses, currentPage]);
La API devuelve 200 items. Sin useMemo, el filtrado y el slice se recalcularían en cada render de CourseList (incluyendo cuando cambia el tema o el perfil). Con useMemo solo se recalcula cuando cambian sus dependencias reales.

Métricas React DevTools Profiler

Sesión grabada: cargar app → buscar término → cambiar pestaña → marcar 3 favoritos → cambiar tema.

AcciónComponentes re-renderizadosObservaciónEscribir en buscadorMainApp + CourseListuseMemo recalcula solo processedCoursesCambiar tema (toggleTheme)Navbar, Profile (si visible)CourseList no re-renderiza (no consume ThemeContext)Marcar favoritoMainApp + CourseListuseCallback evita nueva referencia de funciónCambiar pestaña sidebarMainApp + CourseListReset de página + recálculo de processedCourses
Resultado: CourseList solo se re-renderiza cuando sus props reales cambian, no por efectos secundarios del tema o del perfil.

Adjuntar capturas del Profiler en /docs/profiler/ del repositorio (grabar con React DevTools → Profiler → Record).


Checklist de Validación Final

 npm run dev ejecuta sin errores en consola
 npm run lint → 0 warnings de react-hooks/exhaustive-deps
 React DevTools Profiler grabado: confirmar que CourseList no re-renderiza al cambiar tema
 useFetch cleanup activo: abrir y cerrar la app rápidamente no genera errores de "Can't perform a React state update on an unmounted component"
 Favoritos persisten al cambiar de pestaña
 Paginación se resetea a página 1 al buscar o cambiar pestaña
 Perfil muestra datos del AuthContext y permite cambiar nivel
 README.md subido al repositorio GitHub


Integrantes
Espíritu Diaz OLayne GUadalupe María Isabel
Llanos Lozano Ricardo Alexander

Referencias

React Docs — Hooks Reference
React DevTools Profiler
Rules of Hooks
JSONPlaceholder API