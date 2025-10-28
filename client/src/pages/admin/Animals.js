import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Plus, Search, Edit, Trash2, Heart, MapPin } from 'lucide-react';

const AdminAnimals = () => {
  const [filters, setFilters] = useState({
    species: '',
    status: '',
    search: ''
  });
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['adminAnimals', filters, page],
    () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append('page', page);
      params.append('limit', 10);
      
      return api.get(`/animals?${params}`).then(res => res.data);
    },
    { keepPreviousData: true }
  );

  const deleteMutation = useMutation(
    (id) => axios.delete(`/api/animals/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminAnimals');
        alert('Animal removido com sucesso!');
      },
      onError: () => {
        alert('Erro ao remover animal');
      }
    }
  );

  const adoptMutation = useMutation(
    ({ id, data }) => axios.patch(`/api/animals/${id}/adopt`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminAnimals');
        alert('Animal marcado como adotado!');
      },
      onError: () => {
        alert('Erro ao marcar adoção');
      }
    }
  );

  const handleDelete = (animal) => {
    if (window.confirm(`Tem certeza que deseja remover ${animal.name}?`)) {
      const animalId = animal.id ?? animal._id;
      deleteMutation.mutate(animalId);
    }
  };

  const handleMarkAdopted = (animal) => {
    const adopterName = prompt('Nome do adotante:');
    const adopterContact = prompt('Contato do adotante:');
    
    if (adopterName && adopterContact) {
      adoptMutation.mutate({
        id: animal.id ?? animal._id,
        data: { adopterName, adopterContact }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Animais</h1>
              <p className="mt-1 text-sm text-gray-600">
                Cadastre e gerencie os animais disponíveis para adoção
              </p>
            </div>
            <Link to="/admin/animais/novo" className="btn-primary flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Novo Animal
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, raça..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <select
                value={filters.species}
                onChange={(e) => setFilters(prev => ({ ...prev, species: e.target.value }))}
                className="input-field"
              >
                <option value="">Todas as espécies</option>
                <option value="cão">Cão</option>
                <option value="gato">Gato</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="input-field"
              >
                <option value="">Todos os status</option>
                <option value="disponível">Disponível</option>
                <option value="em processo">Em Processo</option>
                <option value="adotado">Adotado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Animais */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando animais...</p>
          </div>
        ) : data?.animals?.length > 0 ? (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Animal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detalhes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Localização
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
                    {data.animals.map((animal) => (
                      <tr key={(animal.id ?? animal._id)} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
  <img
    className="h-12 w-12 rounded-lg object-cover"
    src={
      animal.photos?.[0]?.path
        ? String(animal.photos[0].path).replace(/\\/g, '/')
        : '/placeholder-animal.jpg'
    }
    alt={animal.name}
  />
</div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {animal.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {animal.breed || 'Sem raça definida'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {animal.species} • {animal.gender}
                          </div>
                          <div className="text-sm text-gray-500">
                            {animal.age} • {animal.size}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            {(animal.location?.city || animal.city) || '-'}, {(animal.location?.state || animal.state) || ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            animal.status === 'disponível' 
                              ? 'bg-green-100 text-green-800'
                              : animal.status === 'em processo'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {animal.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/admin/animais/editar/${(animal.id ?? animal._id)}`}
                              className="text-blue-600 hover:text-blue-700 mr-3"
                            >
                              Editar
                            </Link>
                            <Link
                              to={`/admin/animais/${(animal.id ?? animal._id)}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            {animal.status === 'disponível' && (
                              <button
                                onClick={() => handleMarkAdopted(animal)}
                                className="text-green-600 hover:text-green-900"
                                title="Marcar como adotado"
                              >
                                <Heart className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(animal)}
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
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum animal encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Comece cadastrando o primeiro animal para adoção
            </p>
            <Link to="/admin/animais/novo" className="btn-primary">
              Adicionar Animal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnimals;
