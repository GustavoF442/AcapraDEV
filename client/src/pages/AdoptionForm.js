import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Heart, ArrowLeft, CheckCircle } from 'lucide-react';
import { resolveImageUrl } from '../utils/images';

const AdoptionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const { data: animal, isLoading } = useQuery(
    ['animal', id],
    () => api.get(`/animals/${id}`).then(res => res.data),
    { enabled: !!id }
  );

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/adoptions', {
        animalId: id,
        ...data
      });
      setSubmitted(true);
    } catch (error) {
      alert('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!animal || animal.status !== 'disponível') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Animal não disponível para adoção
          </h2>
          <button onClick={() => navigate('/animais')} className="btn-primary">
            Ver Outros Animais
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Solicitação Enviada!
          </h2>
          <p className="text-gray-600 mb-6">
            Sua solicitação de adoção para <strong>{animal.name}</strong> foi enviada com sucesso. 
            Entraremos em contato em breve para dar continuidade ao processo.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/animais/${id}`)}
              className="w-full btn-secondary"
            >
              Ver {animal.name}
            </button>
            <button
              onClick={() => navigate('/animais')}
              className="w-full btn-primary"
            >
              Ver Outros Animais
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/animais/${id}`)}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para {animal.name}
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4">
              <img
                src={animal.photos?.[0] ? resolveImageUrl(animal.photos[0]) : '/placeholder-animal.jpg'}
                alt={animal.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Heart className="h-6 w-6 text-red-500 mr-2" />
                  Adotar {animal.name}
                </h1>
                <p className="text-gray-600">
                  {animal.species} • {animal.age} • {animal.size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Dados Pessoais */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados Pessoais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  {...register('adopterName', { required: 'Nome é obrigatório' })}
                  className="input-field"
                />
                {errors.adopterName && (
                  <p className="text-red-600 text-sm mt-1">{errors.adopterName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('adopterEmail', { 
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Email inválido'
                    }
                  })}
                  className="input-field"
                />
                {errors.adopterEmail && (
                  <p className="text-red-600 text-sm mt-1">{errors.adopterEmail.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  {...register('adopterPhone', { required: 'Telefone é obrigatório' })}
                  className="input-field"
                />
                {errors.adopterPhone && (
                  <p className="text-red-600 text-sm mt-1">{errors.adopterPhone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  {...register('adopterCpf', { required: 'CPF é obrigatório' })}
                  className="input-field"
                />
                {errors.adopterCpf && (
                  <p className="text-red-600 text-sm mt-1">{errors.adopterCpf.message}</p>
                )}
              </div>
            </div>

            {/* Endereço */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rua e Número
                  </label>
                  <input
                    type="text"
                    {...register('adopterAddress')}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    {...register('adopterCity')}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    {...register('adopterState')}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Moradia */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sobre sua Moradia</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Moradia *
                </label>
                <select
                  {...register('housingType', { required: 'Tipo de moradia é obrigatório' })}
                  className="input-field"
                >
                  <option value="">Selecione</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                </select>
                {errors.housingType && (
                  <p className="text-red-600 text-sm mt-1">{errors.housingType.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('hasYard')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Possui quintal/área externa
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isRented')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Moradia é alugada
                  </label>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('ownerConsent')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Se alugada, tenho autorização do proprietário para ter animais
                </label>
              </div>
            </div>
          </div>

          {/* Experiência */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Experiência com Animais</h2>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('hadPetsBefore')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Já tive animais de estimação antes
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Possui outros animais atualmente?
                </label>
                <textarea
                  {...register('currentPets')}
                  rows="3"
                  className="input-field"
                  placeholder="Descreva quais animais você tem atualmente, se houver"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experiência com cuidados de animais
                </label>
                <textarea
                  {...register('petCareExperience')}
                  rows="3"
                  className="input-field"
                  placeholder="Conte sobre sua experiência cuidando de animais"
                />
              </div>
            </div>
          </div>

          {/* Motivação */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Motivação para Adoção</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Por que deseja adotar {animal.name}? *
              </label>
              <textarea
                {...register('motivation', { 
                  required: 'Motivação é obrigatória',
                  minLength: {
                    value: 10,
                    message: 'Descreva sua motivação com mais detalhes'
                  }
                })}
                rows="4"
                className="input-field"
                placeholder="Conte-nos por que escolheu este animal e como pretende cuidar dele"
              />
              {errors.motivation && (
                <p className="text-red-600 text-sm mt-1">{errors.motivation.message}</p>
              )}
            </div>
          </div>

          {/* Disponibilidade */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Disponibilidade e Cuidados</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quanto tempo por dia você tem disponível para o animal?
                </label>
                <input
                  type="text"
                  {...register('timeForPet')}
                  className="input-field"
                  placeholder="Ex: 4 horas por dia, tempo integral, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quem será responsável pelos cuidados diários?
                </label>
                <input
                  type="text"
                  {...register('whoWillCare')}
                  className="input-field"
                  placeholder="Ex: Eu, toda a família, etc."
                />
              </div>
            </div>
          </div>

          {/* Veterinário */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Cuidados Veterinários</h2>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('hasVet')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Já tenho veterinário de confiança
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Informações do veterinário (se houver)
                </label>
                <textarea
                  {...register('vetInfo')}
                  rows="2"
                  className="input-field"
                  placeholder="Nome da clínica, veterinário, telefone, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Como lidaria com emergências veterinárias?
                </label>
                <textarea
                  {...register('emergencyPlan')}
                  rows="3"
                  className="input-field"
                  placeholder="Descreva como se prepararia para situações de emergência"
                />
              </div>
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-lg py-3 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : `Solicitar Adoção de ${animal.name}`}
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Ao enviar, você concorda que as informações fornecidas são verdadeiras
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionForm;
