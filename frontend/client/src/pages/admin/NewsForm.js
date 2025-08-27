import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  const imgSrc = image?.path
    ? (image.path.startsWith('http') ? image.path : `${image.path.replace(/\\\\/g,'/').replace(/\\/g,'/')}`)
    : '';

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Editar Notícia' : 'Nova Notícia'}</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="w-full border rounded p-2"
            placeholder="Título"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Resumo (10–200)</label>
          <input
            name="excerpt"
            value={form.excerpt}
            onChange={onChange}
            className="w-full border rounded p-2"
            placeholder="Resumo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Conteúdo</label>
          <textarea
            name="content"
            value={form.content}
            onChange={onChange}
            className="w-full border rounded p-2 h-48"
            placeholder="Texto da notícia (mín. 50 caracteres)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select name="status" value={form.status} onChange={onChange} className="w-full border rounded p-2">
              <option value="rascunho">Rascunho</option>
              <option value="publicado">Publicado</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Tags (separadas por vírgula)</label>
            <input
              name="tags"
              value={form.tags}
              onChange={onChange}
              className="w-full border rounded p-2"
              placeholder="ex: acapra, evento"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Imagem</label>
          <input type="file" accept="image/*" onChange={onSelectImage} />
          {imgSrc ? (
            <div className="mt-3">
              <img src={imgSrc} alt="preview" className="max-h-48 rounded border" />
              <button type="button" className="mt-2 px-3 py-1 border rounded" onClick={removeImage}>
                Remover imagem
              </button>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-1">Opcional</p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
