import { jsPDF } from 'jspdf';

// Hash simple (djb2) para un "código único / hash" del certificado
const simpleHash = (str) => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return (h >>> 0).toString(16).toUpperCase();
};

// Genera el objeto certificado al APROBAR un examen
export const createCertificate = ({ userId, userName, examName }) => {
  const date = new Date().toISOString();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const code = `CERT-${Date.now().toString(36).toUpperCase()}-${rand}`;
  const hash = simpleHash(`${userName}|${examName}|${date}|${code}`);
  return { code, hash, userId, userName, examName, date };
};

// --- Almacén "público" de certificados (para que la URL pública pueda leerlos) ---
const STORE_KEY = 'certificates_store';

export const saveCertificateToStore = (cert) => {
  const store = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  store[cert.code] = cert;
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
};

export const getCertificateByCode = (code) => {
  const store = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  return store[code] || null;
};

// URL pública para ver el certificado
export const getPublicUrl = (code) =>
  `${window.location.origin}${window.location.pathname}?cert=${code}`;

// URL pública del currículum (Req. 5)
export const getCvUrl = (userId) =>
  `${window.location.origin}${window.location.pathname}?cv=${userId}`;

// Formatea fecha legible
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });

// Genera y descarga el PDF del certificado
export const downloadCertificatePDF = (cert) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // Fondo y marco
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, W, H, 'F');
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(2);
  doc.rect(10, 10, W - 20, H - 20);
  doc.setLineWidth(0.5);
  doc.rect(14, 14, W - 28, H - 28);

  // Encabezado
  doc.setTextColor(37, 99, 235);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.text('CERTIFICADO DE APROBACIÓN', W / 2, 45, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.text('Se otorga el presente certificado a:', W / 2, 65, { align: 'center' });

  // Nombre del usuario
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text(cert.userName, W / 2, 82, { align: 'center' });

  // Examen
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(100, 116, 139);
  doc.text('por haber aprobado satisfactoriamente el examen:', W / 2, 96, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(37, 99, 235);
  doc.text(`"${cert.examName}"`, W / 2, 108, { align: 'center' });

  // Pie: fecha, código, hash
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(`Fecha de emisión: ${formatDate(cert.date)}`, W / 2, 130, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Código único: ${cert.code}`, W / 2, 142, { align: 'center' });
  doc.text(`Hash de verificación: ${cert.hash}`, W / 2, 149, { align: 'center' });

  // URL pública
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(9);
  doc.text(`Verifica en: ${getPublicUrl(cert.code)}`, W / 2, 160, { align: 'center' });

  doc.save(`${cert.code}.pdf`);
};
