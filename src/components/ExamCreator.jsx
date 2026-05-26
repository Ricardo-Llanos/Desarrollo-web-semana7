import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const ExamCreator = ({ courseId, courseTitle, onBack }) => {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

    const localStorageKey = `exam_course_${courseId}`;

    const [questions, setQuestions] = useState(() => {
        const savedExam = localStorage.getItem(localStorageKey);
        if (savedExam) {
            try {
                return JSON.parse(savedExam);
            } catch (e) {
                console.error("Error al parsear el examen de localStorage", e);
            }
        }
        
        // Estructura inicial por defecto si está completamente vacío
        return [
           {
                id: 1,
                text: '¿Pregunta de ejemplo 1 (Opción Única)?',
                options: [
                    { id: 'A', text: 'Opción1', isCorrect: false },
                    { id: 'B', text: 'Opción2', isCorrect: true },
                    { id: 'C', text: 'Opción3', isCorrect: false },
                    { id: 'D', text: 'Opción4', isCorrect: false }
                ]
            },
            {
                id: 2,
                text: '¿Pregunta de ejemplo 2 (Opción Múltiple)?',
                options: [
                    { id: 'A', text: 'Opción1', isCorrect: true },
                    { id: 'B', text: 'Opción2', isCorrect: true },
                    { id: 'C', text: 'Opción3', isCorrect: true },
                    { id: 'D', text: 'Opción4', isCorrect: false }
                ]
            }
        ];
    });

    // 1. Agregar una nueva pregunta al cuestionario
    const handleAddQuestion = () => {
        const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
        setQuestions([
            ...questions,
            {
                id: newId,
                text: '',
                options: [
                    { id: 'A', text: '', isCorrect: false },
                    { id: 'B', text: '', isCorrect: false }
                ]
            }
        ]);
    };

    // 2. Eliminar una pregunta completa
    const handleDeleteQuestion = (questionId) => {
        setQuestions(questions.filter(q => q.id !== questionId));
    };

    // 3. Modificar el texto del enunciado de una pregunta
    const handleQuestionTextChange = (questionId, value) => {
        setQuestions(questions.map(q => 
            q.id === questionId ? { ...q, text: value } : q
        ));
    };

    // 4. Modificar el texto de una opción específica
    const handleOptionTextChange = (questionId, optionId, value) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                return {
                    ...q,
                    options: q.options.map(opt => 
                        opt.id === optionId ? { ...opt, text: value } : opt
                    )
                };
            }
            return q;
        }));
    };

    // 5. Conmutar el estado de respuesta correcta (Permite selección múltiple de forma nativa)
    const handleToggleCorrect = (questionId, optionId) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                return {
                    ...q,
                    options: q.options.map(opt => 
                        opt.id === optionId ? { ...opt, isCorrect: !opt.isCorrect } : opt
                    )
                };
            }
            return q;
        }));
    };

    // 6. Agregar una nueva fila de respuesta a una pregunta específica
    const handleAddOption = (questionId) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const nextLetter = String.fromCharCode(65 + q.options.length); // A, B, C, D...
                return {
                    ...q,
                    options: [...q.options, { id: nextLetter, text: '', isCorrect: false }]
                };
            }
            return q;
        }));
    };

    // 7. Eliminar una opción específica de una pregunta
    const handleDeleteOption = (questionId, optionId) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const filteredOptions = q.options.filter(opt => opt.id !== optionId);
                // Re-mapear las letras (A, B, C...) para mantener consistencia visual
                const reindexedOptions = filteredOptions.map((opt, index) => ({
                    ...opt,
                    id: String.fromCharCode(65 + index)
                }));
                return { ...q, options: reindexedOptions };
            }
            return q;
        }));
    };

    // 8. Guardar todo el examen en persistencia
    const handleSaveExam = () => {
        try {
            localStorage.setItem(localStorageKey, JSON.stringify(questions));
            console.log("Estructura final del Examen a guardar:", questions);
            alert('Examen de certificación guardado localmente con éxito.');
        } catch (e) {
            console.error("Error al guardar el examen en localStorage", e);
            alert('Error al guardar el examen localmente.');
        }
        onBack(); // Retorna al dashboard administrativo
    };

    return (
        <div style={{ paddingTop: '20px', maxWidth: '900px', margin: '0 auto', paddingBottom: '60px' }}>
            
            {/* Header del Sub-módulo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <button 
                        onClick={onBack} 
                        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: '600', padding: 0, marginBottom: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        ← Volver al Panel
                    </button>
                    <h1 style={{ margin: '0 0 5px 0', fontSize: '1.8rem', color: isDark ? '#f8fafc' : '#111827' }}>
                        Creador de Exámenes - UNCP
                    </h1>
                    <p style={{ margin: 0, color: isDark ? '#94a3b8' : '#6b7280', fontSize: '0.95rem' }}>
                        Curso: <strong style={{ color: '#2563eb' }}>{courseTitle}</strong> (ID: #{courseId})
                    </p>
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={handleAddQuestion}
                        style={{ padding: '10px 20px', backgroundColor: isDark ? '#334155' : '#e5e7eb', color: isDark ? '#f1f5f9' : '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                    >
                        + Añadir Pregunta
                    </button>
                    <button
                        onClick={handleSaveExam}
                        style={{ padding: '10px 24px', backgroundColor: '#238636', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                    >
                        Guardar Examen
                    </button>
                </div>
            </div>

            {/* Listado de Preguntas (Cards Dinámicas) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {questions.map((question, qIndex) => (
                    <div 
                        key={question.id}
                        style={{
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            borderRadius: '12px',
                            padding: '24px',
                            border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {/* Cabecera de la Card de Pregunta */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: isDark ? '#94a3b8' : '#6b7280' }}>
                                <span style={{ cursor: 'grab', fontSize: '1.2rem' }}>⣿</span>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: isDark ? '#f8fafc' : '#111827' }}>
                                    Pregunta {qIndex + 1}
                                </h3>
                            </div>
                            <button 
                                onClick={() => handleDeleteQuestion(question.id)}
                                style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1.2rem' }}
                                title="Eliminar pregunta"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Enunciado de la Pregunta */}
                        <div style={{ marginBottom: '20px' }}>
                            <input 
                                type="text"
                                value={question.text}
                                onChange={(e) => handleQuestionTextChange(question.id, e.target.value)}
                                placeholder="Escribe el enunciado de la pregunta aquí..."
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                    color: isDark ? '#f1f5f9' : '#111827',
                                    fontSize: '0.95rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Opciones de Respuesta */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                            {question.options.map((option) => (
                                <div key={option.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    
                                    {/* Indicador de Arrastre e Índice de la Letra */}
                                    <span style={{ color: isDark ? '#475569' : '#9ca3af', cursor: 'grab' }}>⣿</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: isDark ? '#94a3b8' : '#6b7280', width: '15px' }}>
                                        {option.id}
                                    </span>

                                    {/* Input del Texto de Opción */}
                                    <input 
                                        type="text"
                                        value={option.text}
                                        onChange={(e) => handleOptionTextChange(question.id, option.id, e.target.value)}
                                        placeholder={`Opción ${option.id}`}
                                        style={{
                                            flexGrow: 1,
                                            padding: '10px 14px',
                                            borderRadius: '6px',
                                            border: `1px solid ${option.isCorrect ? '#238636' : (isDark ? '#475569' : '#d1d5db')}`,
                                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                            color: isDark ? '#f1f5f9' : '#111827',
                                            fontSize: '0.9rem'
                                        }}
                                    />

                                    {/* Botón de Selección de Respuesta Correcta (Checkbox Custom o Estilo Botón Check de tu UI) */}
                                    <button
                                        type="button"
                                        onClick={() => handleToggleCorrect(question.id, option.id)}
                                        style={{
                                            padding: '10px 14px',
                                            backgroundColor: option.isCorrect ? '#238636' : 'transparent',
                                            color: option.isCorrect ? '#ffffff' : (isDark ? '#475569' : '#9ca3af'),
                                            border: `1px solid ${option.isCorrect ? '#238636' : (isDark ? '#475569' : '#d1d5db')}`,
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            transition: 'all 0.15s ease'
                                        }}
                                        title={option.isCorrect ? "Marcada como correcta" : "Marcar como correcta"}
                                    >
                                        ✓
                                    </button>

                                    {/* Botón para remover esta opción específica */}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteOption(question.id, option.id)}
                                        style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.95rem', padding: '5px' }}
                                        title="Eliminar opción"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Agregar más respuestas a esta pregunta */}
                        <div style={{ textAlign: 'right' }}>
                            <button
                                type="button"
                                onClick={() => handleAddOption(question.id)}
                                style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600', padding: '4px 8px' }}
                            >
                                + Añadir respuesta
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};