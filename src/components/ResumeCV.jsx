import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { getPublicUrl, getCvUrl, formatDate } from '../utils/certificates';

// Currículum digital vinculado a certificaciones (Req. 5)
export const ResumeCV = ({ userId, isPublic = false, setView }) => {
  const { currentUser, users, updateUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const person = users.find(u => u.id === Number(userId)) || (currentUser?.id === Number(userId) ? currentUser : null);
  const canEdit = !isPublic && currentUser && currentUser.id === Number(userId); // edición controlada

  const cv = person?.cv || { headline: '', about: '', experience: [], education: [] };
  const [draft, setDraft] = useState(cv);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const bg = isPublic ? (isDark ? '#0f172a' : '#f3f4f6') : 'transparent';
  const card = isDark ? '#1e293b' : '#fff';
  const border = isDark ? '#334155' : '#e5e7eb';
  const text = isDark ? '#f1f5f9' : '#111827';
  const sub = isDark ? '#94a3b8' : '#6b7280';
  const input = { width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`, backgroundColor: isDark ? '#0f172a' : '#fff', color: text, fontSize: '0.85rem', marginBottom: '6px' };

  if (!person) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: sub }}>Currículum no encontrado.</div>;
  }

  const save = () => { updateUser(person.id, { cv: draft }); setEditing(false); };
  const addExp = () => setDraft({ ...draft, experience: [...draft.experience, { role: '', company: '', period: '' }] });
  const addEdu = () => setDraft({ ...draft, education: [...draft.education, { title: '', institution: '', period: '' }] });
  const cvUrl = getCvUrl(person.id);
  const copyUrl = () => { navigator.clipboard?.writeText(cvUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div style={{ backgroundColor: bg, minHeight: isPublic ? '100vh' : 'auto', padding: isPublic ? '40px 20px' : 0 }}>
      <div className="view-fade" style={{ maxWidth: '780px', margin: '0 auto' }}>
        {!isPublic && (
          <button onClick={() => setView('courses')} className="btn-anim" style={{ marginBottom: '20px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 500 }}>
            Volver a cursos
          </button>
        )}

        {/* Encabezado */}
        <div style={{ backgroundColor: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '32px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
              {person.name[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h1 style={{ color: text, margin: 0, fontSize: '1.6rem' }}>{person.name}</h1>
              {editing
                ? <input value={draft.headline} onChange={e => setDraft({ ...draft, headline: e.target.value })} placeholder="Titular profesional (ej. Ingeniero de Sistemas)" style={{ ...input, marginTop: '6px' }} />
                : <p style={{ color: '#2563eb', fontWeight: 600, margin: '4px 0' }}>{cv.headline || person.specialty}</p>}
              <p style={{ color: sub, fontSize: '0.85rem', margin: 0 }}>{person.email} · {person.specialty}</p>
            </div>
          </div>

          {/* URL única del CV */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: sub, wordBreak: 'break-all' }}>{cvUrl}</span>
            <button onClick={copyUrl} className="btn-anim" style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontSize: '0.75rem', cursor: 'pointer' }}>
              {copied ? 'Copiada' : 'Copiar URL'}
            </button>
            {canEdit && (
              <button onClick={() => editing ? save() : setEditing(true)} className="btn-anim" style={{ padding: '4px 14px', borderRadius: '6px', border: 'none', backgroundColor: editing ? '#16a34a' : '#2563eb', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                {editing ? 'Guardar' : 'Editar CV'}
              </button>
            )}
          </div>
        </div>

        {/* Sobre mí */}
        <div style={{ backgroundColor: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ color: text, marginTop: 0 }}>Sobre mí</h3>
          {editing
            ? <textarea rows={3} value={draft.about} onChange={e => setDraft({ ...draft, about: e.target.value })} style={input} />
            : <p style={{ color: sub, lineHeight: 1.6 }}>{cv.about || 'Sin descripción.'}</p>}
        </div>

        {/* Certificaciones obtenidas (enlaces a sus URLs públicas) */}
        <div style={{ backgroundColor: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ color: text, marginTop: 0 }}>🎓 Certificaciones</h3>
          {(!person.certificates || person.certificates.length === 0) ? (
            <p style={{ color: sub, fontSize: '0.88rem' }}>Aún no tiene certificaciones.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {person.certificates.map(c => (
                <div key={c.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', border: `1px solid ${border}`, backgroundColor: isDark ? '#0f172a' : '#f9fafb' }}>
                  <div>
                    <div style={{ color: text, fontWeight: 600, fontSize: '0.9rem' }}>{c.examName}</div>
                    <div style={{ color: sub, fontSize: '0.75rem' }}>{formatDate(c.date)} · {c.code}</div>
                  </div>
                  <a href={getPublicUrl(c.code)} target="_blank" rel="noreferrer" className="link-anim" style={{ color: '#2563eb', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    Ver certificado →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Experiencia laboral */}
        <Section title="💼 Experiencia laboral" items={editing ? draft.experience : cv.experience}
          editing={editing} isDark={isDark} card={card} border={border} text={text} sub={sub} input={input}
          fields={['role', 'company', 'period']} placeholders={['Cargo', 'Empresa', 'Periodo (ej. 2023-2024)']}
          onChange={(idx, f, v) => { const arr = [...draft.experience]; arr[idx] = { ...arr[idx], [f]: v }; setDraft({ ...draft, experience: arr }); }}
          onAdd={addExp}
          onRemove={(idx) => setDraft({ ...draft, experience: draft.experience.filter((_, i) => i !== idx) })}
          render={(it) => `${it.role || ''} — ${it.company || ''} (${it.period || ''})`} />

        {/* Formación académica */}
        <Section title="📚 Formación académica" items={editing ? draft.education : cv.education}
          editing={editing} isDark={isDark} card={card} border={border} text={text} sub={sub} input={input}
          fields={['title', 'institution', 'period']} placeholders={['Título/Grado', 'Institución', 'Periodo']}
          onChange={(idx, f, v) => { const arr = [...draft.education]; arr[idx] = { ...arr[idx], [f]: v }; setDraft({ ...draft, education: arr }); }}
          onAdd={addEdu}
          onRemove={(idx) => setDraft({ ...draft, education: draft.education.filter((_, i) => i !== idx) })}
          render={(it) => `${it.title || ''} — ${it.institution || ''} (${it.period || ''})`} />
      </div>
    </div>
  );
};

// Subcomponente reutilizable para Experiencia/Formación
const Section = ({ title, items, editing, card, border, text, sub, input, fields, placeholders, onChange, onAdd, onRemove, render }) => (
  <div style={{ backgroundColor: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
    <h3 style={{ color: text, marginTop: 0 }}>{title}</h3>
    {(!items || items.length === 0) && !editing && <p style={{ color: sub, fontSize: '0.88rem' }}>Sin registros.</p>}
    {(items || []).map((it, idx) => (
      <div key={idx} style={{ marginBottom: '12px' }}>
        {editing ? (
          <div style={{ border: `1px dashed ${border}`, borderRadius: '8px', padding: '10px' }}>
            {fields.map((f, fi) => (
              <input key={f} value={it[f] || ''} placeholder={placeholders[fi]} onChange={e => onChange(idx, f, e.target.value)} style={input} />
            ))}
            <button onClick={() => onRemove(idx)} className="link-anim" style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Quitar</button>
          </div>
        ) : (
          <div style={{ color: text, fontSize: '0.9rem' }}>{render(it)}</div>
        )}
      </div>
    ))}
    {editing && (
      <button onClick={onAdd} className="btn-anim" style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', cursor: 'pointer', fontSize: '0.82rem' }}>
        + Agregar
      </button>
    )}
  </div>
);
