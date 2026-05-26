import React, { useState, useContext } from 'react';
import { ExamContext } from '../context/ExamContext';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

export const TakeExam = ({ course, setView }) => {
  const { exams, getUserResult, saveResult } = useContext(ExamContext);
  const { currentUser, issueCertificate } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // Interface styling colors
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const text = isDark ? '#f8fafc' : '#111827';
  const subText = isDark ? '#94a3b8' : '#6b7280';
  const border = isDark ? '#334155' : '#e5e7eb';

  // Mode: Is it course-bound (course prop provided) or independent (no course prop)?
  const isCourseMode = !!course;

  // --- COURSE MODE STATES & LOGIC ---
  const courseExamId = isCourseMode ? `course_${course.id}` : null;
  const coursePrevResult = isCourseMode ? getUserResult(currentUser.id, courseExamId) : null;

  const [courseExamData] = useState(() => {
    let rawQuestions = [];
    let rawPassingScore = 70;

    if (isCourseMode) {
      const savedExam = localStorage.getItem(`exam_course_${course.id}`);
      if (savedExam) {
        try {
          const parsed = JSON.parse(savedExam);
          if (Array.isArray(parsed)) {
            rawQuestions = parsed;
          } else if (parsed && typeof parsed === 'object') {
            rawQuestions = parsed.questions || [];
            rawPassingScore = parsed.passingScore ?? 70;
          }
        } catch (e) {
          console.error("Error loading course exam from localStorage", e);
        }
      } else {
        // Default fallback structure
        rawQuestions = [
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
      }
    }

    // Verify and set multiplyOptions metadata dynamically for safety
    const verifiedQuestions = rawQuestions.map(q => {
      const correctCount = q.options.filter(opt => opt.isCorrect).length;
      return {
        ...q,
        multiplyOptions: q.multiplyOptions ?? (correctCount > 1)
      };
    });

    return {
      questions: verifiedQuestions,
      passingScore: rawPassingScore
    };
  });

  const courseQuestions = courseExamData.questions;
  const coursePassingScore = courseExamData.passingScore;

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [courseResult, setCourseResult] = useState(null);

  const handleOptionClick = (questionId, optionId, multiplyOptions) => {
    if (courseResult || coursePrevResult) return; // Lock if already submitted or has prior result
    setSelectedAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      if (multiplyOptions) {
        // Multiple Choice mode: toggle selection
        if (currentAnswers.includes(optionId)) {
          return { ...prev, [questionId]: currentAnswers.filter(id => id !== optionId) };
        } else {
          return { ...prev, [questionId]: [...currentAnswers, optionId] };
        }
      } else {
        // Single Choice mode: replace selection
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  const handleSubmitCourseExam = (e) => {
    e.preventDefault();
    if (courseResult || coursePrevResult) return;

    let correctCount = 0;
    courseQuestions.forEach(q => {
      const studentAnswers = selectedAnswers[q.id] || [];
      const correctOptionIds = q.options.filter(opt => opt.isCorrect).map(opt => opt.id);
      const hasAllCorrect = correctOptionIds.every(id => studentAnswers.includes(id));
      const hasNoIncorrect = studentAnswers.every(id => correctOptionIds.includes(id));
      if (hasAllCorrect && hasNoIncorrect) correctCount++;
    });

    const scorePercentage = Math.round((correctCount / courseQuestions.length) * 100);
    const approved = scorePercentage >= coursePassingScore; // custom passing score

    const res = {
      userId: currentUser.id,
      examId: courseExamId,
      examTitle: course.title,
      score: scorePercentage,
      passed: approved,
      pendingReview: false,
      answers: selectedAnswers,
      date: new Date().toISOString()
    };
    saveResult(res);

    if (approved) {
      issueCertificate(currentUser.id, course.title);
    }

    setCourseResult(res);
  };


  // --- INDEPENDENT EXAMS MODE STATES & LOGIC ---
  const [activeExam, setActiveExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [independentResult, setIndependentResult] = useState(null);

  const availableExams = exams.filter(e => e.questions.length > 0);

  const startIndependentExam = (exam) => {
    setActiveExam(exam);
    setAnswers({});
    setIndependentResult(null);
  };

  const handleSubmitIndependentExam = () => {
    let score = null, passed = null, pendingReview = false;

    if (activeExam.type === 'multiple') {
      const total = activeExam.questions.length;
      const correct = activeExam.questions.filter(q => answers[q.id] === q.correctIndex).length;
      score = Math.round((correct / total) * 100);
      passed = score >= activeExam.passingScore;
    } else {
      pendingReview = true; // Open question requires manual review
    }

    const res = {
      userId: currentUser.id,
      examId: activeExam.id,
      examTitle: activeExam.title,
      score,
      passed,
      pendingReview,
      answers,
      date: new Date().toISOString()
    };
    saveResult(res);

    if (passed) {
      issueCertificate(currentUser.id, activeExam.title);
    }

    setIndependentResult(res);
  };


  // ===================== RENDERS =====================

  // --- RENDER 1: COURSE EXAM RESULTS ---
  const currentCourseRes = courseResult || coursePrevResult;
  if (isCourseMode && currentCourseRes) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }} className="view-fade">

        {/* Cabecera del examen con el calificativo al lado */}
        <div style={{ marginBottom: '32px', borderBottom: `1px solid ${border}`, paddingBottom: '20px' }}>
          <button
            onClick={() => setView('courses')}
            style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: '600', padding: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            ← Volver a Cursos
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <h1 style={{ margin: '0', fontSize: '1.8rem', color: text }}>
              Examen de Certificación Oficial
            </h1>
            <span style={{
              fontSize: '0.95rem',
              fontWeight: '700',
              padding: '6px 16px',
              borderRadius: '20px',
              backgroundColor: currentCourseRes.passed ? (isDark ? '#065f46' : '#d1fae5') : (isDark ? '#7f1d1d' : '#fee2e2'),
              color: currentCourseRes.passed ? (isDark ? '#34d399' : '#065f46') : (isDark ? '#f87171' : '#991b1b'),
              border: `1px solid ${currentCourseRes.passed ? '#238636' : '#dc2626'}`
            }}>
              Calificación: {currentCourseRes.score}% - {currentCourseRes.passed ? 'APROBADO 🎉' : 'REPROBADO ❌'}
            </span>
          </div>
          <p style={{ margin: '8px 0 0 0', color: subText, fontSize: '0.95rem' }}>
            Curso: <strong style={{ color: '#2563eb' }}>{course.title}</strong> · {courseQuestions.length} Preguntas en total.
          </p>
        </div>

        {/* Tarjeta de Feedback Principal */}
        <div style={{
          backgroundColor: currentCourseRes.passed ? (isDark ? 'rgba(35,134,54,0.15)' : '#d1fae5') : (isDark ? 'rgba(220,38,38,0.15)' : '#fee2e2'),
          border: `1px solid ${currentCourseRes.passed ? '#238636' : '#dc2626'}`,
          borderRadius: '12px', padding: '30px', textAlign: 'center', marginBottom: '40px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{currentCourseRes.passed ? '🎉' : '❌'}</div>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: currentCourseRes.passed ? (isDark ? '#4ade80' : '#065f46') : (isDark ? '#f87171' : '#991b1b') }}>
            {currentCourseRes.passed ? '¡Felicitaciones, Aprobaste!' : 'Examen no Aprobado'}
          </h2>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.92rem', color: text, lineHeight: '1.6' }}>
            {currentCourseRes.passed
              ? 'Se ha emitido tu certificado digital oficial. Puedes visualizarlo y descargarlo en PDF en la pestaña tu perfil.'
              : 'Te recomendamos repasar los contenidos del curso e intentarlo nuevamente en tu siguiente oportunidad.'}
          </p>
        </div>

        {/* Listado de Preguntas con respuestas del usuario y correctas */}
        <h2 style={{ color: text, marginBottom: '20px', fontSize: '1.3rem', fontWeight: 600 }}>
          📋 Revisión Detallada de Respuestas
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {courseQuestions.map((question, qIndex) => {
            const studentAnswers = currentCourseRes.answers[question.id] || [];

            // Determine if the student got this question completely correct
            const correctOptionIds = question.options.filter(opt => opt.isCorrect).map(opt => opt.id);
            const hasAllCorrect = correctOptionIds.every(id => studentAnswers.includes(id));
            const hasNoIncorrect = studentAnswers.every(id => correctOptionIds.includes(id));
            const isQuestionCorrect = hasAllCorrect && hasNoIncorrect;

            return (
              <div
                key={question.id}
                style={{
                  backgroundColor: cardBg, borderRadius: '12px', padding: '24px',
                  border: `1px solid ${isQuestionCorrect ? (isDark ? '#0f5132' : '#a7f3d0') : (isDark ? '#5c1d1d' : '#fecaca')}`,
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                }}
              >
                {/* Header de la pregunta con indicador Correcto/Incorrecto */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: question.multiplyOptions ? (isDark ? '#1e3a5f' : '#dbeafe') : (isDark ? '#111827' : '#f9fafb'),
                    color: question.multiplyOptions ? (isDark ? '#93c5fd' : '#1d4ed8') : (isDark ? '#94a3b8' : '#6b7280')
                  }}>
                    {question.multiplyOptions ? 'OPCIÓN MÚLTIPLE' : 'OPCIÓN ÚNICA'}
                  </span>

                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 'bold',
                    color: isQuestionCorrect ? '#16a34a' : '#dc2626'
                  }}>
                    {isQuestionCorrect ? '✓ Respuesta Correcta (+1)' : '✗ Respuesta Incorrecta (0)'}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: '600', color: text }}>
                  <span style={{ color: '#2563eb', marginRight: '6px' }}>{qIndex + 1}.</span>
                  {question.text || '(Pregunta sin enunciado)'}
                </h3>

                {/* Opciones */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {question.options.map((option) => {
                    const isSelectedByStudent = studentAnswers.includes(option.id);
                    const isCorrectAnswer = option.isCorrect;

                    let optionBg = isDark ? '#0f172a' : '#f9fafb';
                    let optionBorder = border;

                    if (isSelectedByStudent && isCorrectAnswer) {
                      // Student selected it and it is correct (Green)
                      optionBg = isDark ? 'rgba(22,163,74,0.15)' : '#d1fae5';
                      optionBorder = '#16a34a';
                    } else if (isSelectedByStudent && !isCorrectAnswer) {
                      // Student selected it and it is wrong (Red)
                      optionBg = isDark ? 'rgba(220,38,38,0.15)' : '#fee2e2';
                      optionBorder = '#dc2626';
                    } else if (!isSelectedByStudent && isCorrectAnswer) {
                      // Correct option that student missed (Subtle dashed green or light green border)
                      optionBg = isDark ? 'rgba(22,163,74,0.05)' : '#f0fdf4';
                      optionBorder = '#86efac';
                    }

                    return (
                      <div
                        key={option.id}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '14px 18px', borderRadius: '8px',
                          backgroundColor: optionBg,
                          border: `1px solid ${optionBorder}`,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '20px', height: '20px',
                            borderRadius: question.multiplyOptions ? '4px' : '50%',
                            border: `2px solid ${isSelectedByStudent ? (isCorrectAnswer ? '#16a34a' : '#dc2626') : (isCorrectAnswer ? '#16a34a' : (isDark ? '#475569' : '#cbd5db'))}`,
                            backgroundColor: isSelectedByStudent ? (isCorrectAnswer ? '#16a34a' : '#dc2626') : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#ffffff', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0
                          }}>
                            {isSelectedByStudent && (question.multiplyOptions ? '✓' : '●')}
                          </div>

                          <span style={{ fontSize: '0.92rem', color: text, fontWeight: isSelectedByStudent ? '600' : '400' }}>
                            <strong style={{ marginRight: '6px', color: isDark ? '#94a3b8' : '#6b7280' }}>{option.id}.</strong>
                            {option.text || '(Opción vacía)'}
                          </span>
                        </div>

                        {/* Badges para el repaso */}
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          {isSelectedByStudent && (
                            <span style={{
                              fontSize: '0.65rem',
                              fontWeight: 'bold',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: isCorrectAnswer ? '#16a34a' : '#dc2626',
                              color: '#ffffff'
                            }}>
                              TU RESPUESTA
                            </span>
                          )}
                          {isCorrectAnswer && (
                            <span style={{
                              fontSize: '0.65rem',
                              fontWeight: 'bold',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: isDark ? 'rgba(22,163,74,0.1)' : '#e8f5e9',
                              border: '1px solid #16a34a',
                              color: '#16a34a'
                            }}>
                              CORRECTA ✓
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- RENDER 2: RENDERING COURSE EXAM ---
  if (isCourseMode) {
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
            Curso: <strong style={{ color: '#2563eb' }}>{course.title}</strong> · {courseQuestions.length} Preguntas en total · Aprueba con el {coursePassingScore}%.
          </p>
        </div>

        {/* Formulario / Cuestionario */}
        <form onSubmit={handleSubmitCourseExam}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {courseQuestions.map((question, qIndex) => {
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
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: '600', color: text, display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: '#2563eb' }}>{qIndex + 1}.</span>
                      {question.text || '(Pregunta sin enunciado)'}
                    </div>
                    {/* Badge indicativo de Tipo de Selección (Única vs Múltiple) */}
                    <span style={{
                      alignSelf: 'flex-start',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: question.multiplyOptions ? (isDark ? '#1e3a5f' : '#dbeafe') : (isDark ? '#065f46' : '#d1fae5'),
                      color: question.multiplyOptions ? (isDark ? '#93c5fd' : '#1d4ed8') : (isDark ? '#34d399' : '#065f46'),
                      marginTop: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em'
                    }}>
                      {question.multiplyOptions ? 'Opción Múltiple (Selecciona varias)' : 'Opción Única (Selecciona una)'}
                    </span>
                  </h3>

                  {/* Bloque de Opciones de respuesta */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {question.options.map((option) => {
                      const isSelected = studentAnswers.includes(option.id);

                      return (
                        <div
                          key={option.id}
                          onClick={() => handleOptionClick(question.id, option.id, question.multiplyOptions)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            padding: '14px 18px', borderRadius: '8px', cursor: 'pointer',
                            backgroundColor: isSelected ? (isDark ? '#1e2d42' : '#eff6ff') : (isDark ? '#0f172a' : '#f9fafb'),
                            border: `1px solid ${isSelected ? '#2563eb' : border}`,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {/* Selector visual adaptado: círculo para única, cuadrado para múltiple */}
                          <div style={{
                            width: '20px', height: '20px',
                            borderRadius: question.multiplyOptions ? '4px' : '50%',
                            border: `2px solid ${isSelected ? '#2563eb' : (isDark ? '#475569' : '#cbd5db')}`,
                            backgroundColor: isSelected ? '#2563eb' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#ffffff', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0
                          }}>
                            {isSelected && (question.multiplyOptions ? '✓' : '●')}
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
        </form>
      </div>
    );
  }

  // --- RENDER 3: INDEPENDENT EXAMS MODE ---

  // If a specific independent exam is completed and showing results
  if (independentResult) {
    return (
      <div className="view-fade" style={{ maxWidth: '620px', margin: '0 auto' }}>
        <div style={{ backgroundColor: cardBg, border: `1px solid ${border}`, borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          {independentResult.pendingReview ? (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📝</div>
              <h2 style={{ color: text }}>Respuestas enviadas</h2>
              <p style={{ color: subText }}>Este examen contiene preguntas abiertas. Tus respuestas han sido registradas para revisión manual del comité.</p>
            </>
          ) : (
            <>
              <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>{independentResult.passed ? '🎉' : '😕'}</div>
              <h2 style={{ color: independentResult.passed ? '#16a34a' : '#dc2626', fontSize: '1.8rem' }}>
                {independentResult.passed ? '¡Aprobaste!' : 'No aprobaste'}
              </h2>
              <p style={{ color: text, fontSize: '1.5rem', fontWeight: 700, margin: '12px 0' }}>{independentResult.score}%</p>
              <p style={{ color: subText, lineHeight: '1.5', fontSize: '0.95rem' }}>
                {independentResult.passed
                  ? 'Se ha generado tu certificado digital automáticamente. Puedes visualizarlo en tu Perfil o en tu CV.'
                  : `Necesitabas un mínimo de ${activeExam.passingScore}% para aprobar.`}
              </p>
            </>
          )}
          <button onClick={() => { setActiveExam(null); setIndependentResult(null); }} className="btn-anim" style={{ marginTop: '25px', padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            Volver a Exámenes
          </button>
        </div>
      </div>
    );
  }

  // If currently taking an independent exam
  if (activeExam) {
    return (
      <div className="view-fade" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <button onClick={() => setActiveExam(null)} className="btn-anim" style={{ marginBottom: '16px', padding: '8px 14px', borderRadius: '8px', border: `1px solid ${border}`, backgroundColor: cardBg, color: text, cursor: 'pointer', fontWeight: 500 }}>
          ← Cancelar examen
        </button>
        <h2 style={{ color: text, margin: '0 0 4px 0' }}>{activeExam.title}</h2>
        <p style={{ color: subText, marginBottom: '20px', fontSize: '0.92rem' }}>Área: {activeExam.area} · Aprueba con el {activeExam.passingScore}%</p>

        {activeExam.questions.map((q, i) => (
          <div key={q.id} style={{ backgroundColor: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '20px', marginBottom: '14px' }}>
            <p style={{ color: text, fontWeight: 600, marginTop: 0, fontSize: '1rem' }}>{i + 1}. {q.text}</p>
            {activeExam.type === 'multiple' ? (
              q.options.filter(Boolean).map((opt, oi) => (
                <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', color: text, backgroundColor: answers[q.id] === oi ? (isDark ? '#1e2d42' : '#eff6ff') : 'transparent', marginTop: '6px', border: `1px solid ${answers[q.id] === oi ? '#2563eb' : 'transparent'}`, transition: 'all 0.15s ease' }}>
                  <input type="radio" name={`q-${q.id}`} checked={answers[q.id] === oi} onChange={() => setAnswers({ ...answers, [q.id]: oi })} />
                  <span style={{ fontSize: '0.92rem' }}>{opt}</span>
                </label>
              ))
            ) : (
              <textarea rows={3} value={answers[q.id] || ''} onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                placeholder="Escribe tu respuesta aquí..." style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: `1px solid ${border}`, backgroundColor: isDark ? '#0f172a' : '#fff', color: text, fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical' }} />
            )}
          </div>
        ))}

        <button onClick={handleSubmitIndependentExam} className="btn-anim" style={{ padding: '12px 28px', borderRadius: '10px', border: 'none', backgroundColor: '#16a34a', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
          Enviar respuestas
        </button>
      </div>
    );
  }

  // Listing available independent exams
  return (
    <div className="view-fade">
      <button onClick={() => setView('courses')} className="btn-anim" style={{ marginBottom: '20px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 500 }}>
        Volver a cursos
      </button>
      <h2 style={{ color: text, marginBottom: '4px' }}>Exámenes de Certificación Disponibles</h2>
      <p style={{ color: subText, fontSize: '0.9rem', marginBottom: '20px' }}>Cada examen se puede rendir una sola vez de manera formal.</p>

      {availableExams.length === 0 ? (
        <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No hay exámenes creados por el comité todavía.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {availableExams.map((e, i) => {
            const prev = getUserResult(currentUser.id, e.id); // attempt enforcement
            return (
              <div key={e.id} className="card-enter course-card" style={{ animationDelay: `${i * 0.06}s`, backgroundColor: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{e.area}</span>
                <h3 style={{ color: text, margin: '8px 0 10px 0', fontSize: '1.15rem', fontWeight: '600' }}>{e.title}</h3>
                <p style={{ color: subText, fontSize: '0.85rem', margin: '0 0 20px 0', lineHeight: '1.4', flexGrow: 1 }}>
                  {e.questions.length} preguntas · {e.type === 'multiple' ? 'Opción múltiple' : 'Preguntas abiertas'} · Requiere {e.passingScore}% de aciertos.
                </p>
                {prev ? (
                  <div style={{
                    fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', padding: '10px', borderRadius: '8px',
                    backgroundColor: prev.pendingReview ? (isDark ? 'rgba(217,119,6,0.15)' : '#fef3c7') : (prev.passed ? (isDark ? 'rgba(22,163,74,0.15)' : '#d1fae5') : (isDark ? 'rgba(220,38,38,0.15)' : '#fee2e2')),
                    color: prev.pendingReview ? '#d97706' : (prev.passed ? '#16a34a' : '#dc2626')
                  }}>
                    {prev.pendingReview ? 'Enviado (En revisión)' : `Ya rendido: ${prev.score}% ${prev.passed ? '✓ Aprobado' : '✗ No aprobado'}`}
                  </div>
                ) : (
                  <button onClick={() => startIndependentExam(e)} className="btn-anim" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                    Rendir examen
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};