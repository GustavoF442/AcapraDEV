import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import { Eye, Mail, Phone, User, Calendar, MessageSquare } from 'lucide-react';

const AdminContacts = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [filters, setFilters] = useState({ status: '' });
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['contacts', filters, page],
    () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      params.append('page', page);
      params.append('limit', 10);
      
      return api.get(`/contact?${params}`).then(res => res.data);
    },
    { keepPreviousData: true }
  );

  const respondMutation = useMutation(
    ({ id, response, sendEmail }) => api.patch(`/contact/${id}/respond`, { response, sendEmail }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('contacts');
        setShowResponseModal(false);
        setResponseText('');
        setSendEmail(true);
        setSelectedContact(null);
        alert(data.data.message || 'Resposta registrada com sucesso!');
      },
      onError: (error) => {
        console.error('Erro ao registrar resposta:', error);
        alert('Erro ao registrar resposta: ' + (error.response?.data?.error || error.message));
      }
    }
  );

  const handleOpenResponseModal = (contact) => {
    const contactId = contact.id || contact._id;
    if (!contactId) {
      alert('Erro: ID do contato não encontrado');
      console.error('Contact object:', contact);
      return;
    }
    setSelectedContact(contact);
    setResponseText('');
    setSendEmail(true);
    setShowResponseModal(true);
  };

  const handleSubmitResponse = () => {
    if (!responseText.trim()) {
      alert('Por favor, digite uma resposta válida');
      return;
    }
    
    const contactId = selectedContact.id || selectedContact._id;
    respondMutation.mutate({
      id: contactId,
      response: responseText.trim(),
      sendEmail
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'novo': return 'bg-red-100 text-red-800';
      case 'lido': return 'bg-yellow-100 text-yellow-800';
      case 'respondido': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Mensagens de Contato</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gerencie as mensagens recebidas através do formulário de contato
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex space-x-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="input-field"
            >
              <option value="">Todos os status</option>
              <option value="novo">Novo</option>
              <option value="lido">Lido</option>
              <option value="respondido">Respondido</option>
            </select>
          </div>
        </div>

        {/* Lista de Contatos */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando mensagens...</p>
          </div>
        ) : data?.contacts?.length > 0 ? (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remetente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assunto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.contacts.map((contact) => (
                      <tr key={contact.id || contact._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {contact.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {contact.email}
                              </div>
                              {contact.phone && (
                                <div className="text-sm text-gray-500">
                                  {contact.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {contact.subject}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {contact.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(contact.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
                            {contact.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedContact(contact)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Ver detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {contact.status !== 'respondido' && (
                              <button
                                onClick={() => handleOpenResponseModal(contact)}
                                className="text-green-600 hover:text-green-900"
                                title="Responder"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginação */}
            {data.pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  
                  {[...Array(Math.min(5, data.pagination.pages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 border rounded-md ${
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
                    className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma mensagem encontrada
            </h3>
            <p className="text-gray-600">
              As mensagens de contato aparecerão aqui quando forem enviadas
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedContact && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalhes da Mensagem
                </h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Dados do Remetente */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Dados do Remetente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedContact.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedContact.email}</span>
                    </div>
                    {selectedContact.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedContact.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {new Date(selectedContact.createdAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assunto */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Assunto</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedContact.subject}
                  </p>
                </div>

                {/* Mensagem */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Mensagem</h4>
                  <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {selectedContact.message}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedContact.status)}`}>
                    {selectedContact.status}
                  </span>
                </div>

                {/* Resposta (se houver) */}
                {selectedContact.response && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Resposta</h4>
                    <div className="text-sm text-gray-700 bg-blue-50 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedContact.response}</p>
                      <div className="mt-2 pt-2 border-t border-blue-200 text-xs text-blue-600">
                        Respondido por {selectedContact.respondedBy?.name} em{' '}
                        {new Date(selectedContact.respondedAt).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Ações */}
                {selectedContact.status !== 'respondido' && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        setShowResponseModal(true);
                        setResponseText('');
                      }}
                      className="btn-primary flex-1"
                    >
                      Registrar Resposta
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Resposta */}
      {showResponseModal && selectedContact && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Registrar Resposta - {selectedContact.name}
                </h3>
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponseText('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Info do Contato */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Email:</span> {selectedContact.email}
                    </div>
                    {selectedContact.phone && (
                      <div>
                        <span className="font-medium">Telefone:</span> {selectedContact.phone}
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="font-medium text-sm">Assunto:</span>
                    <p className="text-sm text-gray-700 mt-1">{selectedContact.subject}</p>
                  </div>
                  <div className="mt-2">
                    <span className="font-medium text-sm">Mensagem:</span>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                {/* Textarea para Resposta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sua Resposta *
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows="6"
                    className="input-field resize-none"
                    placeholder="Digite sua resposta aqui..."
                  />
                </div>

                {/* Opção de enviar por email */}
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="sendEmail"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sendEmail" className="flex-1">
                    <span className="block text-sm font-medium text-gray-900">
                      📧 Enviar resposta por email automaticamente
                    </span>
                    <span className="block text-xs text-gray-600 mt-1">
                      Se marcado, um email com sua resposta será enviado automaticamente para {selectedContact.email}
                    </span>
                  </label>
                </div>

                {/* Botões */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowResponseModal(false);
                      setResponseText('');
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmitResponse}
                    disabled={!responseText.trim() || respondMutation.isLoading}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {respondMutation.isLoading ? 'Salvando...' : 'Salvar Resposta'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
