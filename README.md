A continuación, se presenta la totalidad de la respuesta estructurada en formato Markdown. Puede copiar todo el bloque de código inferior para obtener el documento completo de manera directa:

```markdown
# Scholarly — Dashboard de Gestión de Cursos

## Datos Informativos
* **Asignatura:** Desarrollo de Aplicaciones Web (IS093A)
* **Unidad I:** Desarrollo Web Frontend
* **Tema:** React Hooks: useState, useEffect, useContext, useCallback, useMemo y Hooks Personalizados
* **Semana:** 07 — Laboratorio

## Descripción General
Scholarly es un dashboard académico de gestión de cursos desarrollado con React 19 + Vite. Consume una API REST externa, permite filtrar y paginar cursos, guardar favoritos, cambiar entre tema claro/oscuro y navegar entre vistas (catálogo y perfil), todo aplicando los hooks de React de forma estratégica y justificada.

## Instalación y Ejecución

Instalar dependencias:
```bash
npm install

```

Ejecutar en modo desarrollo:

```bash
npm run dev

```

Verificar ESLint:

```bash
npm run lint

```

## Estructura del Proyecto

```text
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

```

## Diagrama de Flujo de Estado y Ciclo de Render

```text
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

```

### Ciclo de Render al Buscar un Curso

1. Usuario escribe en Navbar.
2. `handleSearchChange(term)` → `setSearchTerm` + `setCurrentPage(1)`.
3. `MainApp` re-renderiza → pasa `searchTerm` como prop a `CourseList`.
4. `CourseList`: `useMemo` detecta que `searchTerm` cambió.
5. `processedCourses` se recalcula (filter por `startsWith`).
6. `paginatedCourses` se recalcula (slice página 1).
7. Tarjetas renderizadas actualizadas correctamente.

### Ciclo de Render al Cambiar Tema

1. `toggleTheme()` → `ThemeContext` cambia.
2. `Navbar`, `Profile` re-renderizan (consumen `ThemeContext`).
3. `CourseList` NO re-renderiza (no consume `ThemeContext`) correctamente.

## Justificación Técnica de Cada Hook

### useContext — ThemeContext y AuthContext

Se implementaron dos contextos separados para evitar el acoplamiento excesivo de componentes mediante *prop drilling* desde `App` hasta componentes profundos como `Navbar` o `Profile`.

| Escenario sin useContext | Escenario con useContext (Seleccionado) |
| --- | --- |
| `theme` pasado como prop a `App` → `MainApp` → `Navbar` → botón | `Navbar` llama directamente a `useContext(ThemeContext)` |
| Cambiar nombre de usuario requeriría pasar `setUser` por 3 niveles | `Profile` accede a `AuthContext` directamente |

> **Decisión de diseño:** Se usaron dos contextos independientes (`ThemeContext` y `AuthContext`) en lugar de uno combinado, para que un cambio de tema no dispare re-renders en componentes que solo consumen datos del usuario, y viceversa.

### useFetch — Hook Personalizado con useEffect y cleanup

```javascript
// src/hooks/useFetch.js
import { useState, useEffect } from 'react';

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

```

**Ventajas de la implementación estructurada:**

* **Reutilización:** Cualquier componente puede invocar `useFetch(otraUrl)` sin duplicación de código fuente.
* **Encapsulación:** La lógica operacional de estados de carga, errores y limpiezas queda aislada de la capa de interfaz.
* **Manejo de Ciclo de Vida:** Si el componente se desmonta prematuramente, el `AbortController` cancela la petición, mitigando fugas de memoria (*memory leaks*).

### useState — Estado Local de IU en MainApp

Se utilizaron múltiples instancias de `useState` en `MainApp` para gestionar variables de interfaz independientes:

```javascript
const [view, setView] = useState('courses');        // vista activa
const [sidebarTab, setSidebarTab] = useState('todos'); // pestaña del sidebar
const [searchTerm, setSearchTerm] = useState('');   // texto del buscador
const [currentPage, setCurrentPage] = useState(1); // página activa
const [favorites, setFavorites] = useState([]);    // IDs de cursos guardados

