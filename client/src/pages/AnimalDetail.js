import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../services/api';
import { Heart, MapPin, Calendar, User, Shield, Award, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const AnimalDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: animal, isLoading, error } = useQuery(
    ['animal', id],
    () => api.get(`/animals/${id}`).then(res => res.data),
    { enabled: !!id }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Animal não encontrado</h2>
          <Link to="/animais" className="btn-primary">
            Voltar para listagem
          </Link>
        </div>
      </div>
    );
  }

  const photos = animal.photos || [];
  const hasPhotos = photos.length > 0;

  const resolvePhotoSrc = (photo) => {
    if (!photo) return '';
    const p = photo.path || '';
    const isAbsolute = /^https?:\/\//i.test(p);
    return isAbsolute ? p : `/uploads/${p}`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/animais" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para animais
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galeria de Fotos */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden shadow-md">
              {hasPhotos ? (
                <>
                  <img
                    src={resolvePhotoSrc(photos[currentImageIndex])}
                    alt={`${animal.name} - Foto ${currentImageIndex + 1}`}
                    className="w-full h-96 object-cover"
                  />
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {photos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Sem fotos disponíveis</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative overflow-hidden rounded-lg ${
                      index === currentImageIndex ? 'ring-2 ring-primary-600' : ''
                    }`}
                  >
                    <img
                      src={resolvePhotoSrc(photo)}
                      alt={`${animal.name} - Miniatura ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Animal */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{animal.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  animal.status === 'disponível' 
                    ? 'bg-green-100 text-green-800'
                    : animal.status === 'em processo'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {animal.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-2" />
                  <span>{animal.species}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{animal.age}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Award className="h-5 w-5 mr-2" />
                  <span>Porte {animal.size}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{animal.city}, {animal.state}</span>
                </div>
              </div>

              {animal.breed && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Raça: </span>
                  <span className="font-medium">{animal.breed}</span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sobre {animal.name}</h3>
                <p className="text-gray-700 leading-relaxed">{animal.description}</p>
              </div>

              {/* Temperamento */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Temperamento</h3>
                <div className="flex flex-wrap gap-2">
                  {animal.friendly && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Amigável</span>}
                  {animal.playful && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Brincalhão</span>}
                  {animal.calm && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Calmo</span>}
                  {animal.protective && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Protetor</span>}
                  {animal.social && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Sociável</span>}
                  {animal.independent && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Independente</span>}
                  {animal.active && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Ativo</span>}
                  {animal.docile && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Dócil</span>}
                </div>
              </div>

              {/* Informações de Saúde */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Saúde</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Shield className={`h-5 w-5 mr-2 ${animal.vaccinated ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={animal.vaccinated ? 'text-green-600' : 'text-gray-600'}>
                      {animal.vaccinated ? 'Vacinado' : 'Não vacinado'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Shield className={`h-5 w-5 mr-2 ${animal.neutered ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={animal.neutered ? 'text-green-600' : 'text-gray-600'}>
                      {animal.neutered ? 'Castrado' : 'Não castrado'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Shield className={`h-5 w-5 mr-2 ${animal.dewormed ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={animal.dewormed ? 'text-green-600' : 'text-gray-600'}>
                      {animal.dewormed ? 'Vermifugado' : 'Não vermifugado'}
                    </span>
                  </div>
                </div>
                
                {animal.specialNeeds && animal.healthNotes && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-1">Cuidados Especiais</h4>
                    <p className="text-yellow-700 text-sm">{animal.healthNotes}</p>
                  </div>
                )}
              </div>

              {/* Botão de Adoção */}
              {animal.status === 'disponível' && (
                <div className="pt-6 border-t">
                  <Link
                    to={`/adotar/${animal.id}`}
                    className="w-full btn-primary flex items-center justify-center text-lg py-3"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Quero Adotar {animal.name}
                  </Link>
                  <p className="text-sm text-gray-600 text-center mt-2">
                    Preencha o formulário de adoção e entraremos em contato
                  </p>
                </div>
              )}

              {animal.status === 'em processo' && (
                <div className="pt-6 border-t">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-yellow-800 font-medium">
                      {animal.name} está em processo de adoção
                    </p>
                    <p className="text-yellow-700 text-sm mt-1">
                      Mas você pode se interessar por outros animais disponíveis
                    </p>
                  </div>
                </div>
              )}

              {animal.status === 'adotado' && (
                <div className="pt-6 border-t">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-800 font-medium">
                      {animal.name} foi adotado! 🎉
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      Ficamos felizes que encontrou um lar amoroso
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Animais Relacionados */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Outros animais que você pode gostar
          </h2>
          <div className="text-center">
            <Link to="/animais" className="btn-secondary">
              Ver Todos os Animais
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetail;
