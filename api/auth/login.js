export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Credenciais hardcoded para teste
    if (email === 'admin@acapra.org' && password === 'admin123') {
      res.status(200).json({
        message: 'Login realizado com sucesso',
        token: 'mock-jwt-token-12345',
        user: {
          id: 1,
          name: 'Administrador ACAPRA',
          email: 'admin@acapra.org',
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({
        message: 'Credenciais inválidas'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
