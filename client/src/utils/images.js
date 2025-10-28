export function resolveImageUrl(photoOrPath) {
  if (!photoOrPath) return '';
  const p = typeof photoOrPath === 'string' ? photoOrPath : (photoOrPath.path || '');
  const isAbsolute = /^https?:\/\//i.test(p);
  return isAbsolute ? p : (p ? `/uploads/${p}` : '');
}
