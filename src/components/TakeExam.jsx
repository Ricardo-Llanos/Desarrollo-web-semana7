import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const TakeExam = ({ course, setView }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // Estilos de interfaz adaptables
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const text = isDark ? '#f8fafc' : '#111827';
  const subText = isDark ? '#94a3b8' : '#6b7280';
  const border = isDark ? '#334155' : '#e5e7eb';

  // 1. CARGA INICIAL: Recuperar el examen real guardado en LocalStorage
  const [questions] = useState(() => {
    const savedExam = localStorage.getItem(`exam_course_${course.id}`);
    if (savedExam) {
      try {
        return JSON.parse(savedExam);
      } catch (e) {
        console.error("Error al cargar el examen de localStorage", e);
      }
    }
    // Carga por defecto si el administrador no configuró preguntas aún
    return [
      {
        id: 1,
        text: 'Muestra de prueba: ¿Cuáles de las siguientes opciones son lenguajes Front-End? (Multiselección)',
        options: [
          { id: 'A', text: 'JavaScript', isCorrect: true },
          { id: 'B', text: 'HTML / CSS', isCorrect: true },
          { id: 'C', text: 'Cobol', isCorrect: false }
        ]
      }
    ];
  });

  // 2. ESTADO DE RESPUESTAS DEL ESTUDIANTE
  // Estructura: { [questionId]: ['A', 'B'] } (Soporta selecciones múltiples)
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [examResult, setExamResult] = useState(null);

  // Manejar la selección/deselección de opciones por parte del alumno
  const handleOptionClick = (questionId, optionId) => {
    if (examResult) return; // Bloquear cambios si el examen ya fue enviado

    setSelectedAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      if (currentAnswers.includes(optionId)) {
        // Si ya estaba seleccionada, la removemos
        return { ...prev, [questionId]: currentAnswers.filter(id => id !== optionId) };
      } else {
        // Si no estaba, la añadimos al arreglo
        return { ...prev, [questionId]: [...currentAnswers, optionId] };
      }
    });
  };

  // 3. PROCESAR EVALUACIÓN ESTRICTA
  const handleSubmitExam = (e) => {
    e.preventDefault();
    
    let correctCount = 0;

    questions.forEach(q => {
      const studentAnswers = selectedAnswers[q.id] || [];
      
      // Obtenemos las opciones que el Administrador marcó como correctas
      const correctOptionIds = q.options
        .filter(opt => opt.isCorrect)
        .map(opt => opt.id);

      // Evaluación estricta: El alumno debe marcar todas las correctas y ninguna incorrecta
      const hasAllCorrect = correctOptionIds.every(id => studentAnswers.includes(id));
      const hasNoIncorrect = studentAnswers.every(id => correctOptionIds.includes(id));

      if (hasAllCorrect && hasNoIncorrect) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const approved = scorePercentage >= 70; // Nota mínima aprobatoria: 70%

    setExamResult({
      score: scorePercentage,
      correctQuestions: correctCount,
      totalQuestions: questions.length,
      approved: approved
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* Cabecera del examen */}
      <div style={{ marginBottom: '32px', borderBottom: `1px solid ${border}`, paddingBottom: '20px' }}>
        <button
          onClick={() => setView('intro')}
          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: '600', padding: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          ← Cancelar y salir
        </button>
        <h1 style={{ margin: '0 0 6px 0', fontSize: '1.8rem', color: text }}>
          Examen de Certificación Oficial
        </h1>
        <p style={{ margin: 0, color: subText, fontSize: '0.95rem' }}>
          Curso: <strong style={{ color: '#2563eb' }}>{course.title}</strong> · {questions.length} Preguntas en total.
        </p>
      </div>

      {/* Renderizado de Resultados si ya se envió el examen */}
      {examResult && (
        <div style={{
          backgroundColor: examResult.approved ? (isDark ? 'rgba(35,134,54,0.15)' : '#d1fae5') : (isDark ? 'rgba(220,38,38,0.15)' : '#fee2e2'),
          border: `1px solid ${examResult.approved ? '#238636' : '#dc2626'}`,
          borderRadius: '12px', padding: '24px', marginBottom: '30px', textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', color: examResult.approved ? (isDark ? '#4ade80' : '#065f46') : (isDark ? '#f87171' : '#991b1b') }}>
            {examResult.approved ? '🎉 ¡Felicidades, Has Aprobado!' : '❌ Examen no Aprobado'}
          </h2>
          <p style={{ margin: '0 0 15px 0', color: text, fontSize: '1.1rem' }}>
            Tu puntuación: <strong>{examResult.score}%</strong> ({examResult.correctQuestions} de {examResult.totalQuestions} aciertos)
          </p>
          <p style={{ margin: 0, fontSize: '0.88rem', color: subText }}>
            {examResult.approved 
              ? 'Tu certificado digital ha sido emitido con éxito y añadido a tu perfil profesional.' 
              : 'Te recomendamos repasar los contenidos del curso e intentarlo nuevamente.'}
          </p>
          <button 
            onClick={() => setView('courses')}
            style={{ marginTop: '20px', padding: '10px 24px', backgroundColor: examResult.approved ? '#238636' : '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
          >
            Volver al Inicio
          </button>
        </div>
      )}

      {/* Formulario / Cuestionario */}
      <form onSubmit={handleSubmitExam}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {questions.map((question, qIndex) => {
            const studentAnswers = selectedAnswers[question.id] || [];
            
            return (
              <div 
                key={question.id}
                style={{
                  backgroundColor: cardBg, borderRadius: '12px', padding: '24px',
                  border: `1px solid ${border}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                }}
              >
                {/* Enunciado de la pregunta */}
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: '600', color: text, display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#2563eb' }}>{qIndex + 1}.</span>
                  {question.text || '(Pregunta sin enunciado)'}
                </h3>

                {/* Bloque de Opciones de respuesta */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {question.options.map((option) => {
                    const isSelected = studentAnswers.includes(option.id);
                    
                    return (
                      <div
                        key={option.id}
                        onClick={() => handleOptionClick(question.id, option.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '14px',
                          padding: '14px 18px', borderRadius: '8px', cursor: examResult ? 'default' : 'pointer',
                          backgroundColor: isSelected ? (isDark ? '#1e2d42' : '#eff6ff') : (isDark ? '#0f172a' : '#f9fafb'),
                          border: `1px solid ${isSelected ? '#2563eb' : border}`,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {/* Checkbox custom circular / cuadrado */}
                        <div style={{
                          width: '20px', height: '20px', borderRadius: '4px',
                          border: `2px solid ${isSelected ? '#2563eb' : (isDark ? '#475569' : '#cbd5db')}`,
                          backgroundColor: isSelected ? '#2563eb' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#ffffff', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0
                        }}>
                          {isSelected && '✓'}
                        </div>

                        {/* Texto de la opción */}
                        <span style={{ fontSize: '0.92rem', color: text, fontWeight: isSelected ? '500' : '400' }}>
                          <strong style={{ marginRight: '6px', color: isSelected ? '#2563eb' : subText }}>{option.id}.</strong>
                          {option.text || '(Opción vacía)'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón de envío final */}
        {!examResult && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#238636', color: '#ffffff', border: 'none',
                borderRadius: '12px', padding: '16px 60px', fontSize: '1rem',
                fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(35, 134, 54, 0.2)'
              }}
            >
              Terminar y Enviar Examen
            </button>
          </div>
        )}
      </form>
    </div>
  );
};