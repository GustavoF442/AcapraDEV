import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { DollarSign, Gift, Search, Filter, Download, Plus, X, Eye, Trash2, TrendingUp, PieChart } from 'lucide-react';
import api from '../../services/api';

const DonationsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    donorCPF: '',
    donationType: 'dinheiro',
    amount: '',
    description: '',
    paymentMethod: 'pix',
    status: 'pendente'
  });
  const queryClient = useQueryClient();

  // Buscar doações
  const { data: donations, isLoading } = useQuery('donations', () =>
    api.get('/donations').then(res => res.data.donations || res.data)
  );

  // Buscar estatísticas
  const { data: stats } = useQuery('donations-stats', () =>
    api.get('/donations/stats').then(res => res.data)
  );

  // Criar doação
  const createMutation = useMutation(
    (data) => api.post('/donations', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('donations');
        queryClient.invalidateQueries('donations-stats');
        setShowCreateModal(false);
        resetForm();
        alert('Doação registrada com sucesso!');
      },
      onError: (error) => {
        alert('Erro ao registrar doação: ' + (error.response?.data?.error || error.message));
      }
    }
  );

  // Atualizar status
  const updateMutation = useMutation(
    ({ id, status }) => api.patch(`/donations/${id}`, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('donations');
        queryClient.invalidateQueries('donations-stats');
        setShowModal(false);
      }
    }
  );

  // Deletar doação
  const deleteMutation = useMutation(
    (id) => api.delete(`/donations/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('donations');
        queryClient.invalidateQueries('donations-stats');
      }
    }
  );

  const resetForm = () => {
    setFormData({
      donorName: '',
      donorEmail: '',
      donorPhone: '',
      donorCPF: '',
      donationType: 'dinheiro',
      amount: '',
      description: '',
      paymentMethod: 'pix',
      status: 'pendente'
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const filteredDonations = donations?.filter(donation => {
    const matchesSearch = donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donorEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || donation.status === statusFilter;
    const matchesType = !typeFilter || donation.donationType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    const colors = {
      pendente: 'bg-yellow-100 text-yellow-800',
      confirmado: 'bg-blue-100 text-blue-800',
      recebido: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    return type === 'dinheiro' ? <DollarSign className="w-4 h-4" /> : <Gift className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header com Estatísticas */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Doações</h1>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Doação
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Arrecadado</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {stats?.totalAmount?.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Doações</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.totalDonations || 0}</p>
              </div>
              <Gift className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats?.pendingCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmadas</p>
                <p className="text-2xl font-bold text-green-600">{stats?.confirmedCount || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Doações por Tipo */}
        {stats?.byType && (
          <div className="bg-white p-6 rounded-lg shadow mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Doações por Tipo
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.byType).map(([type, count]) => {
                const colors = {
                  dinheiro: 'bg-green-500',
                  'ração': 'bg-blue-500',
                  medicamentos: 'bg-purple-500',
                  materiais: 'bg-yellow-500',
                  outros: 'bg-gray-500'
                };
                return (
                  <div key={type} className="text-center">
                    <div className={`${colors[type] || 'bg-gray-500'} h-20 rounded-lg flex items-center justify-center text-white font-bold text-2xl mb-2`}>
                      {count}
                    </div>
                    <p className="text-sm text-gray-600 capitalize">{type}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="confirmado">Confirmado</option>
            <option value="recebido">Recebido</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Todos os Tipos</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="ração">Ração</option>
            <option value="medicamentos">Medicamentos</option>
            <option value="materiais">Materiais</option>
            <option value="outros">Outros</option>
          </select>
        </div>
      </div>

      {/* Tabela de Doações */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDonations?.map((donation) => (
              <tr key={donation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                    <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                    {donation.donorPhone && (
                      <div className="text-sm text-gray-500">{donation.donorPhone}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(donation.donationType)}
                    <span className="text-sm text-gray-900 capitalize">{donation.donationType}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {donation.amount ? `R$ ${parseFloat(donation.amount).toFixed(2)}` : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                    {donation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(donation.donationDate || donation.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedDonation(donation);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja deletar esta doação?')) {
                        deleteMutation.mutate(donation.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDonations?.length === 0 && (
          <div className="text-center py-12">
            <Gift className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma doação encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter || typeFilter
                ? 'Tente ajustar os filtros'
                : 'Aguardando primeiras doações'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {showModal && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalhes da Doação</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Doador</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDonation.donorName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDonation.donorEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDonation.donorPhone || '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedDonation.donationType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Valor</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedDonation.amount ? `R$ ${parseFloat(selectedDonation.amount).toFixed(2)}` : '-'}
                    </p>
                  </div>
                </div>

                {selectedDonation.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDonation.description}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Atualizar Status</label>
                  <select
                    defaultValue={selectedDonation.status}
                    onChange={(e) => {
                      if (window.confirm('Deseja atualizar o status desta doação?')) {
                        updateMutation.mutate({
                          id: selectedDonation.id,
                          status: e.target.value
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="recebido">Recebido</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criar Doação */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Registrar Nova Doação</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Doador *</label>
                  <input
                    type="text"
                    required
                    value={formData.donorName}
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.donorEmail}
                      onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                      type="tel"
                      value={formData.donorPhone}
                      onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                    <input
                      type="text"
                      value={formData.donorCPF}
                      onChange={(e) => setFormData({ ...formData, donorCPF: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Doação *</label>
                    <select
                      required
                      value={formData.donationType}
                      onChange={(e) => setFormData({ ...formData, donationType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="dinheiro">Dinheiro</option>
                      <option value="ração">Ração</option>
                      <option value="medicamentos">Medicamentos</option>
                      <option value="materiais">Materiais</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                </div>

                {formData.donationType === 'dinheiro' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pagamento</label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="pix">PIX</option>
                        <option value="cartao">Cartão</option>
                        <option value="boleto">Boleto</option>
                        <option value="transferencia">Transferência</option>
                        <option value="dinheiro">Dinheiro</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Detalhes da doação..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="recebido">Recebido</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {createMutation.isLoading ? 'Registrando...' : 'Registrar Doação'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsManagement;
