import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Scissors, Plus, X, Eye, Trash2, BarChart3, Calendar } from 'lucide-react';
import api from '../../services/api';
import MaskedInput from '../../components/MaskedInput';

const CastrationsManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedCastration, setSelectedCastration] = useState(null);
  const [formData, setFormData] = useState({
    animalName: '',
    animalSpecies: 'cão',
    animalBreed: '',
    animalAge: '',
    animalGender: 'macho',
    animalWeight: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerCPF: '',
    ownerAddress: '',
    ownerCity: '',
    ownerState: '',
    castrationDate: '',
    veterinarianName: '',
    clinic: '',
    observations: '',
    eventId: '',
    status: 'agendado'
  });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery('castrations', () =>
    api.get('/api/castrations').then(res => res.data)
  );

  const { data: events } = useQuery('events', () =>
    api.get('/api/events').then(res => res.data.events || [])
  );

  const { data: stats } = useQuery('castrations-stats', () =>
    api.get('/api/castrations/stats').then(res => res.data.stats)
  );

  const { data: report } = useQuery('castrations-report', () =>
    api.get('/api/castrations/report/by-event').then(res => res.data.report)
  );

  const createMutation = useMutation(
    (data) => api.post('/api/castrations', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('castrations');
        queryClient.invalidateQueries('castrations-stats');
        queryClient.invalidateQueries('castrations-report');
        setShowModal(false);
        resetForm();
        alert('Castração registrada com sucesso!');
      }
    }
  );

  const deleteMutation = useMutation(
    (id) => api.delete(`/api/castrations/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('castrations');
        queryClient.invalidateQueries('castrations-stats');
        alert('Castração removida com sucesso!');
      }
    }
  );

  const resetForm = () => {
    setFormData({
      animalName: '', animalSpecies: 'cão', animalBreed: '', animalAge: '', animalGender: 'macho',
      animalWeight: '', ownerName: '', ownerEmail: '', ownerPhone: '', ownerCPF: '',
      ownerAddress: '', ownerCity: '', ownerState: '', castrationDate: '',
      veterinarianName: '', clinic: '', observations: '', eventId: '', status: 'agendado'
    });
    setSelectedCastration(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Scissors className="h-8 w-8 mr-3 text-green-600" />
              Gestão de Castrações
            </h1>
            <p className="text-gray-600 mt-2">Registre e acompanhe as castrações realizadas</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowReportModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Relatórios
            </button>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nova Castração
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500 text-sm">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500 text-sm">Realizadas</p>
              <p className="text-3xl font-bold text-green-600">{stats.realized}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500 text-sm">Agendadas</p>
              <p className="text-3xl font-bold text-blue-600">{stats.scheduled}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500 text-sm">Com Evento</p>
              <p className="text-3xl font-bold text-purple-600">{stats.withEvent}</p>
            </div>
          </div>
        )}

        {/* Lista */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Animal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.castrations?.map((c) => (
                <tr key={c.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{c.animalName}</div>
                    <div className="text-sm text-gray-500">{c.animalSpecies} - {c.animalBreed}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{c.ownerName}</div>
                    <div className="text-xs text-gray-500">{c.ownerPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(c.castrationDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      c.status === 'realizado' ? 'bg-green-100 text-green-800' :
                      c.status === 'agendado' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => { setSelectedCastration(c); setShowModal(true); }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => window.confirm('Remover?') && deleteMutation.mutate(c.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de Formulário */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 shadow-lg rounded-md bg-white mb-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  {selectedCastration ? 'Detalhes da Castração' : 'Nova Castração'}
                </h3>
                <button onClick={() => { setShowModal(false); resetForm(); }}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados do Animal */}
                <div>
                  <h4 className="font-semibold text-lg mb-3">Dados do Animal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Nome do Animal *"
                      value={formData.animalName}
                      onChange={(e) => setFormData({...formData, animalName: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <select
                      value={formData.animalSpecies}
                      onChange={(e) => setFormData({...formData, animalSpecies: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="cão">Cão</option>
                      <option value="gato">Gato</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Raça"
                      value={formData.animalBreed}
                      onChange={(e) => setFormData({...formData, animalBreed: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <select
                      value={formData.animalGender}
                      onChange={(e) => setFormData({...formData, animalGender: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="macho">Macho</option>
                      <option value="fêmea">Fêmea</option>
                    </select>
                  </div>
                </div>

                {/* Dados do Dono */}
                <div>
                  <h4 className="font-semibold text-lg mb-3">Dados do Responsável</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Nome do Dono *"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <MaskedInput
                      type="phone"
                      required
                      placeholder="Telefone *"
                      value={formData.ownerPhone}
                      onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})}
                      className="w-full"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <MaskedInput
                      type="cpf"
                      placeholder="CPF"
                      value={formData.ownerCPF}
                      onChange={(e) => setFormData({...formData, ownerCPF: e.target.value})}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Dados da Castração */}
                <div>
                  <h4 className="font-semibold text-lg mb-3">Dados da Castração</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="date"
                      required
                      value={formData.castrationDate}
                      onChange={(e) => setFormData({...formData, castrationDate: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="agendado">Agendado</option>
                      <option value="realizado">Realizado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Veterinário"
                      value={formData.veterinarianName}
                      onChange={(e) => setFormData({...formData, veterinarianName: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <select
                      value={formData.eventId}
                      onChange={(e) => setFormData({...formData, eventId: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">Sem evento vinculado</option>
                      {events?.map(event => (
                        <option key={event.id} value={event.id}>{event.title}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    placeholder="Observações"
                    value={formData.observations}
                    onChange={(e) => setFormData({...formData, observations: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg mt-4"
                    rows="3"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 px-4 py-2 border rounded-lg">
                    Cancelar
                  </button>
                  <button type="submit" disabled={createMutation.isLoading} className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    {createMutation.isLoading ? 'Salvando...' : 'Salvar Castração'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Relatórios */}
        {showReportModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 shadow-lg rounded-md bg-white mb-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Relatório por Evento</h3>
                <button onClick={() => setShowReportModal(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                {report?.map((r, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-bold text-lg">{r.event?.title}</h4>
                    <p className="text-sm text-gray-600">Data: {new Date(r.event?.eventDate).toLocaleDateString('pt-BR')}</p>
                    <div className="grid grid-cols-4 gap-4 mt-3">
                      <div><span className="text-gray-600">Total:</span> <span className="font-bold">{r.total}</span></div>
                      <div><span className="text-gray-600">Realizadas:</span> <span className="font-bold text-green-600">{r.realized}</span></div>
                      <div><span className="text-gray-600">Agendadas:</span> <span className="font-bold text-blue-600">{r.scheduled}</span></div>
                      <div><span className="text-gray-600">Canceladas:</span> <span className="font-bold text-red-600">{r.cancelled}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CastrationsManagement;
