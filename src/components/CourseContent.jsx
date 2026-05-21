// src/components/CourseContent.jsx
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const CourseContent = ({ course, setView }) => {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

    // Seteamos el estado local con las secciones reales que vienen del JSON del curso seleccionado
    const [sections, setSections] = useState([]);
    const [activeSection, setActiveSection] = useState(null);

    // IA: Sincronizar estado local con props cambiantes sin bucles de renderizado → Solución manual: useEffect con la dependencia exacta del objeto [course]
    useEffect(() => {
        if (course && course.sections) {
            setSections(course.sections);
            setActiveSection(course.sections[0]); // Por defecto reproduce la primera clase real
        }
    }, [course]);

    // Cálculo del progreso real en base a los checks completados de este curso
    const progressPercentage = useMemo(() => {
        if (sections.length === 0) return 0;
        const completedCount = sections.filter(s => s.completed).length;
        return Math.round((completedCount / sections.length) * 100);
    }, [sections]);

    // Cambiar el estado 'completed' de la sección real seleccionada
    const toggleSectionCompleted = (id) => {
        setSections(prev => prev.map(s =>
            s.id === id ? { ...s, completed: !s.completed } : s
        ));
    };

    // Prevenir parpadeos visuales si la sincronización del useEffect tarda milisegundos
    if (!activeSection) {
        return <p style={{ padding: '20px', color: '#2563eb' }}>Cargando temario real...</p>;
    }

    return (
        <div style={{ position: 'relative', paddingTop: '40px' }}>

            {/* BARRA DE PROGRESO FIXED */}
            <div style={{
                position: 'fixed',
                top: '67px',
                left: 0,
                width: '100%',
                height: '4px',
                backgroundColor: isDark ? '#334155' : '#e5e7eb',
                zIndex: 99
            }}>
                <div style={{
                    height: '100%',
                    width: `${progressPercentage}%`,
                    backgroundColor: '#2563eb',
                    transition: 'width 0.3s ease-out'
                }}></div>
            </div>

            {/* Cabecera de Navegación del Visor */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <button
                    onClick={() => setView('courses')}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`,
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        color: isDark ? '#f8fafc' : '#111827',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    ⬅️ Regresar a todos los cursos
                </button>

                {/* REQUERIMIENTO: BARRA DE PROGRESO HORIZONTAL REPRESENTATIVA COMPLETA */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexGrow: 1,
                    maxWidth: '400px',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`
                }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isDark ? '#cbd5e1' : '#374151', minWidth: '85px' }}>
                        Progreso: {progressPercentage}%
                    </span>
                    {/* Contenedor de la barra de progreso */}
                    <div style={{
                        height: '10px',
                        flexGrow: 1,
                        backgroundColor: isDark ? '#334155' : '#e5e7eb',
                        borderRadius: '5px',
                        overflow: 'hidden'
                    }}>
                        {/* Relleno Dinámico */}
                        <div style={{
                            height: '100%',
                            width: `${progressPercentage}%`,
                            backgroundColor: '#2563eb',
                            borderRadius: '5px',
                            transition: 'width 0.4s ease-out'
                        }}></div>
                    </div>
                </div>
            </div>

            {/* DISEÑO EN 2 COLUMNAS (Estilo Coursera/Udemy de la captura) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '30px', alignItems: 'start' }}>

                {/* COLUMNA IZQUIERDA: Reproductor de Video e Información Detallada Real */}
                <div style={{
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderRadius: '16px',
                    border: `1px solid ${isDark ? '#334155' : '#f3f4f6'}`,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}>
                    {/* Pantalla del Video */}
                    <div style={{
                        width: '100%',
                        aspectRatio: '16/9',
                        backgroundColor: '#090d16',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '20px',
                        boxSizing: 'border-box'
                    }}>
                        <span style={{ fontSize: '3.5rem' }}>💻</span>
                        <h3 style={{ margin: 0, color: '#3b82f6', textAlign: 'center', fontSize: '1.3rem' }}>
                            {course.title}
                        </h3>
                        <p style={{ fontWeight: '500', color: '#94a3b8', margin: 0, textAlign: 'center', fontSize: '0.95rem' }}>
                            🎬 Clase en reproducción: <span style={{ color: '#f1f5f9' }}>{activeSection.title}</span>
                        </p>
                    </div>

                    {/* Datos y Descripción real del Curso Debajo del Video */}
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', fontSize: '0.88rem' }}>
                            <span style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
                                📖 {course.lessonsCount} Lecciones reales
                            </span>
                            <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
                                📊 {course.quizzesCount} Quizzes reales
                            </span>
                            <span style={{ backgroundColor: '#d1fae5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
                                ⏱️ {course.durationHours} Horas totales
                            </span>
                        </div>

                        <h2 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', color: isDark ? '#f8fafc' : '#111827' }}>
                            Descripción del Curso
                        </h2>
                        <p style={{ color: isDark ? '#94a3b8' : '#4b5563', lineHeight: '1.6', margin: 0 }}>
                            {course.description} Este plan de estudios ha sido diseñado meticulosamente para cubrir las competencias exigidas en la rúbrica de evaluación. Asegúrate de completar los cuestionarios prácticos asociados.
                        </p>
                    </div>
                </div>

                {/* COLUMNA DERECHA: Temario Dinámico Conectado al JSON Real */}
                <div style={{
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderRadius: '16px',
                    border: `1px solid ${isDark ? '#334155' : '#f3f4f6'}`,
                    padding: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: isDark ? '#f8fafc' : '#111827' }}>
                        Contenido del Curso
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0 0 15px 0' }}>
                        Mapeando {sections.length} clases estructuradas
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {sections.map((section) => {
                            const isActive = section.id === activeSection.id;
                            return (
                                <div
                                    key={section.id}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        backgroundColor: isActive ? (isDark ? '#334155' : '#f3f4f6') : 'transparent',
                                        border: `1px solid ${isActive ? '#2563eb' : 'transparent'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {/* Checkbox para marcar progreso en tiempo real */}
                                    <input
                                        type="checkbox"
                                        checked={section.completed}
                                        onChange={() => toggleSectionCompleted(section.id)}
                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                    />

                                    {/* Selector de clase */}
                                    <div
                                        onClick={() => setActiveSection(section)}
                                        style={{ flexGrow: 1, cursor: 'pointer' }}
                                    >
                                        <div style={{
                                            fontSize: '0.88rem',
                                            fontWeight: isActive ? '600' : '500',
                                            color: isActive ? '#2563eb' : (isDark ? '#cbd5e1' : '#374151'),
                                            lineHeight: '1.4'
                                        }}>
                                            {section.title}
                                        </div>
                                        <span style={{ fontSize: '0.78rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                            ⏱️ {section.duration}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};