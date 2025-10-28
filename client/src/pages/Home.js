import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Heart, Users, Award, Sparkles, Star } from 'lucide-react';
import AnimatedStats from '../components/AnimatedStats';
import AnimatedBackground from '../components/AnimatedBackground';

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
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce delay-1000">
          <Star className="h-8 w-8 text-white/30" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce delay-2000">
          <Heart className="h-6 w-6 text-pink-300/50" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce delay-3000">
          <Sparkles className="h-10 w-10 text-purple-300/40" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Resgatando vidas, unindo corações
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 animate-fade-in-up">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Adote um
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
              Amigo
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Somos voluntários dedicados a dar uma segunda oportunidade a 
            cães e gatos em Franca. Conheça o nosso trabalho e faça parte 
            desta missão.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-400">
            <Link 
              to="/animais" 
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10 flex items-center">
                Quero Adotar
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link 
              to="/doacoes" 
              className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full border-2 border-white/30 transition-all duration-300 transform hover:scale-105 hover:bg-white/20"
            >
              <span className="flex items-center">
                Como Ajudar
                <Heart className="ml-2 h-5 w-5 group-hover:text-pink-300 transition-colors" />
              </span>
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Nossa Missão */}
      <section className="relative py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              A nossa Missão
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quem Somos</h3>
              <p className="text-gray-600 leading-relaxed">
                A ACAPRA atua há mais de 20 anos em Franca, com trabalhos 100% voluntário, 
                resgatando e amparando animais em situação de maus-tratos e abandono.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">O Que Fazemos</h3>
              <p className="text-gray-600 leading-relaxed">
                Lutamos contra o sofrimento animal, promovemos resgates, cuidados 
                veterinários, castrações e o mais importante: a adoção responsável.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Desafios Atuais</h3>
              <p className="text-gray-600 leading-relaxed">
                Enfrentamos uma dívida crítica que limita os nossos atendimentos. 
                Contribuímos firmes com campanhas de arrecadação e educação sobre posse responsável.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nosso Impacto
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Números que mostram o resultado do nosso trabalho e dedicação
            </p>
          </div>
          
          <AnimatedStats stats={stats?.summary} />
        </div>
      </section>

      {/* Animais em Destaque */}
      {featuredAnimals && featuredAnimals.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Animais Esperando por Você
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Conheça alguns dos nossos amigos que estão procurando um lar cheio de amor
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredAnimals.map((animal) => (
                <div key={animal.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                    <img
                      src={animal.photos?.[0]?.path ? `${animal.photos[0].path}` : '/placeholder-animal.jpg'}
                      alt={animal.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{animal.name}</h3>
                    <p className="text-gray-600 mb-2">{animal.species} • {animal.age} • {animal.size}</p>
                    <p className="text-gray-700 mb-4 line-clamp-2">{animal.description}</p>
                    <Link
                      to={`/animais/${animal.id}`}
                      className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium group-hover:translate-x-1 transition-transform"
                    >
                      Conhecer {animal.name}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Link to="/animais" className="btn-primary text-lg px-8 py-4">
                Ver Todos os Animais
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Faça a Diferença na Vida de um Animal
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Além da adoção, você pode ajudar através de doações, 
            voluntariado ou compartilhando nosso trabalho
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/doacoes" className="group px-8 py-4 bg-white text-purple-600 hover:bg-gray-100 font-bold rounded-full transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center">
                Como Doar
                <Heart className="ml-2 h-5 w-5 group-hover:text-red-500 transition-colors" />
              </span>
            </Link>
            <Link to="/contato" className="group px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold rounded-full transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center">
                Ser Voluntário
                <Users className="ml-2 h-5 w-5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Últimas Notícias */}
      {latestNews && latestNews.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Últimas Notícias
              </h2>
              <p className="text-xl text-gray-600">
                Fique por dentro das novidades da ACAPRA
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((news) => (
                <div key={news.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  {news.image && (
                    <img
                      src={`/uploads/${news.image.path}`}
                      alt={news.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{news.title}</h3>
                    <p className="text-gray-600 mb-4">{news.excerpt}</p>
                    <Link
                      to={`/noticias/${news.id}`}
                      className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium group-hover:translate-x-1 transition-transform"
                    >
                      Ler mais
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Link to="/noticias" className="btn-secondary text-lg px-8 py-4">
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
