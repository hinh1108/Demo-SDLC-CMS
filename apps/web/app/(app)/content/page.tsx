'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch, STATUS_LABEL } from '@/lib/api';

const SITE_A = 'aaaaaaaa-0000-0000-0000-000000000001';
interface Content { id: string; title: string; slug: string; status: string; seo_score: number | null; updated_at: string }

export default function ContentPage() {
  const [rows, setRows] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [kind, setKind] = useState('post');
  const [title, setTitle] = useState('');

  async function load() {
    setLoading(true); setErr(null);
    try { const r = await apiFetch<{ data: Content[] }>(`sites/${SITE_A}/contents?limit=50`); setRows(r.data); }
    catch (e) { setErr(e instanceof Error ? e.message : 'Lỗi'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    try { await apiFetch(`sites/${SITE_A}/contents`, { method: 'POST', body: JSON.stringify({ kind, title }) }); setTitle(''); load(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Lỗi'); }
  }

  return (
    <>
      <div className="head">
        <div><h1>Nội dung</h1><div className="sub">Tạo, soạn và quản lý trang &amp; bài viết</div></div>
      </div>

      <form className="panel" style={{ marginBottom: 18 }} onSubmit={create}>
        <div className="row">
          <select className="f" style={{ width: 130 }} value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="post">Bài viết</option><option value="page">Trang</option>
          </select>
          <input className="f" style={{ flex: 1, minWidth: 180 }} placeholder="Tiêu đề nội dung mới…" value={title} onChange={(e) => setTitle(e.target.value)} />
          <button className="btn btn-p">＋ Tạo</button>
        </div>
      </form>

      {err && <div style={{ color: 'var(--error)', marginBottom: 12 }}>{err}</div>}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Tiêu đề</th><th>Trạng thái</th><th>SEO</th><th>Cập nhật</th><th></th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="muted">Đang tải…</td></tr>
              : rows.length === 0 ? <tr><td colSpan={5} className="muted">Chưa có nội dung. Tạo bài mới ở trên.</td></tr>
                : rows.map((c) => (
                  <tr key={c.id}>
                    <td><b>{c.title}</b><div className="muted">/{c.slug}</div></td>
                    <td><span className={'badge b-' + c.status}><span className="dot" />{STATUS_LABEL[c.status] || c.status}</span></td>
                    <td><span className="seo">{c.seo_score ?? '—'}</span></td>
                    <td className="muted">{new Date(c.updated_at).toLocaleString('vi-VN')}</td>
                    <td><Link className="btn btn-s btn-sm" href={`/content/${c.id}`}>Xem</Link></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
