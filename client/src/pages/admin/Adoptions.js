import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';

const StatusBadge = ({ status }) => {
  const map = { 'pendente':'bg-gray-200', 'em análise':'bg-yellow-200', 'aprovado':'bg-green-200', 'rejeitado':'bg-red-200' };
  return <span className={`px-2 py-1 text-xs rounded ${map[status]||'bg-gray-200'}`}>{status}</span>;
};

export default function AdoptionsAdmin() {
  const [adoptions, setAdoptions] = useState([]);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async (pg=1, st=status) => {
    try {
      setLoading(true); setErr('');
      const p = new URLSearchParams();
      p.set('page', String(pg)); p.set('limit','10');
      if (st && st!=='all') p.set('status', st);
      const { data } = await api.get(`/adoptions?${p.toString()}`);
      setAdoptions(data?.adoptions || []);
      setPage(data?.pagination?.page || pg);
      setPages(data?.pagination?.pages || 1);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Falha ao carregar');
      setAdoptions([]); setPages(1);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { load(1, status); }, [status, load]);

  const setStatusTo = async (id, newStatus) => {
    if (!window.confirm(`Confirmar ${newStatus} para #${id}?`)) return;
    try {
      await api.patch(`/adoptions/${id}/status`, { status: newStatus });
      await load(page, status);
    } catch (e) {
      alert(e?.response?.data?.message || 'Falha ao atualizar status');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-3">Solicitações de Adoção</h1>

      <div className="flex items-center gap-3 mb-4">
        <label>Status:</label>
        <select value={status} onChange={(e)=>setStatus(e.target.value)} className="border rounded p-2">
          <option value="all">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="em análise">Em análise</option>
          <option value="aprovado">Aprovado</option>
          <option value="rejeitado">Rejeitado</option>
        </select>
        <button onClick={()=>load(1,status)} className="ml-auto border rounded px-3 py-2">Recarregar</button>
      </div>

      {err && <div className="mb-3 text-red-700 bg-red-100 px-3 py-2 rounded">{err}</div>}

      <div className="overflow-x-auto border rounded">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 border-b">Animal</th>
              <th className="text-left p-2 border-b">Adotante</th>
              <th className="text-left p-2 border-b">Contato</th>
              <th className="text-left p-2 border-b">Status</th>
              <th className="text-left p-2 border-b">Data</th>
              <th className="text-left p-2 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(adoptions ?? []).map((ad) => (
              <tr key={ad.id}>
                <td className="p-2 border-b">{ad?.animal?.name ?? '—'}</td>
                <td className="p-2 border-b">{ad?.adopter?.name ?? ad?.adopterName ?? '—'}</td>
                <td className="p-2 border-b">
                  {(ad?.adopter?.email ?? ad?.adopterEmail) || '—'}<br/>
                  {(ad?.adopter?.phone ?? ad?.adopterPhone) || '—'}
                </td>
                <td className="p-2 border-b"><StatusBadge status={ad?.status}/></td>
                <td className="p-2 border-b">{ad?.createdAt ? new Date(ad.createdAt).toLocaleString('pt-BR') : '—'}</td>
                <td className="p-2 border-b">
                  <div className="flex gap-2">
                    <button onClick={()=>setStatusTo(ad.id,'aprovado')} className="px-2 py-1 border rounded">Aprovar</button>
                    <button onClick={()=>setStatusTo(ad.id,'rejeitado')} className="px-2 py-1 border rounded">Rejeitar</button>
                  </div>
                </td>
              </tr>
            ))}
            {(!loading && (adoptions ?? []).length === 0) && (
              <tr><td colSpan="6" className="p-3 text-center">Nenhuma solicitação</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-3 mt-4">
        <button disabled={page<=1} onClick={()=>load(page-1)} className="px-3 py-2 border rounded">&lt; Anterior</button>
        <span>Página {page} de {pages}</span>
        <button disabled={page>=pages} onClick={()=>load(page+1)} className="px-3 py-2 border rounded">Próxima &gt;</button>
      </div>
    </div>
  );
}
