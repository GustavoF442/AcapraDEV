// utils/normalize.js
const mapEnum = (value, dict) => {
  if (value == null) return value;
  const v = String(value).trim().toLowerCase();
  for (const [canon, aliases] of Object.entries(dict)) {
    const all = [canon.toLowerCase(), ...(aliases || []).map(a => a.toLowerCase())];
    if (all.includes(v)) return canon;
  }
  return value; // deixa a validação acusar se não casar
};

const toBool = (v) => {
  if (v === true || v === false) return v;
  const s = String(v || '').toLowerCase();
  return ['true', '1', 'on', 'yes', 'sim'].includes(s);
};

module.exports = { mapEnum, toBool };
