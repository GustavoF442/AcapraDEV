import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import { resolveImageUrl } from '../../utils/images';
import {
  Eye, CheckCircle, XCircle, Clock, Mail, Phone, MapPin,
  Home, Heart, User, Calendar, FileText, AlertCircle, X, Filter
} from 'lucide-react';

const AdminAdoptions = () => {
  const [filters, setFilters] = useState({ status: 'all' });
  const [page, setPage] = useState(1);
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['adoptions', filters, page],
    () => {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      params.append('page', page);
      params.append('limit', 15);
      return api.get(`/adoptions?${params}`).then(res => res.data);
    },
    { keepPreviousData: true }
  );

  const updateStatusMutation = useMutation(
    ({ id, status }) => api.patch(`/adoptions/${id}/status`, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adoptions');
        setShowModal(false);
        alert('Status atualizado com sucesso!');
      },
      onError: (error) => {
        alert('Erro ao atualizar: ' + (error.response?.data?.error || error.message));
      }
    }
  );

  const handleUpdateStatus = (newStatus) => {
    if (!selectedAdoption) return;
    const names = {
      'aprovado': 'APROVAR',
      'rejeitado': 'REJEITAR',
      'em_analise': 'COLOCAR EM ANÁLISE',
      'cancelado': 'CANCELAR'
    };
    if (window.confirm(`Confirmar ${names[newStatus]} esta solicitação?`)) {
      updateStatusMutation.mutate({ id: selectedAdoption.id, status: newStatus });
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'pendente': 'bg-yellow-100 text-yellow-800',
      'em_analise': 'bg-blue-100 text-blue-800',
      'aprovado': 'bg-green-100 text-green-800',
      'rejeitado': 'bg-red-100 text-red-800',
      'cancelado': 'bg-gray-100 text-gray-800'
    };
    const icons = {
      'pendente': Clock,
      'em_analise': AlertCircle,
      'aprovado': CheckCircle,
      'rejeitado': XCircle,
      'cancelado': X
    };
    const Icon = icons[status] || Clock;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status?.replace('_', ' ') || 'pendente'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2">💝 Solicitações de Adoção</h1>
            <p className="text-primary-100">Gerencie e aprove pedidos de adoção</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <label className="font-medium text-gray-700">Status:</label>
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input-field"
            >
              <option value="all">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="em_analise">Em Análise</option>
              <option value="aprovado">Aprovado</option>
              <option value="rejeitado">Rejeitado</option>
            </select>
            <div className="ml-auto text-sm text-gray-600">
              {data?.pagination?.total || 0} solicitações encontradas
            </div>
          </div>
        </div>

        {/* Tabela */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando solicitações...</p>
          </div>
        ) : data?.adoptions?.length > 0 ? (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Animal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adotante</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.adoptions.map((adoption) => (
                      <tr key={adoption.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {adoption.animal?.photos?.[0] ? (
                              <img
                                src={resolveImageUrl(adoption.animal.photos[0])}
                                alt={adoption.animal.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <Heart className="h-5 w-5 text-primary-600" />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {adoption.animal?.name || 'Animal não encontrado'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {adoption.animal?.species} • {adoption.animal?.age}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{adoption.adopterName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{adoption.adopterEmail}</div>
                          <div className="text-sm text-gray-500">{adoption.adopterPhone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(adoption.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(adoption.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedAdoption(adoption);
                              setShowModal(true);
                            }}
                            className="text-primary-600 hover:text-primary-900 flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginação */}
            {data?.pagination?.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Página {page} de {data.pagination.pages}
                  </span>
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
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-gray-600">Não há solicitações de adoção para exibir</p>
          </div>
        )}
      </div>

      {/* Modal Detalhado */}
      {showModal && selectedAdoption && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setShowModal(false)}>
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white mb-10" onClick={(e) => e.stopPropagation()}>
            {/* Header do Modal */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h3 className="text-2xl font-bold text-gray-900">Detalhes da Solicitação #{selectedAdoption.id}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coluna Esquerda - Animal e Adotante */}
              <div className="space-y-6">
                {/* Info do Animal */}
                <div className="bg-primary-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-4 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-primary-600" />
                    Animal
                  </h4>
                  {selectedAdoption.animal ? (
                    <div className="flex items-start space-x-4">
                      {selectedAdoption.animal.photos?.[0] ? (
                        <img
                          src={resolveImageUrl(selectedAdoption.animal.photos[0])}
                          alt={selectedAdoption.animal.name}
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-lg bg-primary-200 flex items-center justify-center">
                          <Heart className="h-12 w-12 text-primary-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-xl">{selectedAdoption.animal.name}</p>
                        <p className="text-gray-700">{selectedAdoption.animal.species} - {selectedAdoption.animal.breed}</p>
                        <p className="text-gray-600 text-sm">{selectedAdoption.animal.age} • {selectedAdoption.animal.size}</p>
                        <p className="text-sm text-gray-500 mt-1">Status: {selectedAdoption.animal.status}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-600">Animal não encontrado</p>
                  )}
                </div>

                {/* Info do Adotante */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-gray-600" />
                    Adotante
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Nome:</p>
                      <p className="font-medium">{selectedAdoption.adopterName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 flex items-center"><Mail className="h-3 w-3 mr-1" /> Email:</p>
                        <p className="text-sm">{selectedAdoption.adopterEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 flex items-center"><Phone className="h-3 w-3 mr-1" /> Telefone:</p>
                        <p className="text-sm">{selectedAdoption.adopterPhone}</p>
                      </div>
                    </div>
                    {selectedAdoption.adopterCpf && (
                      <div>
                        <p className="text-sm text-gray-500">CPF:</p>
                        <p className="text-sm">{selectedAdoption.adopterCpf}</p>
                      </div>
                    )}
                    {selectedAdoption.adopterAddress && (
                      <div>
                        <p className="text-sm text-gray-500 flex items-center"><MapPin className="h-3 w-3 mr-1" /> Endereço:</p>
                        <p className="text-sm">{selectedAdoption.adopterAddress}</p>
                        {(selectedAdoption.adopterCity || selectedAdoption.adopterState) && (
                          <p className="text-sm text-gray-600">{selectedAdoption.adopterCity} - {selectedAdoption.adopterState}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status e Data */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Status da Solicitação
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Status Atual:</p>
                      {getStatusBadge(selectedAdoption.status)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data da Solicitação:</p>
                      <p className="text-sm font-medium">{new Date(selectedAdoption.createdAt).toLocaleString('pt-BR')}</p>
                    </div>
                    {selectedAdoption.reviewedAt && (
                      <div>
                        <p className="text-sm text-gray-500">Data da Revisão:</p>
                        <p className="text-sm font-medium">{new Date(selectedAdoption.reviewedAt).toLocaleString('pt-BR')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Coluna Direita - Questionário */}
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-4 flex items-center">
                    <Home className="h-5 w-5 mr-2 text-green-600" />
                    Informações de Moradia
                  </h4>
                  <div className="space-y-3 text-sm">
                    {selectedAdoption.housingType && (
                      <div>
                        <p className="text-gray-500">Tipo de Moradia:</p>
                        <p className="font-medium capitalize">{selectedAdoption.housingType}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500">Tem Quintal:</p>
                        <p className="font-medium">{selectedAdoption.hasYard ? '✅ Sim' : '❌ Não'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Moradia Alugada:</p>
                        <p className="font-medium">{selectedAdoption.isRented ? '✅ Sim' : '❌ Não'}</p>
                      </div>
                    </div>
                    {selectedAdoption.isRented && (
                      <div>
                        <p className="text-gray-500">Proprietário Permite:</p>
                        <p className="font-medium">{selectedAdoption.ownerConsent ? '✅ Sim' : '❌ Não'}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-4 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-purple-600" />
                    Experiência com Pets
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">Já teve pets antes:</p>
                      <p className="font-medium">{selectedAdoption.hadPetsBefore ? '✅ Sim' : '❌ Não'}</p>
                    </div>
                    {selectedAdoption.currentPets && (
                      <div>
                        <p className="text-gray-500">Pets Atuais:</p>
                        <p className="font-medium">{selectedAdoption.currentPets}</p>
                      </div>
                    )}
                    {selectedAdoption.petCareExperience && (
                      <div>
                        <p className="text-gray-500">Experiência:</p>
                        <p className="font-medium">{selectedAdoption.petCareExperience}</p>
                      </div>
                    )}
                    {selectedAdoption.hasVet && (
                      <div>
                        <p className="text-gray-500">Tem Veterinário:</p>
                        <p className="font-medium">✅ Sim</p>
                        {selectedAdoption.vetInfo && <p className="text-xs text-gray-600 mt-1">{selectedAdoption.vetInfo}</p>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-amber-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-amber-600" />
                    Motivação e Compromisso
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">Motivação para Adotar:</p>
                      <p className="font-medium">{selectedAdoption.motivation}</p>
                    </div>
                    {selectedAdoption.timeForPet && (
                      <div>
                        <p className="text-gray-500">Tempo Disponível:</p>
                        <p className="font-medium">{selectedAdoption.timeForPet}</p>
                      </div>
                    )}
                    {selectedAdoption.whoWillCare && (
                      <div>
                        <p className="text-gray-500">Quem Cuidará:</p>
                        <p className="font-medium">{selectedAdoption.whoWillCare}</p>
                      </div>
                    )}
                    {selectedAdoption.emergencyPlan && (
                      <div>
                        <p className="text-gray-500">Plano de Emergência:</p>
                        <p className="font-medium">{selectedAdoption.emergencyPlan}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ações do Modal */}
            {selectedAdoption.status !== 'aprovado' && selectedAdoption.status !== 'rejeitado' && (
              <div className="flex space-x-3 pt-6 mt-6 border-t">
                <button
                  onClick={() => handleUpdateStatus('aprovado')}
                  className="flex-1 bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 flex items-center justify-center font-medium"
                  disabled={updateStatusMutation.isLoading}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Aprovar Adoção
                </button>
                <button
                  onClick={() => handleUpdateStatus('em_analise')}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 flex items-center justify-center font-medium"
                  disabled={updateStatusMutation.isLoading}
                >
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Colocar em Análise
                </button>
                <button
                  onClick={() => handleUpdateStatus('rejeitado')}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 flex items-center justify-center font-medium"
                  disabled={updateStatusMutation.isLoading}
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Rejeitar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdoptions;
