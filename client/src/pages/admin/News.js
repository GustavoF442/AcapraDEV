import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

export default function NewsAdminList() {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState(''); // '', 'rascunho', 'publicado'
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [sp, setSp] = useSearchParams();

  useEffect(() => {
    const s = sp.get('status');
    if (s) setStatus(s);
  }, [sp]);

  const load = async (pg = 1, st = status) => {
    try {
      setLoading(true);
      setErr('');
      const params = new URLSearchParams();
      params.set('page', String(pg));
      params.set('limit', '10');
      if (st) params.set('status', st);
      const { data } = await api.get(`/api/news/admin/all?${params.toString()}`);
      setNews(data?.news || []);
      setPage(data?.pagination?.page || pg);
      setPages(data?.pagination?.pages || 1);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Falha ao carregar notícias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1, status); /* eslint-disable-next-line */ }, [status]);

  const del = async (id) => {
    if (!window.confirm(`Remover notícia #${id}?`)) return;
    try {
      await api.delete(`/api/news/${id}`);
      await load(page, status);
    } catch (e) {
      alert(e?.response?.data?.message || 'Falha ao remover');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Notícias</h1>
        <Link to="/admin/noticias/nova" className="px-3 py-2 rounded bg-green-600 text-white">Nova notícia</Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded p-2">
          <option value="">Todos</option>
          <option value="rascunho">Rascunho</option>
          <option value="publicado">Publicado</option>
        </select>
        <button onClick={() => load(1, status)} className="border rounded px-3 py-2 ml-auto">Recarregar</button>
      </div>

      {err && <div className="mb-3 text-red-700 bg-red-100 px-3 py-2 rounded">{err}</div>}

      <div className="overflow-x-auto border rounded">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 border-b">ID</th>
              <th className="text-left p-2 border-b">Título</th>
              <th className="text-left p-2 border-b">Status</th>
              <th className="text-left p-2 border-b">Publicação</th>
              <th className="text-left p-2 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(news ?? []).map(n => (
              <tr key={n.id}>
                <td className="p-2 border-b">{n.id}</td>
                <td className="p-2 border-b">{n.title}</td>
                <td className="p-2 border-b">
                  <span className="px-2 py-1 text-xs rounded bg-gray-200">{n.status}</span>
                </td>
                <td className="p-2 border-b">{n.publishedAt ? new Date(n.publishedAt).toLocaleString('pt-BR') : '—'}</td>
                <td className="p-2 border-b">
                  <div className="flex gap-2">
                    <Link to={`/admin/noticias/${n.id}`} className="px-2 py-1 border rounded">Editar</Link>
                    <button onClick={() => del(n.id)} className="px-2 py-1 border rounded text-red-700">Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
            {(!loading && (news ?? []).length === 0) && (
              <tr><td colSpan="5" className="p-3 text-center">Nenhuma notícia</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-3 mt-4">
        <button disabled={page<=1} onClick={() => load(page-1)} className="px-3 py-2 border rounded">&lt; Anterior</button>
        <span>Página {page} de {pages}</span>
        <button disabled={page>=pages} onClick={() => load(page+1)} className="px-3 py-2 border rounded">Próxima &gt;</button>
      </div>
    </div>
  );
}
