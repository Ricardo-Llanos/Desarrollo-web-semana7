import React, { useState } from 'react';
import { downloadCertificatePDF, getPublicUrl, formatDate } from '../utils/certificates';

// public = true cuando se abre desde la URL pública (sin sesión)
export const CertificateView = ({ cert, onClose, isPublic = false }) => {
  const [copied, setCopied] = useState(false);

  if (!cert) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Certificado no encontrado</h2>
          <p style={{ color: '#6b7280' }}>El código no corresponde a ningún certificado emitido.</p>
        </div>
      </div>
    );
  }

  const publicUrl = getPublicUrl(cert.code);

  const copyUrl = () => {
    navigator.clipboard?.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const wrapper = isPublic
    ? { minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }
    : {};

  return (
    <div style={wrapper}>
      <div className="pop-in" style={{
        maxWidth: '640px', width: '100%', margin: '0 auto',
        backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.12)', border: '6px solid #2563eb',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{ padding: '40px 36px', textAlign: 'center' }}>
          <p style={{ color: '#2563eb', fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.9rem', margin: 0 }}>
            CERTIFICADO DE APROBACIÓN
          </p>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#2563eb', margin: '14px auto 26px' }} />

          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0 0 6px' }}>Se otorga a</p>
          <h1 style={{ color: '#0f172a', fontSize: '1.9rem', margin: '0 0 18px' }}>{cert.userName}</h1>

          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0 0 4px' }}>por aprobar el examen</p>
          <h2 style={{ color: '#2563eb', fontSize: '1.25rem', margin: '0 0 26px' }}>"{cert.examName}"</h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', color: '#475569', fontSize: '0.85rem' }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Fecha de emisión</div>
              <div style={{ fontWeight: 600 }}>{formatDate(cert.date)}</div>
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Código único</div>
              <div style={{ fontWeight: 600 }}>{cert.code}</div>
            </div>
          </div>

          <div style={{ marginTop: '14px', color: '#94a3b8', fontSize: '0.75rem' }}>
            Hash de verificación: <strong>{cert.hash}</strong>
          </div>
        </div>

        {/* Acciones */}
        <div style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e5e7eb', padding: '18px 24px', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
          <button onClick={() => downloadCertificatePDF(cert)} className="btn-anim" style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            Descargar PDF
          </button>
          <button onClick={copyUrl} className="btn-anim" style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontWeight: 600, cursor: 'pointer' }}>
            {copied ? '¡URL copiada!' : 'Copiar URL pública'}
          </button>
          {!isPublic && onClose && (
            <button onClick={onClose} className="btn-anim" style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontWeight: 600, cursor: 'pointer' }}>
              Cerrar
            </button>
          )}
        </div>

        <div style={{ padding: '10px 24px 18px', textAlign: 'center', fontSize: '0.75rem', color: '#2563eb', wordBreak: 'break-all' }}>
          {publicUrl}
        </div>
      </div>
    </div>
  );
};
