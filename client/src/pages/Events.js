import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Calendar, MapPin, Users, Clock, Filter } from 'lucide-react';
import api from '../services/api';
import EventCalendar from '../components/EventCalendar';

const Events = () => {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [typeFilter, setTypeFilter] = useState('');

  const { data: events, isLoading } = useQuery('publicEvents', () =>
    api.get('/events?upcoming=true').then(res => res.data.events || res.data)
  );

  const filteredEvents = events?.filter(event => 
    !typeFilter || event.eventType === typeFilter
  ) || [];

  const getTypeColor = (type) => {
    const colors = {
      'adocao': 'bg-pink-100 text-pink-800',
      'campanha': 'bg-blue-100 text-blue-800',
      'palestra': 'bg-purple-100 text-purple-800',
      'arrecadacao': 'bg-green-100 text-green-800',
      'outro': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.outro;
  };

  const getTypeLabel = (type) => {
    const labels = {
      'adocao': 'Feira de Adoção',
      'campanha': 'Campanha',
      'palestra': 'Palestra',
      'arrecadacao': 'Arrecadação',
      'outro': 'Outro'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="text-white py-16" style={{background: 'linear-gradient(to right, #555086, #6d6598)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Eventos ACAPRA</h1>
            <p className="text-xl max-w-2xl mx-auto" style={{color: '#e8e6f0'}}>
              Participe dos nossos eventos e ajude a fazer a diferença na vida dos animais!
            </p>
          </div>
        </div>
      </section>

      {/* Filtros e Visualização */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Filtro por tipo */}
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-600" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{focusRingColor: '#555086'}}
            >
              <option value="">Todos os Tipos</option>
              <option value="adocao">Feira de Adoção</option>
              <option value="campanha">Campanha</option>
              <option value="palestra">Palestra</option>
              <option value="arrecadacao">Arrecadação</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          {/* Toggle de visualização */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              style={viewMode === 'calendar' ? {backgroundColor: '#555086'} : {}}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Calendário
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              style={viewMode === 'list' ? {backgroundColor: '#555086'} : {}}
            >
              Lista
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{borderBottomColor: '#555086'}}></div>
            <p className="mt-4 text-gray-600">Carregando eventos...</p>
          </div>
        ) : (
          <>
            {/* Visualização em Calendário */}
            {viewMode === 'calendar' && (
              <EventCalendar events={filteredEvents} />
            )}

            {/* Visualização em Lista */}
            {viewMode === 'list' && (
              <div className="space-y-6">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <div key={event.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(event.eventType)} mb-2`}>
                            {getTypeLabel(event.eventType)}
                          </span>
                          <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          event.status === 'confirmado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.status === 'confirmado' ? 'Confirmado' : event.status}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4">{event.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-5 w-5 mr-2" style={{color: '#555086'}} />
                          <span>{new Date(event.eventDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-5 w-5 mr-2" style={{color: '#555086'}} />
                          <span>{event.eventTime}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-2" style={{color: '#555086'}} />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      {event.maxParticipants && (
                        <div className="mt-4 flex items-center text-gray-600">
                          <Users className="h-5 w-5 mr-2" style={{color: '#555086'}} />
                          <span>
                            {event.currentParticipants || 0} / {event.maxParticipants} participantes
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Nenhum evento encontrado
                    </h3>
                    <p className="text-gray-600">
                      Não há eventos programados no momento
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Events;
