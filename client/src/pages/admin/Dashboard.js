import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, Heart, FileText, Mail, Shield } from 'lucide-react';

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery('adminStats', () =>
    axios.get('/api/stats/admin').then(res => res.data)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: 'Solicitações Pendentes',
      value: stats?.dashboard?.pendingAdoptions || 0,
      icon: AlertIcon, // ícone simples abaixo
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      link: '/admin/adocoes?status=pendente'
    },
    {
      title: 'Em Análise',
      value: stats?.dashboard?.adoptionsInReview || 0,
      icon: Users,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      link: '/admin/adocoes?status=em análise'
    },
    {
      title: 'Contatos Não Lidos',
      value: stats?.dashboard?.unreadContacts || 0,
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/admin/contatos?status=novo'
    },
    {
      title: 'Notícias Publicadas',
      value: stats?.dashboard?.publishedNews || 0,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/admin/noticias'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="mt-1 text-sm text-gray-600">
              Visão geral das atividades da ACAPRA
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${card.bgColor} rounded-md p-3`}>
                      <card.icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {card.title}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {card.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Atividades Recentes - Adoções */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Solicitações de Adoção Recentes
              </h3>
            </div>
            <div className="p-6">
              {(stats?.recentActivity?.adoptions ?? []).length > 0 ? (
                <div className="space-y-4">
                  {(stats?.recentActivity?.adoptions ?? []).map((adoption) => (
                    <div key={adoption.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Heart className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {adoption?.animal?.name ?? 'Animal não encontrado'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {adoption?.createdAt
                            ? new Date(adoption.createdAt).toLocaleDateString('pt-BR')
                            : '—'}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            adoption?.status === 'pendente'
                              ? 'bg-red-100 text-red-800'
                              : adoption?.status === 'em análise'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {adoption?.status ?? '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Nenhuma solicitação recente
                </p>
              )}
              <div className="mt-6">
                <Link
                  to="/admin/adocoes"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Ver todas as solicitações →
                </Link>
              </div>
            </div>
          </div>

          {/* Atividades Recentes - Contatos */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Contatos Recentes
              </h3>
            </div>
            <div className="p-6">
              {(stats?.recentActivity?.contacts ?? []).length > 0 ? (
                <div className="space-y-4">
                  {(stats?.recentActivity?.contacts ?? []).map((contact) => (
                    <div key={contact.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Mail className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {contact?.name ?? '—'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {contact?.subject ?? '—'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {contact?.createdAt
                            ? new Date(contact.createdAt).toLocaleDateString('pt-BR')
                            : '—'}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            contact?.status === 'novo'
                              ? 'bg-red-100 text-red-800'
                              : contact?.status === 'lido'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {contact?.status ?? '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Nenhum contato recente
                </p>
              )}
              <div className="mt-6">
                <Link
                  to="/admin/contatos"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Ver todos os contatos →
                </Link>
              </div>
            </div>
          </div>

          {/* Animais Recentes */}
          <div className="bg-white shadow rounded-lg lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Animais Cadastrados Recentemente
              </h3>
            </div>
            <div className="p-6">
              {(stats?.recentActivity?.animals ?? []).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(stats?.recentActivity?.animals ?? []).map((animal) => (
                    <div key={animal.id} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <Heart className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {animal?.name ?? '—'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(animal?.species ?? '—')} • {(animal?.age ?? '—')}
                          </p>
                          <p className="text-xs text-gray-400">
                            {animal?.createdAt
                              ? new Date(animal.createdAt).toLocaleDateString('pt-BR')
                              : '—'}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              animal?.status === 'disponível'
                                ? 'bg-green-100 text-green-800'
                                : animal?.status === 'em processo'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {animal?.status ?? '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Nenhum animal cadastrado recentemente
                </p>
              )}
              <div className="mt-6">
                <Link
                  to="/admin/animais"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Ver todos os animais →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <Link
              to="/admin/animais/novo"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <Heart className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Cadastrar Animal</h4>
              <p className="text-sm text-gray-600 mt-1">Adicionar novo animal</p>
            </Link>

            <Link
              to="/admin/noticias/nova"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <FileText className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Nova Notícia</h4>
              <p className="text-sm text-gray-600 mt-1">Publicar notícia</p>
            </Link>

            <Link
              to="/admin/adocoes"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Adoções</h4>
              <p className="text-sm text-gray-600 mt-1">Gerenciar solicitações</p>
            </Link>

            <Link
              to="/admin/contatos"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <Mail className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Contatos</h4>
              <p className="text-sm text-gray-600 mt-1">Responder mensagens</p>
            </Link>

            <Link
              to="/admin/usuarios"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <Shield className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Colaboradores</h4>
              <p className="text-sm text-gray-600 mt-1">Gerenciar usuários</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ícone simples para “pendente”
function AlertIcon(props) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} width="1em" height="1em" fill="currentColor">
      <path d="M12 2 1 21h22L12 2zm1 15h-2v2h2v-2zm0-8h-2v6h2V9z"/>
    </svg>
  );
}

export default Dashboard;
