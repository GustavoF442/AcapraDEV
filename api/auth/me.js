export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.includes('mock-jwt-token')) {
      res.status(200).json({
        user: {
          id: 1,
          name: 'Administrador ACAPRA',
          email: 'admin@acapra.org',
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({
        message: 'Token inválido'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
