import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, Users, Home as HomeIcon, Award, ArrowRight, Calendar } from 'lucide-react';
import AnimatedStats from '../components/AnimatedStats';

const Home = () => {
  const { data: stats } = useQuery('stats', () =>
    axios.get('/api/stats').then(res => res.data)
  );

  const { data: featuredAnimals } = useQuery('featuredAnimals', () =>
    axios.get('/api/animals?limit=6').then(res => res.data.animals)
  );

  const { data: latestNews } = useQuery('latestNews', () =>
    axios.get('/api/news?limit=3').then(res => res.data.news)
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Adote um Amigo
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in">
              Transforme vidas e encontre o companheiro perfeito. 
              Cada adoção é uma nova chance de felicidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/animais" className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors">
                Ver Animais
              </Link>
              <Link to="/sobre" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 px-8 rounded-lg transition-colors">
                Saiba Mais
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nosso Impacto
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Números que mostram o resultado do nosso trabalho e dedicação
            </p>
          </div>
          
          <AnimatedStats stats={stats?.summary} />
        </div>
      </section>

      {/* Animais em Destaque */}
      {featuredAnimals && featuredAnimals.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Animais Esperando por Você
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Conheça alguns dos nossos amigos que estão procurando um lar cheio de amor
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredAnimals.map((animal) => (
                <div key={animal.id} className="card hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-12">
                    <img
                      src={animal.photos?.[0]?.path ? `${animal.photos[0].path}` : '/placeholder-animal.jpg'}
                      alt={animal.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{animal.name}</h3>
                    <p className="text-gray-600 mb-2">{animal.species} • {animal.age} • {animal.size}</p>
                    <p className="text-gray-700 mb-4 line-clamp-2">{animal.description}</p>
                    <Link
                      to={`/animais/${animal.id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Conhecer {animal.name}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/animais" className="btn-primary">
                Ver Todos os Animais
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Faça a Diferença na Vida de um Animal
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Além da adoção, você pode ajudar através de doações, 
            voluntariado ou compartilhando nosso trabalho
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/doacoes" className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors">
              Como Doar
            </Link>
            <Link to="/contato" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 px-8 rounded-lg transition-colors">
              Ser Voluntário
            </Link>
          </div>
        </div>
      </section>

      {/* Últimas Notícias */}
      {latestNews && latestNews.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Últimas Notícias
              </h2>
              <p className="text-gray-600">
                Fique por dentro das novidades da ACAPRA
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((news) => (
                <div key={news.id} className="card hover:shadow-lg transition-shadow">
                  {news.image && (
                    <img
                      src={`/uploads/${news.image.path}`}
                      alt={news.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{news.title}</h3>
                    <p className="text-gray-600 mb-4">{news.excerpt}</p>
                    <Link
                      to={`/noticias/${news.id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Ler mais
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/noticias" className="btn-secondary">
                Ver Todas as Notícias
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
