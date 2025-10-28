export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    // Mock de animal individual
    const mockAnimal = {
      id: parseInt(id),
      name: id === '1' ? 'Rex' : 'Luna',
      species: id === '1' ? 'Cachorro' : 'Gato',
      breed: id === '1' ? 'Vira-lata' : 'SRD',
      age: id === '1' ? 'Adulto' : 'Jovem',
      size: id === '1' ? 'Médio' : 'Pequeno',
      gender: id === '1' ? 'Macho' : 'Fêmea',
      status: 'Disponível',
      description: id === '1' 
        ? 'Rex é um cachorro muito carinhoso e brincalhão.' 
        : 'Luna é uma gatinha muito dócil e carinhosa.',
      photos: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(200).json(mockAnimal);
  } else if (req.method === 'PUT') {
    // Atualizar animal (mock)
    res.status(200).json({
      message: 'Animal atualizado com sucesso',
      animal: {
        id: parseInt(id),
        ...req.body,
        updatedAt: new Date()
      }
    });
  } else if (req.method === 'DELETE') {
    // Deletar animal (mock)
    res.status(200).json({
      message: 'Animal removido com sucesso'
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
