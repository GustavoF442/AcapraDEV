import React from 'react';
import { Heart, Users, Award, Target, Shield, Smile } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Amor pelos Animais',
      description: 'Dedicamos nossa vida ao bem-estar e proteção de todos os animais em situação de vulnerabilidade.'
    },
    {
      icon: Users,
      title: 'Trabalho em Equipe',
      description: 'Acreditamos que juntos podemos fazer muito mais pelos animais que precisam de ajuda.'
    },
    {
      icon: Shield,
      title: 'Transparência',
      description: 'Mantemos total transparência em nossas ações e no uso dos recursos recebidos.'
    },
    {
      icon: Target,
      title: 'Responsabilidade',
      description: 'Cada animal resgatado recebe todo o cuidado necessário até encontrar um lar definitivo.'
    }
  ];

  const team = [
    {
      name: 'Maria Silva',
      role: 'Fundadora e Presidente',
      description: 'Veterinária com 15 anos de experiência, fundou a ACAPRA em 2015 com o sonho de reduzir o sofrimento animal.',
      image: '/team-maria.jpg'
    },
    {
      name: 'João Santos',
      role: 'Coordenador de Resgates',
      description: 'Responsável pela coordenação dos resgates e primeiros socorros aos animais encontrados.',
      image: '/team-joao.jpg'
    },
    {
      name: 'Ana Costa',
      role: 'Coordenadora de Adoções',
      description: 'Cuida do processo de adoção, garantindo que cada animal encontre a família perfeita.',
      image: '/team-ana.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nossa História
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Conheça a ACAPRA e nossa missão de transformar vidas através do amor e cuidado com os animais
            </p>
          </div>
        </div>
      </section>

      {/* História */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Como Tudo Começou
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  A ACAPRA (Associação de Proteção aos Animais) nasceu em 2015 do sonho de um grupo de 
                  voluntários que não conseguia ficar indiferente ao sofrimento dos animais abandonados 
                  nas ruas de nossa cidade.
                </p>
                <p>
                  Começamos pequenos, resgatando alguns cães e gatos feridos, mas logo percebemos que 
                  precisávamos de uma estrutura maior para fazer a diferença que queríamos ver no mundo.
                </p>
                <p>
                  Hoje, após anos de dedicação, já resgatamos mais de 2.000 animais, realizamos 
                  campanhas de castração e educação, e encontramos lares amorosos para centenas de 
                  nossos protegidos.
                </p>
                <p>
                  Nossa jornada continua, e cada vida salva nos motiva a seguir em frente, sabendo 
                  que ainda há muito trabalho pela frente.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://olhardovale.com.br/wp-content/uploads/2023/02/logo_acapra.webp"
                alt="História da ACAPRA"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-primary-600 bg-opacity-20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Missão, Visão e Valores
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Missão</h3>
              <p className="text-gray-700">
                Resgatar, cuidar e encontrar lares amorosos para animais em situação de 
                vulnerabilidade, promovendo o bem-estar animal e a conscientização da sociedade.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Smile className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Visão</h3>
              <p className="text-gray-700">
                Ser referência em proteção animal, criando uma sociedade onde todos os animais 
                sejam tratados com respeito, amor e dignidade.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Valores</h3>
              <p className="text-gray-700">
                Amor, compaixão, transparência, responsabilidade e dedicação incondicional 
                ao bem-estar de todos os animais.
              </p>
            </div>
          </div>

          {/* Valores Detalhados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-primary-100 rounded-lg p-3 flex-shrink-0">
                  <value.icon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h4>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nossa Equipe
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conheça as pessoas dedicadas que tornam possível o trabalho da ACAPRA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <Users className="h-16 w-16 text-gray-400" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-700 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Nosso Impacto em Números
            </h2>
            <p className="text-primary-100 max-w-2xl mx-auto">
              Cada número representa uma vida transformada e uma família mais feliz
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2000+</div>
              <div className="text-primary-100">Animais Resgatados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1500+</div>
              <div className="text-primary-100">Adoções Realizadas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">3000+</div>
              <div className="text-primary-100">Castrações</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-100">Voluntários Ativos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Faça Parte da Nossa História
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Sua ajuda é fundamental para continuarmos salvando vidas. 
            Seja através de adoção, doação ou voluntariado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/animais" className="btn-primary">
              Adotar um Animal
            </a>
            <a href="/doacoes" className="btn-secondary">
              Como Doar
            </a>
            <a href="/contato" className="btn-secondary">
              Ser Voluntário
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
