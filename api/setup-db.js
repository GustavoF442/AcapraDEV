import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Inserir dados de exemplo diretamente
    const { data: animals, error: insertError } = await supabase
      .from('animals')
      .insert([
        {
          name: 'Rex',
          species: 'Cão',
          breed: 'Labrador',
          age: 3,
          gender: 'Macho',
          size: 'Grande',
          description: 'Rex é um cão muito carinhoso e brincalhão.',
          status: 'available'
        },
        {
          name: 'Mimi',
          species: 'Gato',
          breed: 'Siamês',
          age: 2,
          gender: 'Fêmea',
          size: 'Pequeno',
          description: 'Mimi é uma gatinha muito dócil e carinhosa.',
          status: 'available'
        }
      ])
      .select();

    const { data: news, error: newsInsertError } = await supabase
      .from('news')
      .insert([
        {
          title: 'Campanha de Adoção 2024',
          content: 'Nossa campanha de adoção está em andamento. Venha conhecer nossos animais!',
          excerpt: 'Participe da nossa campanha de adoção',
          status: 'published'
        }
      ])
      .select();

    return res.status(200).json({
      message: 'Dados inseridos com sucesso!',
      data: {
        animals: animals || [],
        news: news || []
      },
      errors: {
        insert: insertError?.message || null,
        newsInsert: newsInsertError?.message || null
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao inserir dados',
      error: error.message
    });
  }
}
