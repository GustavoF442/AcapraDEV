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
    res.status(200).json({
      summary: {
        totalAnimals: 0,
        adoptedAnimals: 0,
        pendingAdoptions: 0,
        totalNews: 0
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
