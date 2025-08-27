import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Heart, MapPin, Calendar, User } from 'lucide-react';

const Animals = () => {
  const [filters, setFilters] = useState({
    species: '',
    size: '',
    gender: '',
    age: '',
    city: '',
    search: ''
  });
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery(
    ['animals', filters, page],
    () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append('page', page);
      params.append('limit', 12);
      
      return axios.get(`/api/animals?${params}`).then(res => res.data);
    },
    { keepPreviousData: true }
  );

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
      search: ''
    });
    setPage(1);
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Busca */}
            <div className="lg:col-span-2">
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

            {/* Espécie */}
            <div>
              <select
                value={filters.species}
                onChange={(e) => handleFilterChange('species', e.target.value)}
                className="input-field"
              >
                <option value="">Todas as espécies</option>
                <option value="Cão">Cão</option>
                <option value="Gato">Gato</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            {/* Porte */}
            <div>
              <select
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                className="input-field"
              >
                <option value="">Todos os portes</option>
                <option value="Pequeno">Pequeno</option>
                <option value="Médio">Médio</option>
                <option value="Grande">Grande</option>
              </select>
            </div>

            {/* Sexo */}
            <div>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="input-field"
              >
                <option value="">Ambos os sexos</option>
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>

            {/* Idade */}
            <div>
              <select
                value={filters.age}
                onChange={(e) => handleFilterChange('age', e.target.value)}
                className="input-field"
              >
                <option value="">Todas as idades</option>
                <option value="Filhote">Filhote</option>
                <option value="Jovem">Jovem</option>
                <option value="Adulto">Adulto</option>
                <option value="Idoso">Idoso</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Cidade"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="input-field w-48"
              />
            </div>
            <button
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Limpar filtros
            </button>
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
                      src={animal.photos?.[0]?.path ? `${animal.photos[0].path}` : '/placeholder-animal.jpg'}
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
