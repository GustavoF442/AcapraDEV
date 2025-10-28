import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Inserir os animais que você tinha (baseado na imagem do dashboard)
    const animalsToAdd = [
      {
        name: 'Buddy',
        species: 'Cão',
        breed: 'Beagle',
        age: 3,
        gender: 'Macho',
        size: 'Médio',
        description: 'Buddy é um cão muito carinhoso e brincalhão.',
        status: 'available'
      },
      {
        name: 'Nina',
        species: 'Cão', 
        breed: 'Poodle',
        age: 2,
        gender: 'Fêmea',
        size: 'Pequeno',
        description: 'Nina é uma cadelinha muito dócil e carinhosa.',
        status: 'available'
      },
      {
        name: 'Simba',
        species: 'Gato',
        breed: 'Misto',
        age: 1,
        gender: 'Macho', 
        size: 'Médio',
        description: 'Simba é um gatinho jovem e muito ativo.',
        status: 'available'
      },
      {
        name: 'Lola',
        species: 'Cão',
        breed: 'Bulldog Francês', 
        age: 4,
        gender: 'Fêmea',
        size: 'Pequeno',
        description: 'Lola é uma cadelinha muito carinhosa.',
        status: 'available'
      },
      {
        name: 'Oliver',
        species: 'Gato',
        breed: 'Vira-lata',
        age: 2,
        gender: 'Macho',
        size: 'Médio', 
        description: 'Oliver é um gato muito tranquilo e afetuoso.',
        status: 'available'
      }
    ];

    const { data: newAnimals, error } = await supabase
      .from('animals')
      .insert(animalsToAdd)
      .select();

    if (error) {
      return res.status(500).json({
        message: 'Erro ao adicionar animais',
        error: error.message
      });
    }

    // Buscar todos os animais
    const { data: allAnimals } = await supabase
      .from('animals')
      .select('*')
      .order('id', { ascending: true });

    return res.status(200).json({
      message: `${newAnimals.length} animais adicionados com sucesso!`,
      totalAnimals: allAnimals?.length || 0,
      newAnimals: newAnimals,
      allAnimals: allAnimals
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao adicionar animais',
      error: error.message
    });
  }
}
