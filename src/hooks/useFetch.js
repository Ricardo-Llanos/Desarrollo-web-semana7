import { useState, useEffect } from 'react';

export const useFetch = ( url ) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // IA: Loop infinito al inicializar -> Solución manual: Añadir URL al array de dependencias al implementar AbortController
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, { signal: controller.signal });
        const result = await response.json();
        setData(result);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error al cargar cursos:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Función de limpieza (Cleanup)
    return () => controller.abort(); 
  }, [url]);

  return { data, loading };
};