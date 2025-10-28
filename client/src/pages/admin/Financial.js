import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import { 
  DollarSign, TrendingUp, TrendingDown, PiggyBank, 
  Calendar, Plus, Filter, Download, Eye, Trash2, Edit,
  AlertCircle, CheckCircle, Clock
} from 'lucide-react';

const Financial = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, donations, transactions
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('donation'); // donation or transaction
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Buscar estatísticas financeiras
  const { data: stats } = useQuery(
    ['financial-stats', filters.startDate, filters.endDate],
    () => {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      return api.get(`/financial-stats?${params}`).then(res => res.data);
    }
  );

  // Buscar doações
  const { data: donationsData, isLoading: loadingDonations } = useQuery(
    ['donations', filters, page],
    () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      params.append('page', page);
      params.append('limit', 10);
      return api.get(`/donations?${params}`).then(res => res.data);
    },
    { enabled: activeTab === 'donations' }
  );

  // Buscar transações
  const { data: transactionsData, isLoading: loadingTransactions } = useQuery(
    ['transactions', filters, page],
    () => {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('page', page);
      params.append('limit', 10);
      return api.get(`/financial-transactions?${params}`).then(res => res.data);
    },
    { enabled: activeTab === 'transactions' }
  );

  const deleteDonation = useMutation(
    (id) => api.delete(`/donations/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('donations');
        queryClient.invalidateQueries('financial-stats');
        alert('Doação removida com sucesso!');
      },
      onError: (error) => {
        alert('Erro ao remover doação: ' + (error.response?.data?.error || error.message));
      }
    }
  );

  const deleteTransaction = useMutation(
    (id) => api.delete(`/financial-transactions/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('transactions');
        queryClient.invalidateQueries('financial-stats');
        alert('Transação removida com sucesso!');
      },
      onError: (error) => {
        alert('Erro ao remover transação: ' + (error.response?.data?.error || error.message));
      }
    }
  );

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmado': return <CheckCircle className="h-4 w-4" />;
      case 'pendente': return <Clock className="h-4 w-4" />;
      case 'cancelado': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2">💰 Gestão Financeira</h1>
            <p className="text-green-100">
              Controle completo de doações, receitas e despesas da ACAPRA
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Doações</h3>
              <PiggyBank className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              R$ {stats?.doacoes || '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.totalDoacoes || 0} doações confirmadas
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Receitas</h3>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              R$ {stats?.receitas || '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Total de entradas
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Despesas</h3>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              R$ {stats?.despesas || '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Total de saídas
            </p>
          </div>

          <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
            parseFloat(stats?.saldo || 0) >= 0 ? 'border-purple-500' : 'border-orange-500'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Saldo</h3>
              <DollarSign className={`h-8 w-8 ${
                parseFloat(stats?.saldo || 0) >= 0 ? 'text-purple-500' : 'text-orange-500'
              }`} />
            </div>
            <p className={`text-2xl font-bold ${
              parseFloat(stats?.saldo || 0) >= 0 ? 'text-purple-600' : 'text-orange-600'
            }`}>
              R$ {stats?.saldo || '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Receitas - Despesas
            </p>
          </div>
        </div>

        {/* Filtros e Ações */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="input-field text-sm"
                />
              </div>
              <span className="text-gray-500">até</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="input-field text-sm"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleOpenModal('donation')}
                className="btn-primary flex items-center text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Nova Doação
              </button>
              <button
                onClick={() => handleOpenModal('transaction')}
                className="btn-secondary flex items-center text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Novo Lançamento
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Visão Geral
              </button>
              <button
                onClick={() => setActiveTab('donations')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'donations'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                💝 Doações
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'transactions'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📝 Lançamentos
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📈 Resumo Financeiro
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total de Transações</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats?.totalTransacoes || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Doações Recebidas</p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats?.totalDoacoes || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Taxa de Conversão</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {stats?.totalTransacoes > 0 
                          ? Math.round((stats.totalDoacoes / stats.totalTransacoes) * 100)
                          : 0
                        }%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3">✅ Pontos Positivos</h4>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li>• Sistema de controle financeiro implementado</li>
                      <li>• Rastreamento completo de doações</li>
                      <li>• Relatórios em tempo real</li>
                      <li>• Histórico detalhado de transações</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-3">⚠️ Atenção</h4>
                    <ul className="space-y-2 text-sm text-amber-800">
                      <li>• Confirme todas as doações recebidas</li>
                      <li>• Mantenha os registros atualizados</li>
                      <li>• Verifique o saldo periodicamente</li>
                      <li>• Exporte relatórios mensalmente</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Donations Tab */}
            {activeTab === 'donations' && (
              <div>
                {loadingDonations ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando doações...</p>
                  </div>
                ) : donationsData?.donations?.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doador</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {donationsData.donations.map((donation) => (
                            <tr key={donation.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                                {donation.donorEmail && (
                                  <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-green-600">
                                  R$ {parseFloat(donation.amount).toFixed(2)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900 capitalize">{donation.type}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                                  {getStatusIcon(donation.status)}
                                  <span className="ml-1 capitalize">{donation.status}</span>
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(donation.donatedAt).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleOpenModal('donation', donation)}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="Ver/Editar"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Deseja remover esta doação?')) {
                                        deleteDonation.mutate(donation.id);
                                      }
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                    title="Remover"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <PiggyBank className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma doação registrada</h3>
                    <p className="text-gray-600 mb-4">Comece registrando a primeira doação</p>
                    <button
                      onClick={() => handleOpenModal('donation')}
                      className="btn-primary"
                    >
                      Registrar Doação
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div>
                {loadingTransactions ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando lançamentos...</p>
                  </div>
                ) : transactionsData?.transactions?.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {transactionsData.transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900">{transaction.category}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  transaction.type === 'receita' 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {transaction.type === 'receita' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                  {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm font-bold ${
                                  transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {transaction.type === 'receita' ? '+' : '-'} R$ {parseFloat(transaction.amount).toFixed(2)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(transaction.transactionDate).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleOpenModal('transaction', transaction)}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="Ver/Editar"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Deseja remover este lançamento?')) {
                                        deleteTransaction.mutate(transaction.id);
                                      }
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                    title="Remover"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum lançamento registrado</h3>
                    <p className="text-gray-600 mb-4">Comece registrando o primeiro lançamento</p>
                    <button
                      onClick={() => handleOpenModal('transaction')}
                      className="btn-primary"
                    >
                      Novo Lançamento
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financial;
