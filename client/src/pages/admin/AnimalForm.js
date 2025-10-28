import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from '../../services/api';
import { Save, ArrowLeft, Upload, X, Eye, Star } from 'lucide-react';
import { resolveImageUrl } from '../../utils/images';

const AnimalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  // Carregar dados do animal para edição
  useQuery(
    ['animal', id],
    () => api.get(`/animals/${id}`).then(res => res.data),
    { 
      enabled: isEdit,
      onSuccess: (data) => {
        // Preencher formulário
        Object.keys(data).forEach(key => {
          if (key !== 'photos') {
            setValue(key, data[key]);
          }
        });
        setPhotos(data.photos || []);
      }
    }
  );

  const mutation = useMutation(
    (data) => {
      if (isEdit) {
        return api.put(`/animals/${id}`, data);
      } else {
        return api.post('/animals', data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('animals');
        navigate('/admin/animais');
      }
    }
  );

  const handleImageUpload = async (files) => {
    const newPhotos = files.map((file, index) => ({
      file,
      filename: `temp_${Date.now()}_${index}`,
      originalName: file.name,
      mimetype: file.type,
      size: file.size,
      isMain: photos.length === 0 && index === 0
    }));
    
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const handleImageRemove = async (index) => {
    const photo = photos[index];
    if (photo.path) {
      try {
        await api.delete(`/animals/photo/${photo.path}`);
      } catch (error) {
        console.error('Erro ao remover imagem:', error);
      }
    }
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Adicionar dados do formulário
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      
      // Adicionar fotos
      photos.forEach((photo, index) => {
        if (photo.file) {
          formData.append('photos', photo.file);
        }
      });
      
      await mutation.mutateAsync(formData);
    } catch (error) {
      alert('Erro ao salvar animal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/animais')}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Animais
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Editar Animal' : 'Cadastrar Novo Animal'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Informações Básicas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Informações Básicas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Nome é obrigatório' })}
                className="input-field"
                placeholder="Nome do animal"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Espécie *
              </label>
              <select
                {...register('species', { required: 'Espécie é obrigatória' })}
                className="input-field"
              >
                <option value="">Selecione a espécie</option>
                <option value="Cão">Cão</option>
                <option value="Gato">Gato</option>
                <option value="Outro">Outro</option>
              </select>
              {errors.species && (
                <p className="text-red-600 text-sm mt-1">{errors.species.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idade *
              </label>
              <select {...register('age', { required: 'Idade é obrigatória' })} className="input-field">
                <option value="">Selecione a idade</option>
                <option value="Filhote">Filhote (0-1 ano)</option>
                <option value="Jovem">Jovem (1-3 anos)</option>
                <option value="Adulto">Adulto (3-7 anos)</option>
                <option value="Idoso">Idoso (7+ anos)</option>
              </select>
              {errors.age && (
                <p className="text-red-600 text-sm mt-1">{errors.age.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porte *
              </label>
              <select {...register('size', { required: 'Porte é obrigatório' })} className="input-field">
                <option value="">Selecione o porte</option>
                <option value="Pequeno">Pequeno</option>
                <option value="Médio">Médio</option>
                <option value="Grande">Grande</option>
              </select>
              {errors.size && (
                <p className="text-red-600 text-sm mt-1">{errors.size.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sexo *
              </label>
              <select {...register('gender', { required: 'Sexo é obrigatório' })} className="input-field">
                <option value="">Selecione o sexo</option>
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
              {errors.gender && (
                <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raça
              </label>
              <input
                type="text"
                {...register('breed')}
                className="input-field"
                placeholder="Ex: Labrador, Siamês, SRD..."
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Localização</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  {...register('city', { required: 'Cidade é obrigatória' })}
                  className="input-field"
                  placeholder="Ex: São Paulo"
                />
                {errors.city && (
                  <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <select
                  {...register('state', { required: 'Estado é obrigatório' })}
                  className="input-field"
                >
                  <option value="">Selecione o estado</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
                {errors.state && (
                  <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select {...register('status')} className="input-field">
                  <option value="disponível">Disponível</option>
                  <option value="em processo">Em Processo</option>
                  <option value="adotado">Adotado</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              {...register('description', { required: 'Descrição é obrigatória', minLength: { value: 10, message: 'Descrição deve ter pelo menos 10 caracteres' } })}
              rows="4"
              className="input-field"
              placeholder="Conte sobre a personalidade e características do animal..."
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Saúde */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Informações de Saúde
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('vaccinated')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Vacinado
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('neutered')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Castrado
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('dewormed')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Vermifugado
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('specialNeeds')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Necessidades Especiais
              </label>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações de Saúde
            </label>
            <textarea
              {...register('healthNotes')}
              rows="3"
              className="input-field"
              placeholder="Informações adicionais sobre a saúde do animal..."
            />
          </div>
        </div>

        {/* Temperamento */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Temperamento
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: 'Calmo', field: 'calm' },
              { label: 'Brincalhão', field: 'playful' },
              { label: 'Carinhoso', field: 'friendly' },
              { label: 'Protetor', field: 'protective' },
              { label: 'Sociável', field: 'social' },
              { label: 'Independente', field: 'independent' },
              { label: 'Ativo', field: 'active' },
              { label: 'Dócil', field: 'docile' }
            ].map(trait => (
              <div key={trait.field} className="flex items-center">
                <input
                  type="checkbox"
                  {...register(trait.field)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {trait.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Fotos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Fotos do Animal
          </h2>
          
          <div className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  handleImageUpload(files);
                  e.target.value = '';
                }}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Clique para adicionar fotos
                </p>
                <p className="text-sm text-gray-500">
                  Ou arraste e solte aqui (máximo 10 fotos)
                </p>
              </label>
            </div>

            {/* Preview Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={photo.file ? URL.createObjectURL(photo.file) : resolveImageUrl(photo)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Overlay com ações */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        {photo.isMain && (
                          <div className="bg-yellow-500 text-white p-1 rounded">
                            <Star className="h-4 w-4" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            // Definir como foto principal
                            setPhotos(prev => prev.map((p, i) => ({
                              ...p,
                              isMain: i === index
                            })));
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                          title="Definir como foto principal"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImageRemove(index)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                          title="Remover foto"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Indicador de foto principal */}
                    {photo.isMain && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Principal
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {photos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma foto adicionada ainda</p>
                <p className="text-sm">As fotos ajudam muito na adoção!</p>
              </div>
            )}
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/animais')}
            className="btn-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? 'Atualizar' : 'Cadastrar'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnimalForm;
