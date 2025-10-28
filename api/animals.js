export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { limit = 10, page = 1 } = req.query;
    
    res.status(200).json({
      animals: [],
      pagination: {
        page: parseInt(page),
        pages: 1,
        total: 0,
        limit: parseInt(limit)
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
