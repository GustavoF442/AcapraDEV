import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Calendar, MapPin, Users, Plus, X, Eye, Edit2, Trash2, Send } from 'lucide-react';
import api from '../../services/api';

const EventsManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'adocao',
    eventDate: '',
    eventTime: '',
    location: '',
    maxParticipants: '',
    isPublic: true,
    status: 'planejado'
  });
  const queryClient = useQueryClient();

  // Buscar eventos
  const { data: events, isLoading } = useQuery('events', () =>
    api.get('/events').then(res => res.data.events || res.data)
  );

  // Criar evento
  const createMutation = useMutation(
    (data) => api.post('/events', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
        setShowModal(false);
        resetForm();
      }
    }
  );

  // Atualizar evento
  const updateMutation = useMutation(
    ({ id, ...data }) => api.patch(`/events/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
        setShowModal(false);
        setIsEditing(false);
        resetForm();
      }
    }
  );

  // Deletar evento
  const deleteMutation = useMutation(
    (id) => api.delete(`/events/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
      }
    }
  );

  // Enviar lembretes
  const sendReminderMutation = useMutation(
    (id) => api.post(`/events/${id}/send-reminder`),
    {
      onSuccess: () => {
        alert('Lembretes enviados com sucesso!');
      }
    }
  );

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eventType: 'adocao',
      eventDate: '',
      eventTime: '',
      location: '',
      maxParticipants: '',
      isPublic: true,
      status: 'planejado'
    });
    setSelectedEvent(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && selectedEvent) {
      updateMutation.mutate({ id: selectedEvent.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      eventType: event.eventType,
      eventDate: event.eventDate,
      eventTime: event.eventTime || '',
      location: event.location || '',
      maxParticipants: event.maxParticipants || '',
      isPublic: event.isPublic,
      status: event.status
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      planejado: 'bg-blue-100 text-blue-800',
      confirmado: 'bg-green-100 text-green-800',
      em_andamento: 'bg-yellow-100 text-yellow-800',
      concluido: 'bg-gray-100 text-gray-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type) => {
    const labels = {
      adocao: 'Feira de Adoção',
      campanha: 'Campanha',
      palestra: 'Palestra',
      feira: 'Feira',
      arrecadacao: 'Arrecadação',
      outro: 'Outro'
    };
    return labels[type] || type;
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
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Eventos</h1>
        <button
          onClick={() => {
            resetForm();
            setIsEditing(false);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Evento
        </button>
      </div>

      {/* Grid de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(event.eventDate).toLocaleDateString('pt-BR')}
                  {event.eventTime && ` às ${event.eventTime}`}
                </div>

                {event.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                )}

                {event.maxParticipants && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {event.currentParticipants || 0} / {event.maxParticipants} participantes
                  </div>
                )}
              </div>

              <div className="mb-4">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {getTypeLabel(event.eventType)}
                </span>
                {event.isPublic && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-2">
                    Público
                  </span>
                )}
              </div>

              {event.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                
                <button
                  onClick={() => {
                    if (window.confirm('Deseja enviar lembretes para este evento?')) {
                      sendReminderMutation.mutate(event.id);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={sendReminderMutation.isLoading}
                >
                  <Send className="w-4 h-4" />
                  Lembrete
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Tem certeza que deseja deletar este evento?')) {
                      deleteMutation.mutate(event.id);
                    }
                  }}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum evento cadastrado</h3>
          <p className="mt-1 text-sm text-gray-500">Comece criando um novo evento</p>
        </div>
      )}

      {/* Modal de Criar/Editar Evento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Editar Evento' : 'Novo Evento'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                    <select
                      required
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="adocao">Feira de Adoção</option>
                      <option value="campanha">Campanha</option>
                      <option value="palestra">Palestra</option>
                      <option value="feira">Feira</option>
                      <option value="arrecadacao">Arrecadação</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="planejado">Planejado</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                    <input
                      type="date"
                      required
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                    <input
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Parque Municipal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade Máxima</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0 = ilimitado"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                    Evento público (visível no site)
                  </label>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {isEditing ? 'Atualizar' : 'Criar'} Evento
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

export default EventsManagement;
