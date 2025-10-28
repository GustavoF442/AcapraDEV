import { supabase, testConnection } from '../_lib/supabase.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // Testar conexão
      const isConnected = await testConnection();
      if (!isConnected) {
        return res.status(500).json({
          message: 'Falha na conexão com o banco de dados'
        });
      }

      // Verificar se já existe usuário admin
      const { data: existingAdmin } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'admin@acapra.org')
        .single();

      if (existingAdmin) {
        return res.status(200).json({
          message: 'Banco de dados já inicializado',
          admin_exists: true
        });
      }

      // Criar usuário admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const { data: admin, error: adminError } = await supabase
        .from('users')
        .insert([{
          name: 'Administrador ACAPRA',
          email: 'admin@acapra.org',
          password: hashedPassword,
          role: 'admin'
        }])
        .select()
        .single();

      if (adminError) {
        throw adminError;
      }

      // Criar alguns dados de exemplo
      const { error: animalsError } = await supabase
        .from('animals')
        .insert([
          {
            name: 'Rex',
            species: 'Cachorro',
            breed: 'Vira-lata',
            age: 'Adulto',
            size: 'Médio',
            gender: 'Macho',
            status: 'Disponível',
            description: 'Rex é um cachorro muito carinhoso e brincalhão. Adora brincar com crianças e outros animais.',
            health_status: 'Saudável',
            vaccinated: true,
            neutered: true
          },
          {
            name: 'Luna',
            species: 'Gato',
            breed: 'SRD',
            age: 'Jovem',
            size: 'Pequeno',
            gender: 'Fêmea',
            status: 'Disponível',
            description: 'Luna é uma gatinha muito dócil e carinhosa. Perfeita para apartamentos.',
            health_status: 'Saudável',
            vaccinated: true,
            neutered: true
          }
        ]);

      // Criar notícia de exemplo
      const { error: newsError } = await supabase
        .from('news')
        .insert([{
          title: 'Bem-vindos ao novo site da ACAPRA!',
          content: 'Estamos muito felizes em apresentar nosso novo site, onde você pode conhecer nossos animais disponíveis para adoção e acompanhar nossas atividades.',
          excerpt: 'Conheça nosso novo site e descubra como você pode ajudar os animais da ACAPRA.',
          status: 'publicado',
          author_id: admin.id
        }]);

      res.status(200).json({
        message: 'Banco de dados inicializado com sucesso!',
        admin_created: true,
        sample_data_created: true,
        admin_credentials: {
          email: 'admin@acapra.org',
          password: 'admin123'
        }
      });

    } catch (error) {
      console.error('Erro ao inicializar banco:', error);
      res.status(500).json({
        message: 'Erro ao inicializar banco de dados',
        error: error.message
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
