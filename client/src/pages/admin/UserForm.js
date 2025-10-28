import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { Save, ArrowLeft, Shield, User, Mail, Phone, Building } from 'lucide-react';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

  const watchRole = watch('role');

  // Carregar dados do usuário para edição
  const { data: userData } = useQuery(
    ['user', id],
    () => axios.get(`/api/users/${id}`).then(res => res.data),
    { 
      enabled: isEdit,
      onSuccess: (data) => {
        // Preencher formulário
        Object.keys(data).forEach(key => {
          if (key !== 'password' && key !== 'permissions') {
            setValue(key, data[key]);
          }
        });
        
        // Preencher permissões
        if (data.permissions) {
          Object.keys(data.permissions).forEach(permission => {
            setValue(`permissions.${permission}`, data.permissions[permission]);
          });
        }
      }
    }
  );

  const mutation = useMutation(
    (data) => {
      if (isEdit) {
        return axios.put(`/api/users/${id}`, data);
      } else {
        return axios.post('/api/users', data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        navigate('/admin/usuarios');
      }
    }
  );

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Processar permissões
      const permissions = {};
      Object.keys(data).forEach(key => {
        if (key.startsWith('permissions.')) {
          const permissionKey = key.replace('permissions.', '');
          permissions[permissionKey] = data[key];
          delete data[key];
        }
      });

      const payload = {
        ...data,
        permissions,
        status: data.status || 'active'
      };

      // Se não for edição ou se a senha foi preenchida
      if (!isEdit || data.password) {
        if (data.password !== data.confirmPassword) {
          alert('As senhas não coincidem');
          return;
        }
      } else {
        // Remove senha se estiver vazia na edição
        delete payload.password;
        delete payload.confirmPassword;
      }

      await mutation.mutateAsync(payload);
    } catch (error) {
      alert(error?.response?.data?.message || 'Erro ao salvar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPermissionsByRole = (role) => {
    const allPermissions = {
      'animals.create': 'Criar animais',
      'animals.edit': 'Editar animais',
      'animals.delete': 'Excluir animais',
      'animals.view': 'Visualizar animais',
      'adoptions.view': 'Visualizar adoções',
      'adoptions.manage': 'Gerenciar adoções',
      'news.create': 'Criar notícias',
      'news.edit': 'Editar notícias',
      'news.delete': 'Excluir notícias',
      'news.publish': 'Publicar notícias',
      'users.create': 'Criar usuários',
      'users.edit': 'Editar usuários',
      'users.delete': 'Excluir usuários',
      'users.view': 'Visualizar usuários',
      'contacts.view': 'Visualizar contatos',
      'stats.view': 'Visualizar estatísticas'
    };

    const rolePermissions = {
      admin: Object.keys(allPermissions),
      moderator: [
        'animals.create', 'animals.edit', 'animals.view',
        'adoptions.view', 'adoptions.manage',
        'news.create', 'news.edit', 'news.publish',
        'contacts.view', 'stats.view'
      ],
      volunteer: [
        'animals.view', 'animals.edit',
        'adoptions.view',
        'news.view',
        'contacts.view'
      ],
      user: ['animals.view']
    };

    return rolePermissions[role] || [];
  };

  const availablePermissions = getPermissionsByRole(watchRole);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/usuarios')}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Colaboradores
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Editar Colaborador' : 'Novo Colaborador'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Informações Pessoais */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Informações Pessoais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Nome é obrigatório' })}
                className="input-field"
                placeholder="Nome completo do colaborador"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Email inválido'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="email@exemplo.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  {...register('phone')}
                  className="input-field pl-10"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select {...register('department')} className="input-field pl-10">
                  <option value="">Selecione um departamento</option>
                  <option value="Administração">Administração</option>
                  <option value="Cuidados Veterinários">Cuidados Veterinários</option>
                  <option value="Adoções">Adoções</option>
                  <option value="Comunicação">Comunicação</option>
                  <option value="Voluntariado">Voluntariado</option>
                  <option value="Eventos">Eventos</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Acesso e Permissões */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Acesso e Permissões
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Função *
              </label>
              <select 
                {...register('role', { required: 'Função é obrigatória' })} 
                className="input-field"
              >
                <option value="">Selecione uma função</option>
                <option value="admin">Administrador</option>
                <option value="moderator">Moderador</option>
                <option value="volunteer">Voluntário</option>
                <option value="user">Usuário</option>
              </select>
              {errors.role && (
                <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select {...register('status')} className="input-field">
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="pending">Pendente</option>
              </select>
            </div>
          </div>

          {/* Permissões Específicas */}
          {watchRole && watchRole !== 'user' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Permissões Específicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availablePermissions.map(permission => (
                  <div key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      {...register(`permissions.${permission}`)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      defaultChecked={watchRole === 'admin'}
                      disabled={watchRole === 'admin'}
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      {permission.split('.').map(part => 
                        part.charAt(0).toUpperCase() + part.slice(1)
                      ).join(' - ')}
                    </label>
                  </div>
                ))}
              </div>
              {watchRole === 'admin' && (
                <p className="text-sm text-gray-500 mt-2">
                  Administradores têm todas as permissões automaticamente.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Senha */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {isEdit ? 'Alterar Senha (opcional)' : 'Senha de Acesso'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isEdit ? 'Nova Senha' : 'Senha *'}
              </label>
              <input
                type="password"
                {...register('password', { 
                  required: !isEdit ? 'Senha é obrigatória' : false,
                  minLength: {
                    value: 6,
                    message: 'Senha deve ter pelo menos 6 caracteres'
                  }
                })}
                className="input-field"
                placeholder={isEdit ? 'Deixe em branco para manter a atual' : 'Mínimo 6 caracteres'}
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha {!isEdit && '*'}
              </label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: !isEdit ? 'Confirmação de senha é obrigatória' : false
                })}
                className="input-field"
                placeholder="Digite a senha novamente"
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/usuarios')}
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
                {isEdit ? 'Atualizar' : 'Criar'} Colaborador
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