```

> **Criterio técnico:** Cada valor es atómico y posee un método de actualización simple. Al no existir lógica condicional cruzada o interdependiente entre ellos, el uso de `useReducer` añadiría complejidad innecesaria sin aportar valor real a la solución architecture.

### useCallback — Instanciación Estable de toggleFavorite

```javascript
const toggleFavorite = useCallback((courseId) => {
  setFavorites(prev =>
    prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
  );
  setCurrentPage(1);
}, []); // Dependencias vacías: solo depende del setter (estable por especificación de React)

```

La función `toggleFavorite` se transfiere como propiedad a `CourseList`. Sin la envoltura de `useCallback`, cada ciclo de renderizado de `MainApp` generaría una nueva referencia en memoria de la función, provocando actualizaciones redundantes en `CourseList`.

### useMemo — Optimización de Filtrado y Paginación en CourseList

```javascript
// Operación 1: Filtrado unificado por pestaña y término de búsqueda
const processedCourses = useMemo(() => {
  let result = [...courses];
  if (tabActive === 'novedades') result = result.filter(c => !favorites.includes(c.id) && c.id % 2 === 0);
  else if (tabActive === 'mis-cursos') result = result.filter(c => favorites.includes(c.id));
  if (searchTerm) result = result.filter(c => c.title.toLowerCase().trim().startsWith(searchTerm.toLowerCase().trim()));
  return result;
}, [courses, searchTerm, tabActive, favorites]);

// Operación 2: Paginación segmentada sobre el conjunto de datos filtrado
const paginatedCourses = useMemo(() => {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  return processedCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
}, [processedCourses, currentPage]);

```

Dado que el endpoint de destino retorna un volumen de 200 registros, la ausencia de `useMemo` forzaría el procesamiento de filtros en cada ciclo de renderizado del componente (incluidos los disparados por cambios de tema estético). Con esta optimización, el cálculo se restringe estrictamente a la mutación de sus dependencias vectoriales.

## Métricas React DevTools Profiler

### Registro de Sesión

Secuencia evaluada: Carga inicial de aplicación → Consulta de término → Conmutación de pestaña → Selección de 3 elementos favoritos → Cambio de tema global.

| Acción Ejecutada | Componentes Afectados por Re-render | Observación Técnica |
| --- | --- | --- |
| Escritura en input buscador | `MainApp` + `CourseList` | `useMemo` recalcula únicamente el segmento `processedCourses` |
| Cambio de tema (`toggleTheme`) | `Navbar`, `Profile` (si se encuentra activo) | `CourseList` permanece estático (aislado de `ThemeContext`) |
| Interacción con Favoritos | `MainApp` + `CourseList` | `useCallback` mantiene la consistencia de la referencia |
| Conmutación en barra lateral | `MainApp` + `CourseList` | Inicialización de paginación y recálculo de datos filtrados |

> **Conclusión del análisis:** `CourseList` únicamente procesa actualizaciones cuando sus propiedades de entrada sufren variaciones directas, demostrando inmunidad ante efectos colaterales de contextos adyacentes.

Las capturas de pantalla correspondientes se encuentran almacenadas en el directorio `/docs/profiler/` de este repositorio.

## Checklist de Validación Final

* El comando `npm run dev` se ejecuta correctamente sin errores en la consola del navegador.
* El proceso de linteo `npm run lint` finaliza con cero advertencias referentes a la regla `react-hooks/exhaustive-deps`.
* Verificación mediante React DevTools Profiler de que el componente `CourseList` no experimenta re-renders al alterar el tema de la aplicación.
* Proceso de desmonte (*cleanup*) en `useFetch` validado: las interrupciones de navegación rápida no producen excepciones de actualización en componentes desmontados.
* Persistencia del arreglo de favoritos durante la navegación entre pestañas.
* Reinicio automático a la página base (página 1) ante cualquier mutación en los filtros de búsqueda o navegación lateral.
* El componente Perfil expone correctamente la información del `AuthContext` y procesa los cambios de nivel de acceso de forma síncrona.
* Archivo `README.md` desplegado en la raíz del repositorio de GitHub.

## Integrantes

* Espíritu Diaz, Layne Guadalupe María Isabel
* Llanos Lozano, Ricardo Alexander

## Referencias

* React Docs — Hooks Reference
* React DevTools Profiler
* Rules of Hooks
* JSONPlaceholder API

```

```