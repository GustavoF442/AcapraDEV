import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Filter, Heart, MapPin, Calendar, User, X } from 'lucide-react';
import { resolveImageUrl } from '../utils/images';

const Animals = () => {
  const [filters, setFilters] = useState({
    species: '',
    size: '',
    gender: '',
    age: '',
    city: '',
    state: '',
    status: 'disponível', // Só mostrar disponíveis por padrão
    search: ''
  });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useQuery(
    ['animals', filters, page],
    () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          params.append(key, value.trim());
        }
      });
      params.append('page', page);
      params.append('limit', 12);
      
      return api.get(`/animals?${params}`).then(res => res.data);
    },
    { 
      keepPreviousData: true,
      refetchOnWindowFocus: false
    }
  );

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      species: '',
      size: '',
      gender: '',
      age: '',
      city: '',
      state: '',
      status: 'disponível',
      search: ''
    });
    setPage(1);
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => 
      key !== 'status' && value && value.trim() !== ''
    ).length;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar animais</h2>
          <p className="text-gray-600">Tente novamente mais tarde</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Encontre seu Novo Amigo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Todos os nossos animais estão esperando por um lar cheio de amor. 
            Use os filtros para encontrar o companheiro perfeito para você.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          {/* Header dos filtros */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Filter className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
                    {getActiveFiltersCount()} ativo{getActiveFiltersCount() > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Limpar
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden btn-outline text-sm"
                >
                  {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Filtros principais - sempre visíveis */}
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, raça..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Filtros rápidos */}
              <div className="flex gap-2">
                <select
                  value={filters.species}
                  onChange={(e) => handleFilterChange('species', e.target.value)}
                  className="input-field min-w-[120px]"
                >
                  <option value="">Espécie</option>
                  <option value="Cão">Cão</option>
                  <option value="Gato">Gato</option>
                  <option value="Outro">Outro</option>
                </select>

                <select
                  value={filters.size}
                  onChange={(e) => handleFilterChange('size', e.target.value)}
                  className="input-field min-w-[100px]"
                >
                  <option value="">Porte</option>
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filtros avançados - colapsáveis no mobile */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block border-t border-gray-200 p-4`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                <select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  className="input-field"
                >
                  <option value="">Ambos</option>
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                <select
                  value={filters.age}
                  onChange={(e) => handleFilterChange('age', e.target.value)}
                  className="input-field"
                >
                  <option value="">Todas</option>
                  <option value="Filhote">Filhote</option>
                  <option value="Jovem">Jovem</option>
                  <option value="Adulto">Adulto</option>
                  <option value="Idoso">Idoso</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input
                  type="text"
                  placeholder="Ex: São Paulo"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="input-field"
                >
                  <option value="">Todos</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="PR">Paraná</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="BA">Bahia</option>
                  <option value="GO">Goiás</option>
                  <option value="PE">Pernambuco</option>
                  <option value="CE">Ceará</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="bg-gray-300 h-48 w-full"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : data?.animals?.length > 0 ? (
          <>
            {/* Contador */}
            <div className="mb-6">
              <p className="text-gray-600">
                Mostrando {data.animals.length} de {data.pagination.total} animais
              </p>
            </div>

            {/* Grid de animais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.animals.map((animal) => (
                <div key={animal.id} className="card hover:shadow-lg transition-shadow group">
                  <div className="relative overflow-hidden">
                    <img
                      src={animal.photos?.[0] ? resolveImageUrl(animal.photos[0]) : '/placeholder-animal.jpg'}
                      alt={animal.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        animal.status === 'disponível' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {animal.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{animal.name}</h3>
                    
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        {animal.species} • {animal.gender}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {animal.age} • {animal.size}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {animal.city}, {animal.state}
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {animal.description}
                    </p>

                    {/* Tags de temperamento */}
                    {animal.temperament && animal.temperament.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {animal.temperament.slice(0, 3).map((trait, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Link
                        to={`/animais/${animal.id}`}
                        className="flex-1 btn-primary text-center"
                      >
                        Ver Detalhes
                      </Link>
                      {animal.status === 'disponível' && (
                        <Link
                          to={`/adotar/${animal.id}`}
                          className="flex items-center justify-center px-3 py-2 border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Heart className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum animal encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar os filtros ou remover alguns critérios de busca
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Animals;
