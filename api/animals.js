export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { limit = 10, page = 1, species, status, search } = req.query;
    
    // Dados mock para demonstração
    const mockAnimals = [
      {
        id: 1,
        name: 'Rex',
        species: 'Cachorro',
        breed: 'Vira-lata',
        age: 'Adulto',
        size: 'Médio',
        gender: 'Macho',
        status: 'Disponível',
        description: 'Rex é um cachorro muito carinhoso e brincalhão.',
        photos: []
      },
      {
        id: 2,
        name: 'Luna',
        species: 'Gato',
        breed: 'SRD',
        age: 'Jovem',
        size: 'Pequeno',
        gender: 'Fêmea',
        status: 'Disponível',
        description: 'Luna é uma gatinha muito dócil e carinhosa.',
        photos: []
      }
    ];
    
    res.status(200).json({
      animals: mockAnimals,
      pagination: {
        page: parseInt(page),
        pages: 1,
        total: mockAnimals.length,
        limit: parseInt(limit)
      }
    });
  } else if (req.method === 'POST') {
    // Criar novo animal (mock)
    res.status(201).json({
      message: 'Animal criado com sucesso',
      animal: {
        id: Date.now(),
        ...req.body,
        createdAt: new Date()
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
