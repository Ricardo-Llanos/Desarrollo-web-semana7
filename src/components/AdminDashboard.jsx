import React, { useState, useContext, useReducer, useMemo, useCallback, useRef, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { coursesReducer, INITIAL_STATE } from '../reducers/CourseReducer';

export const AdminDashboard = ({ courses, setCourses, setView }) => {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

    const [uiState, dispatch] = useReducer(coursesReducer, INITIAL_STATE);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const titleInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        lessonsCount: '',
        quizzesCount: '',
        durationHours: '',
        sections: []
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                handleNewCourse();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        // Función de Limpieza obligatoria para evitar memory leaks [cite: 15, 26]
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Autofocus usando la referencia inmutable cuando el modal se abre [cite: 15, 26]
    useEffect(() => {
        if (isModalOpen && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isModalOpen]);

    // 3. useMemo de Alto Rendimiento: Filtra, Busca y Ordena en un solo paso computacional 
    const processedCourses = useMemo(() => {
        // IA: Recálculo en cada tipeo trivial -> Solución manual: useMemo encapsula criterios relacionales estrictos
        let result = [...courses];

        // Criterio de Búsqueda Letra por Letra (startsWith desde el inicio)
        if (uiState.searchQuery) {
            result = result.filter(c =>
                c.title.toLowerCase().trim().startsWith(uiState.searchQuery.toLowerCase().trim())
            );
        }

        // Criterio de Filtrado por Categoría
        if (uiState.categoryFilter !== 'Todos') {
            result = result.filter(c => c.category === uiState.categoryFilter);
        }

        // Criterio de Ordenamiento Estricto
        result.sort((a, b) => {
            if (uiState.sortBy === 'title') {
                return a.title.localeCompare(b.title);
            }
            return b[uiState.sortBy] - a[uiState.sortBy]; // Descendente numérico
        });

        return result;
    }, [courses, uiState]);

    // Abrir modal para crear nuevo curso
    const handleNewCourse = () => {
        setEditingId(null);
        setFormData({
            title: '',
            category: '',
            description: '',
            lessonsCount: '',
            quizzesCount: '',
            durationHours: '',
            sections: []
        });
        setIsModalOpen(true);
    };

    // Abrir modal para editar curso
    const handleEditCourse = (course) => {
        setEditingId(course.id);
        setFormData({
            title: course.title,
            category: course.category,
            description: course.description,
            lessonsCount: course.lessonsCount,
            quizzesCount: course.quizzesCount,
            durationHours: course.durationHours,
            sections: course.sections || []
        });
        setIsModalOpen(true);
    };

    // Manejar cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Guardar o actualizar curso
    const handleSaveCourse = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.category) {
            alert('Por favor completa al menos el título y categoría');
            return;
        }

        if (editingId) {
            // Actualizar curso existente
            setCourses(courses.map(c =>
                c.id === editingId
                    ? {
                        ...c,
                        title: formData.title,
                        category: formData.category,
                        description: formData.description,
                        lessonsCount: parseInt(formData.lessonsCount) || 0,
                        quizzesCount: parseInt(formData.quizzesCount) || 0,
                        durationHours: parseInt(formData.durationHours) || 0,
                        sections: formData.sections
                    }
                    : c
            ));
        } else {
            // Crear nuevo curso
            const newCourse = {
                id: Math.max(...courses.map(c => c.id), 0) + 1,
                title: formData.title,
                category: formData.category,
                description: formData.description,
                lessonsCount: parseInt(formData.lessonsCount) || 0,
                quizzesCount: parseInt(formData.quizzesCount) || 0,
                durationHours: parseInt(formData.durationHours) || 0,
                sections: formData.sections || [
                    {
                        id: 1,
                        title: 'Introducción',
                        duration: '10 min',
                        completed: false
                    }
                ]
            };
            setCourses([...courses, newCourse]);
        }

        setIsModalOpen(false);
        alert(editingId ? 'Curso actualizado exitosamente' : 'Curso creado exitosamente');
    };

    // Eliminar curso
    const handleDeleteCourse = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
            setCourses(courses.filter(c => c.id !== id));
            alert('Curso eliminado exitosamente');
        }
    };

    return (
        <div style={{ paddingTop: '40px' }}>
            {/* Cabecera */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: '0 0 5px 0', fontSize: '2rem', color: isDark ? '#f8fafc' : '#111827' }}>
                        📊 Panel de Administrador
                    </h1>
                    <p style={{ margin: 0, color: isDark ? '#94a3b8' : '#6b7280', fontSize: '0.95rem' }}>
                        Gestiona todos los cursos disponibles en la plataforma
                    </p>
                </div>
                <button
                    onClick={handleNewCourse}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    ➕ Nuevo Curso
                </button>
            </div>

            {/* Tabla de cursos */}
            <div style={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderRadius: '12px',
                border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}>
                {courses.length === 0 ? (
                    <div style={{
                        padding: '40px',
                        textAlign: 'center',
                        color: isDark ? '#94a3b8' : '#6b7280'
                    }}>
                        <p style={{ fontSize: '1.1rem', margin: 0 }}>No hay cursos disponibles. ¡Crea uno nuevo!</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse'
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: isDark ? '#334155' : '#f3f4f6' }}>
                                    <th style={{
                                        padding: '16px',
                                        textAlign: 'left',
                                        fontSize: '0.88rem',
                                        fontWeight: '600',
                                        color: isDark ? '#cbd5e1' : '#374151',
                                        borderBottom: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`
                                    }}>ID</th>
                                    <th style={{
                                        padding: '16px',
                                        textAlign: 'left',
                                        fontSize: '0.88rem',
                                        fontWeight: '600',
                                        color: isDark ? '#cbd5e1' : '#374151',
                                        borderBottom: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`
                                    }}>Título</th>
                                    <th style={{
                                        padding: '16px',
                                        textAlign: 'left',
                                        fontSize: '0.88rem',
                                        fontWeight: '600',
                                        color: isDark ? '#cbd5e1' : '#374151',
                                        borderBottom: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`
                                    }}>Categoría</th>
                                    <th style={{
                                        padding: '16px',
                                        textAlign: 'center',
                                        fontSize: '0.88rem',
                                        fontWeight: '600',
                                        color: isDark ? '#cbd5e1' : '#374151',
                                        borderBottom: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`
                                    }}>Lecciones</th>
                                    <th style={{
                                        padding: '16px',
                                        textAlign: 'center',
                                        fontSize: '0.88rem',
                                        fontWeight: '600',
                                        color: isDark ? '#cbd5e1' : '#374151',
                                        borderBottom: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`
                                    }}>Tests</th>
                                    <th style={{
                                        padding: '16px',
                                        textAlign: 'center',
                                        fontSize: '0.88rem',
                                        fontWeight: '600',
                                        color: isDark ? '#cbd5e1' : '#374151',
                                        borderBottom: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`
                                    }}>Horas</th>
                                    <th style={{
                                        padding: '16px',
                                        textAlign: 'center',
                                        fontSize: '0.88rem',
                                        fontWeight: '600',
                                        color: isDark ? '#cbd5e1' : '#374151',
                                        borderBottom: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`
                                    }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course, idx) => (
                                    <tr
                                        key={course.id}
                                        style={{
                                            backgroundColor: idx % 2 === 0 ? 'transparent' : isDark ? '#334155' : '#f9fafb',
                                            borderBottom: `1px solid ${isDark ? '#334155' : '#f3f4f6'}`
                                        }}
                                    >
                                        <td style={{
                                            padding: '16px',
                                            fontSize: '0.88rem',
                                            color: isDark ? '#cbd5e1' : '#374151'
                                        }}>
                                            <span style={{
                                                backgroundColor: '#2563eb',
                                                color: '#fff',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontWeight: '600',
                                                fontSize: '0.75rem'
                                            }}>
                                                #{course.id}
                                            </span>
                                        </td>
                                        <td style={{
                                            padding: '16px',
                                            fontSize: '0.88rem',
                                            color: isDark ? '#f1f5f9' : '#111827',
                                            fontWeight: '500'
                                        }}>
                                            {course.title}
                                        </td>
                                        <td style={{
                                            padding: '16px',
                                            fontSize: '0.88rem',
                                            color: isDark ? '#cbd5e1' : '#374151'
                                        }}>
                                            <span style={{
                                                backgroundColor: course.category === 'Frontend' ? '#dbeafe' : course.category === 'Backend' ? '#fef3c7' : '#d1fae5',
                                                color: course.category === 'Frontend' ? '#1e40af' : course.category === 'Backend' ? '#92400e' : '#065f46',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                {course.category}
                                            </span>
                                        </td>
                                        <td style={{
                                            padding: '16px',
                                            textAlign: 'center',
                                            fontSize: '0.88rem',
                                            color: isDark ? '#cbd5e1' : '#374151'
                                        }}>
                                            {course.lessonsCount}
                                        </td>
                                        <td style={{
                                            padding: '16px',
                                            textAlign: 'center',
                                            fontSize: '0.88rem',
                                            color: isDark ? '#cbd5e1' : '#374151'
                                        }}>
                                            {course.quizzesCount}
                                        </td>
                                        <td style={{
                                            padding: '16px',
                                            textAlign: 'center',
                                            fontSize: '0.88rem',
                                            color: isDark ? '#cbd5e1' : '#374151'
                                        }}>
                                            {course.durationHours}h
                                        </td>
                                        <td style={{
                                            padding: '16px',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => handleEditCourse(course)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: '#2563eb',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCourse(course.id)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: '#dc2626',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal para crear/editar */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        borderRadius: '12px',
                        padding: '30px',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 20px 25px rgba(0,0,0,0.15)',
                        border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`
                    }}>
                        <h2 style={{
                            margin: '0 0 20px 0',
                            fontSize: '1.5rem',
                            color: isDark ? '#f8fafc' : '#111827'
                        }}>
                            {editingId ? '✏️ Editar Curso' : '➕ Crear Nuevo Curso'}
                        </h2>

                        <form onSubmit={handleSaveCourse}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '0.88rem',
                                    fontWeight: '600',
                                    color: isDark ? '#cbd5e1' : '#374151'
                                }}>
                                    Título del Curso *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Ej: React Avanzado"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                        color: isDark ? '#f1f5f9' : '#111827',
                                        fontSize: '0.9rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '0.88rem',
                                    fontWeight: '600',
                                    color: isDark ? '#cbd5e1' : '#374151'
                                }}>
                                    Categoría *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                        color: isDark ? '#f1f5f9' : '#111827',
                                        fontSize: '0.9rem',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <option value="">Selecciona una categoría</option>
                                    <option value="Frontend">Frontend</option>
                                    <option value="Backend">Backend</option>
                                    <option value="Lenguajes">Lenguajes</option>
                                    <option value="Diseño">Diseño</option>
                                    <option value="DevOps">DevOps</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '0.88rem',
                                    fontWeight: '600',
                                    color: isDark ? '#cbd5e1' : '#374151'
                                }}>
                                    Descripción
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe el contenido del curso..."
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                        color: isDark ? '#f1f5f9' : '#111827',
                                        fontSize: '0.9rem',
                                        boxSizing: 'border-box',
                                        minHeight: '80px',
                                        fontFamily: 'inherit',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '6px',
                                        fontSize: '0.88rem',
                                        fontWeight: '600',
                                        color: isDark ? '#cbd5e1' : '#374151'
                                    }}>
                                        Lecciones
                                    </label>
                                    <input
                                        type="number"
                                        name="lessonsCount"
                                        value={formData.lessonsCount}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '6px',
                                            border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                            color: isDark ? '#f1f5f9' : '#111827',
                                            fontSize: '0.9rem',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '6px',
                                        fontSize: '0.88rem',
                                        fontWeight: '600',
                                        color: isDark ? '#cbd5e1' : '#374151'
                                    }}>
                                        Tests
                                    </label>
                                    <input
                                        type="number"
                                        name="quizzesCount"
                                        value={formData.quizzesCount}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '6px',
                                            border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                            color: isDark ? '#f1f5f9' : '#111827',
                                            fontSize: '0.9rem',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '6px',
                                        fontSize: '0.88rem',
                                        fontWeight: '600',
                                        color: isDark ? '#cbd5e1' : '#374151'
                                    }}>
                                        Horas
                                    </label>
                                    <input
                                        type="number"
                                        name="durationHours"
                                        value={formData.durationHours}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '6px',
                                            border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                            color: isDark ? '#f1f5f9' : '#111827',
                                            fontSize: '0.9rem',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{
                                        padding: '10px 24px',
                                        backgroundColor: isDark ? '#334155' : '#e5e7eb',
                                        color: isDark ? '#f1f5f9' : '#111827',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '10px 24px',
                                        backgroundColor: '#2563eb',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {editingId ? 'Actualizar' : 'Crear'} Curso
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
