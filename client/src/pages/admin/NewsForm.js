import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, Save, ArrowLeft, Upload, X, Calendar, User, Tag } from 'lucide-react';
import { resolveImageUrl } from '../../utils/images';
import api from '../../services/api';

const initialForm = {
  title: '',
  content: '',
  excerpt: '',
  status: 'rascunho', // 'rascunho' | 'publicado'
  tags: ''            // "a,b,c"
};

export default function NewsForm() {
  const { id } = useParams();          // id opcional (edição)
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null); // { filename, originalName, path, ... }
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // carregar notícia para edição (admin)
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const { data } = await api.get(`/api/news/admin/${id}`);
        setForm({
          title: data.title || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          status: data.status || 'rascunho',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || '')
        });
        setImage(data.image || null);
      } catch (e) {
        alert(e?.response?.data?.message || 'Falha ao carregar notícia');
      }
    };
    load();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSelectImage = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/api/news/upload', fd); // Authorization já via interceptor
      setImage(res.data?.image || null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Falha no upload');
    }
  };

  const validate = () => {
    if (!form.title || form.title.trim().length < 5) return 'Título deve ter pelo menos 5 caracteres';
    if (!form.content || form.content.trim().length < 50) return 'Conteúdo deve ter pelo menos 50 caracteres';
    if (!form.excerpt || form.excerpt.trim().length < 10 || form.excerpt.trim().length > 200) return 'Resumo deve ter entre 10 e 200 caracteres';
    if (!['rascunho', 'publicado'].includes(form.status)) return 'Status inválido';
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { alert(err); return; }

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      excerpt: form.excerpt.trim(),
      status: form.status,
      tags: form.tags,        // string "a,b,c" — o backend aceita string/array
      image: image || undefined
    };

    try {
      setLoading(true);
      if (id) {
        await api.put(`/api/news/${id}`, payload);
      } else {
        await api.post('/api/news', payload);
      }
      navigate('/admin/noticias');
    } catch (error) {
      const apiErr = error?.response?.data;
      if (apiErr?.errors?.length) {
        alert(apiErr.errors.map(e => `${e.param}: ${e.msg}`).join('\n'));
      } else {
        alert(apiErr?.message || 'Falha ao salvar notícia');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async () => {
    try {
      if (!image?.path) { setImage(null); return; }
      await api.delete('/api/news/image', { data: { path: image.path } });
      setImage(null);
    } catch (e) {
      // Se não existir rota, apenas limpa local
      setImage(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        try {
          const fd = new FormData();
          fd.append('image', file);
          const res = await api.post('/api/news/upload', fd);
          setImage(res.data?.image || null);
        } catch (err) {
          alert(err?.response?.data?.message || 'Falha no upload');
        }
      }
    }
  };

  const renderPreview = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {image && (
        <div className="w-full h-64 md:h-96">
          <img
            src={resolveImageUrl(image)}
            alt={form.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {form.title || 'Título da notícia'}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>ACAPRA</span>
            </div>
          </div>

          {form.excerpt && (
            <p className="text-lg text-gray-700 mb-6 italic">
              {form.excerpt}
            </p>
          )}
        </div>

        <div className="prose prose-lg max-w-none">
          {form.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph || '\u00A0'}
            </p>
          ))}
        </div>

        {form.tags && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {form.tags.split(',').map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/noticias')}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar às Notícias
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? 'Editar Notícia' : 'Nova Notícia'}
          </h1>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="btn-outline flex items-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Ocultar' : 'Mostrar'} Preview
          </button>
        </div>
      </div>

      <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
        {/* Formulário */}
        <div className="space-y-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Informações Básicas
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={onChange}
                    className="input-field"
                    placeholder="Digite o título da notícia..."
                    maxLength="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {form.title.length}/100 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resumo *
                  </label>
                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={onChange}
                    className="input-field"
                    rows="2"
                    placeholder="Resumo que aparecerá na listagem de notícias..."
                    maxLength="200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {form.excerpt.length}/200 caracteres
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select 
                      name="status" 
                      value={form.status} 
                      onChange={onChange} 
                      className="input-field"
                    >
                      <option value="rascunho">Rascunho</option>
                      <option value="publicado">Publicado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      name="tags"
                      value={form.tags}
                      onChange={onChange}
                      className="input-field"
                      placeholder="adoção, evento, campanha..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Conteúdo da Notícia
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto Completo *
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={onChange}
                  className="input-field"
                  rows="12"
                  placeholder="Digite o conteúdo completo da notícia..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 50 caracteres ({form.content.length} digitados)
                </p>
              </div>
            </div>

            {/* Imagem */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Imagem da Notícia
              </h2>
              
              {!image ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-primary-400 bg-primary-50' 
                      : 'border-gray-300 hover:border-primary-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onSelectImage}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Clique para adicionar uma imagem
                    </p>
                    <p className="text-sm text-gray-500">
                      Ou arraste e solte aqui (JPG, PNG, WebP)
                    </p>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={resolveImageUrl(image)}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {image.originalName || 'Imagem carregada'}
                    </p>
                    <label htmlFor="image-upload" className="btn-outline text-sm cursor-pointer">
                      Trocar imagem
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/noticias')}
                className="btn-outline"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {id ? 'Atualizar' : 'Publicar'} Notícia
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="space-y-6">
            <div className="sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Preview da Notícia
              </h3>
              {renderPreview()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
