import React, { createContext, useState, useEffect } from 'react';

export const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  // Resultados de los exámenes de certificación rendidos por los usuarios
  const [results, setResults] = useState(() => JSON.parse(localStorage.getItem('results') || '[]'));

  useEffect(() => { 
    localStorage.setItem('results', JSON.stringify(results)); 
  }, [results]);

  // ---- Resultados (Req. 2 - Validaciones de intentos y aprobaciones) ----
  const getUserResult = (userId, examId) =>
    results.find(r => r.userId === userId && r.examId === examId);

  const saveResult = (result) => 
    setResults(prev => [...prev, { ...result, id: Date.now() }]);

  return (
    <ExamContext.Provider value={{
      exams: [], // Retornado para compatibilidad segura de desestructuración
      results,
      getUserResult,
      saveResult
    }}>
      {children}
    </ExamContext.Provider>
  );
};
