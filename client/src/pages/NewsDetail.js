import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, User, Eye, ArrowLeft, Share2 } from 'lucide-react';

const NewsDetail = () => {
  const { id } = useParams();

  const { data: article, isLoading, error } = useQuery(
    ['news', id],
    () => api.get(`/news/${id}`).then(res => res.data),
    { enabled: !!id }
  );

  // Incrementar visualizações quando a página carregar
  useEffect(() => {
    if (id) {
      api.patch(`/news/${id}/view`).catch(() => {});
    }
  }, [id]);

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Notícia não encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            A notícia que você está procurando não existe ou foi removida.
          </p>
          <Link to="/noticias" className="btn-primary">
            Voltar às Notícias
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Botão Voltar */}
        <div className="mb-8">
          <Link
            to="/noticias"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar às notícias
          </Link>
        </div>

        {/* Artigo */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Imagem */}
          {article.image && (
            <div className="w-full h-64 md:h-96">
              <img
                src={typeof article.image === 'string' ? article.image : (article.image.url || article.image.path || `/uploads/${article.image.path}`)}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="p-8">
            {/* Cabeçalho */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{article.author?.name || 'ACAPRA'}</span>
                  </div>

                  {article.views > 0 && (
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>{article.views} visualizações</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={shareArticle}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="prose prose-lg max-w-none">
              {article.content && typeof article.content === 'string' ? (
                article.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="mb-4 text-gray-700 leading-relaxed">
                  {article.content || 'Conteúdo não disponível'}
                </p>
              )}
            </div>

            {/* Tags */}
            {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Quer fazer parte desta causa?
          </h2>
          <p className="text-lg mb-6">
            Conheça nossos animais disponíveis para adoção ou saiba como ajudar de outras formas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/animais" className="btn-secondary">
              Ver Animais
            </Link>
            <Link to="/doacoes" className="btn-outline-white">
              Como Ajudar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
