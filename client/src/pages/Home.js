import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowRight, Heart, Home as HomeIcon, Users, Sparkles } from 'lucide-react';
import { resolveImageUrl } from '../utils/images';

const Home = () => {
  const { data: stats } = useQuery('stats', () =>
    api.get('/stats').then(res => res.data)
  );

  const { data: featuredAnimals } = useQuery('featuredAnimals', () =>
    api.get('/animals?limit=6').then(res => res.data.animals)
  );

  const { data: latestNews } = useQuery('latestNews', () =>
    api.get('/news?limit=3').then(res => res.data.news)
  );

  return (
    <div>
      {/* Hero Section - Clean Design */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 mr-2" />
            Resgatando vidas, unindo corações
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Adote um<br />
            <span className="bg-gradient-to-r from-pink-200 to-white bg-clip-text text-transparent">
              Amigo
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Somos voluntários dedicados a dar uma segunda oportunidade a cães e gatos em Franca. Conheça o nosso trabalho e faça parte desta missão.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/animais" 
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-xl transition-all"
            >
              Quero Adotar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link 
              to="/doacoes" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-white/50 hover:bg-white/20 transition-all"
            >
              Como Ajudar
              <Heart className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Estatísticas - Clean Cards */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats?.adopted || 1247}
              </div>
              <div className="text-sm text-gray-600">Animais Adotados</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HomeIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats?.available || 89}
              </div>
              <div className="text-sm text-gray-600">Disponíveis para Adoção</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats?.adoptions || 2156}
              </div>
              <div className="text-sm text-gray-600">Castrações Realizadas</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">15.000</div>
              <div className="text-sm text-gray-600">Estimativa na Rua</div>
            </div>
          </div>
        </div>
      </section>

      {/* Animais em Destaque */}
      {featuredAnimals && featuredAnimals.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Animais Esperando por Você
              </h2>
              <p className="text-gray-600">
                Conheça alguns dos nossos amigos que estão procurando um lar cheio de amor
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAnimals.slice(0, 6).map((animal) => (
                <Link
                  key={animal.id}
                  to={`/animais/${animal.id}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                    <img
                      src={animal.photos?.[0] ? resolveImageUrl(animal.photos[0]) : '/placeholder-animal.jpg'}
                      alt={animal.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{animal.name}</h3>
                    <p className="text-sm text-gray-600">{animal.species} • {animal.age}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link to="/animais" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors">
                Ver Todos os Animais
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action - Clean Design */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Faça a Diferença na Vida de um Animal
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Além da adoção, você pode ajudar através de doações, voluntariado ou compartilhando nosso trabalho
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/doacoes" className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-50 transition-colors">
              Como Doar
              <Heart className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/contato" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
              Ser Voluntário
              <Users className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Últimas Notícias */}
      {latestNews && latestNews.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Últimas Notícias
              </h2>
              <p className="text-gray-600">
                Fique por dentro das novidades da ACAPRA
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((news) => {
                const imageUrl = news.image 
                  ? (typeof news.image === 'string' ? news.image : news.image.url || `/uploads/${news.image.path}`)
                  : null;
                
                return (
                  <Link
                    key={news.id || news._id}
                    to={`/noticias/${news.id || news._id}`}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                  >
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={news.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{news.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{news.excerpt}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <div className="text-center mt-10">
              <Link to="/noticias" className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors">
                Ver Todas as Notícias
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
