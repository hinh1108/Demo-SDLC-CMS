'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

interface Item { id: string; title: string; seo_score: number | null; updated_at: string }

export default function ApprovalsPage() {
  const [rows, setRows] = useState<Item[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    try { const r = await apiFetch<{ data: Item[] }>('approvals'); setRows(r.data); }
    catch (e) { setMsg(e instanceof Error ? e.message : 'Lỗi'); }
  }
  useEffect(() => { load(); }, []);

  async function decide(id: string, result: 'approved' | 'rejected') {
    let note: string | null = '';
    if (result === 'rejected') { note = prompt('Ghi chú khi trả lại:'); if (note === null) return; if (!note.trim()) return; }
    try { await apiFetch(`contents/${id}/approvals`, { method: 'POST', body: JSON.stringify({ result, note }) }); setMsg(result === 'approved' ? 'Đã duyệt' : 'Đã trả lại'); load(); }
    catch (e) { setMsg(e instanceof Error ? e.message : 'Lỗi'); }
  }

  return (
    <>
      <div className="head">
        <div><h1>Chờ duyệt {rows.length ? `(${rows.length})` : ''}</h1><div className="sub">Duyệt hoặc trả lại nội dung — cần vai trò trưởng phòng</div></div>
      </div>
      {msg && <div style={{ marginBottom: 12, color: 'var(--primary-700)', fontWeight: 600 }}>{msg}</div>}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Tiêu đề</th><th>SEO</th><th>Cập nhật</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={4} className="muted">Không có bài chờ duyệt 🎉</td></tr>
              : rows.map((c) => (
                <tr key={c.id}>
                  <td><Link href={`/content/${c.id}`}><b>{c.title}</b></Link></td>
                  <td><span className="seo">{c.seo_score ?? '—'}</span></td>
                  <td className="muted">{new Date(c.updated_at).toLocaleString('vi-VN')}</td>
                  <td className="row">
                    <button className="btn btn-p btn-sm" onClick={() => decide(c.id, 'approved')}>Duyệt</button>
                    <button className="btn btn-d btn-sm" onClick={() => decide(c.id, 'rejected')}>Trả lại</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
