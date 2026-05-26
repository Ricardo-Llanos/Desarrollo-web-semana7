import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { CertificateView } from './CertificateView';

export const UserManagement = ({ setView }) => {
  const { users, setUsers } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [viewingCert, setViewingCert] = useState(null);
  const [notice, setNotice] = useState(null);

  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  const card = isDark ? '#1e293b' : '#fff';
  const border = isDark ? '#334155' : '#f0f0f0';
  const sub = isDark ? '#94a3b8' : '#6b7280';
  const th = { textAlign: 'left', padding: '10px', fontSize: '0.8rem', color: sub, borderBottom: `1px solid ${isDark ? '#334155' : '#e5e7eb'}` };
  const td = { padding: '10px', fontSize: '0.85rem', borderBottom: `1px solid ${isDark ? '#1e293b' : '#f3f4f6'}`, verticalAlign: 'top' };

  return (
    <div>
      <button onClick={() => setView('courses')} className="btn-anim" style={{ marginBottom: '20px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 500 }}>
        Volver a cursos
      </button>

      <h2 style={{ marginBottom: '6px' }}>Usuarios registrados</h2>
      <p style={{ color: sub, fontSize: '0.9rem', marginBottom: '16px' }}>Total: {users.length} usuario(s)</p>

      {notice && (
        <div className={notice.type === 'error' ? 'shake' : 'fade-in'} style={{
          padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem',
          backgroundColor: notice.type === 'error' ? '#fee2e2' : '#dcfce7',
          color: notice.type === 'error' ? '#b91c1c' : '#15803d'
        }}>{notice.text}</div>
      )}

      {users.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>Aún no hay usuarios registrados.</p>
      ) : (
        <div style={{ overflowX: 'auto', backgroundColor: card, borderRadius: '12px', padding: '10px', border: `1px solid ${border}` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Nombre</th>
                <th style={th}>Correo</th>
                <th style={th}>Documento</th>
                <th style={th}>Especialidad</th>
                <th style={th}>Certificados</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className="row-enter" style={{ animationDelay: `${i * 0.05}s` }}>
                  <td style={td}>{u.name}</td>
                  <td style={td}>{u.email}</td>
                  <td style={td}>{u.document}</td>
                  <td style={td}>{u.specialty}</td>
                  <td style={td}>
                    {u.certificates.length === 0 ? (
                      <span style={{ color: '#9ca3af' }}>—</span>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {u.certificates.map(c => (
                          <button key={c.code} onClick={() => setViewingCert(c)} className="link-anim" style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.8rem', textAlign: 'left', padding: 0, textDecoration: 'underline' }}>
                            {c.examName} ({c.code})
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={td}>
                    <button onClick={() => deleteUser(u.id)} className="btn-anim" style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Visor del certificado (modal) */}
      {viewingCert && (
        <div className="fade-in" onClick={() => setViewingCert(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '660px' }}>
            <CertificateView cert={viewingCert} onClose={() => setViewingCert(null)} />
          </div>
        </div>
      )}
    </div>
  );
};
