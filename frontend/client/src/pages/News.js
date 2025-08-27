import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, Eye, Search, ArrowRight } from 'lucide-react';

const News = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery(
    ['news', search, page],
    () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('page', page);
      params.append('limit', 9);
      
      return axios.get(`/api/news?${params}`).then(res => res.data);
    },
    { keepPreviousData: true }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Notícias
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Fique por dentro das novidades, eventos e histórias inspiradoras da ACAPRA
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Busca */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar notícias..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>

        {/* Lista de Notícias */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="bg-gray-300 h-48 w-full"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : data?.news?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.news.map((article) => (
                <article key={article._id} className="card hover:shadow-lg transition-shadow group">
                  <div className="relative overflow-hidden">
                    {article.image ? (
                      <img
                        src={`/uploads/${article.image.path}`}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <span className="text-primary-600 font-medium">ACAPRA</span>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <div className="flex items-center space-x-2 text-white text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {article.title}
                    </h2>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>{article.author?.name || 'ACAPRA'}</span>
                      </div>
                      
                      {article.views > 0 && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Eye className="h-4 w-4" />
                          <span>{article.views}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Link
                        to={`/noticias/${article._id}`}
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Ler matéria completa
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Paginação */}
            {data.pagination.pages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  
                  {[...Array(Math.min(5, data.pagination.pages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 border rounded-md ${
                          page === pageNum
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === data.pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma notícia encontrada
            </h3>
            <p className="text-gray-600">
              {search ? 'Tente buscar por outros termos' : 'Ainda não temos notícias publicadas'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
