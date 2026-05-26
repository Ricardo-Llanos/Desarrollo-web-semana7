import { createContext, useState, useEffect } from 'react';
import { createCertificate, saveCertificateToStore } from '../utils/certificates';

export const AuthContext = createContext();

// Credenciales fijas del administrador (las que pide el examen)
const ADMIN = { username: 'admin', password: '123456' };

export const AuthProvider = ({ children }) => {
  // Lista de usuarios registrados (persiste en el navegador)
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [];
  });

  // Usuario que tiene la sesión abierta (null = nadie -> se muestra el login)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
    else localStorage.removeItem('currentUser');
  }, [currentUser]);

  // INICIAR SESIÓN -> devuelve { ok, error }
  const login = (username, password) => {
    // 1) ¿Es el administrador?
    if (username === ADMIN.username && password === ADMIN.password) {
      setCurrentUser({ name: 'Administrador', username: 'admin', role: 'admin' });
      return { ok: true };
    }
    // 2) ¿Es un usuario registrado?
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      setCurrentUser({ ...found, role: 'user' });
      return { ok: true };
    }
    return { ok: false, error: 'Usuario o contraseña incorrectos' };
  };

  // REGISTRAR usuario: valida, controla duplicados y GENERA usuario + contraseña
  const register = ({ fullName, email, document, specialty }) => {
    // Validaciones (campos obligatorios)
    if (!fullName || !email || !document || !specialty) {
      return { ok: false, error: 'Todos los campos son obligatorios' };
    }
    // Validación de correo
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: 'El correo electrónico no es válido' };
    }
    // Control de duplicados: documento ÚNICO
    if (users.some(u => u.document === document)) {
      return { ok: false, error: 'Ya existe un usuario con ese número de documento' };
    }
    // Control de duplicados: correo único
    if (users.some(u => u.email === email)) {
      return { ok: false, error: 'Ya existe un usuario con ese correo' };
    }

    // Generación automática de nombre de usuario y contraseña
    const base = fullName.trim().toLowerCase().split(' ')[0];
    const username = `${base}${document.slice(-3)}`;
    const password = `${base}${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = {
      id: Date.now(),
      name: fullName,
      email,
      document,
      specialty,
      username,
      password,
      exams: [],        // Asociación con exámenes
      certificates: []  // Asociación con certificados
    };

    setUsers(prev => [...prev, newUser]);
    return { ok: true, username, password };
  };

  // APROBAR EXAMEN -> emite certificado (req. 3) y lo asocia al usuario (req. 4)
  const issueCertificate = (userId, examName) => {
    const target = users.find(u => u.id === userId);
    if (!target || !examName.trim()) return { ok: false, error: 'Falta el nombre del examen' };

    const cert = createCertificate({ userId, userName: target.name, examName: examName.trim() });
    saveCertificateToStore(cert); // guardado para la URL pública

    setUsers(prev => prev.map(u =>
      u.id === userId
        ? { ...u, exams: [...u.exams, examName.trim()], certificates: [...u.certificates, cert] }
        : u
    ));
    return { ok: true, cert };
  };

  // Actualiza datos de un usuario (p. ej. su CV) y sincroniza la sesión actual
  const updateUser = (userId, patch) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...patch } : u));
    setCurrentUser(prev => (prev && prev.id === userId ? { ...prev, ...patch } : prev));
  };

  const logout = () => setCurrentUser(null);

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,     // alias para no romper Navbar/Profile existentes
        setUser: setCurrentUser,
        currentUser,
        users,
        setUsers,
        login,
        register,
        logout,
        isAdmin,
        issueCertificate,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
