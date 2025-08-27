const BASE = 'http://127.0.0.1:5000';

export function imgUrl(p, fallback) {
  if (!p) return fallback || '';
  let s = String(p).replace(/\\/g, '/'); // windows -> web
  if (s.startsWith('http')) return s;
  if (s.startsWith('/')) return BASE + s;  // /uploads/...
  return BASE + '/' + s;                   // uploads/...
}