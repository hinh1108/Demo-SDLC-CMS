'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, getRole, STATUS_LABEL } from '@/lib/api';

interface Detail {
  id: string; title: string; slug: string; kind: string; status: string; seo_score: number | null;
  public_url?: string | null; current_version: { blocks: { type: string }[] } | null;
}
interface Seo { title: string | null; description: string | null; keywords: string | null; score: number | null }

export default function ContentDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const role = getRole();
  const [c, setC] = useState<Detail | null>(null);
  const [seo, setSeo] = useState<Seo>({ title: '', description: '', keywords: '', score: null });
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    try {
      const d = await apiFetch<Detail>(`contents/${id}`);
      setC(d);
      try {
        const s = await apiFetch<Seo>(`contents/${id}/seo`);
        setSeo({ title: s.title || '', description: s.description || '', keywords: s.keywords || '', score: s.score });
      } catch { /* chưa có seo */ }
    } catch (e) { setMsg(e instanceof Error ? e.message : 'Lỗi'); }
  }
  useEffect(() => { load(); }, [id]);

  async function act(fn: () => Promise<any>, okMsg: string) {
    try { await fn(); setMsg(okMsg); load(); } catch (e) { setMsg(e instanceof Error ? e.message : 'Lỗi'); }
  }
  const saveVersion = () => act(() => apiFetch(`contents/${id}/versions`, { method: 'POST', body: JSON.stringify({ blocks: [{ type: 'heading' }, { type: 'paragraph' }] }) }), 'Đã lưu version');
  const saveSeo = () => act(async () => {
    const r = await apiFetch<Seo>(`contents/${id}/seo`, { method: 'PUT', body: JSON.stringify({ ...seo, schema_json: { '@type': 'Article' } }) });
    setSeo((s) => ({ ...s, score: r.score }));
  }, 'Đã lưu SEO');
  const submit = () => act(() => apiFetch(`contents/${id}/submission`, { method: 'POST' }), 'Đã gửi duyệt');
  const publish = () => act(() => apiFetch(`contents/${id}/publication`, { method: 'POST', body: JSON.stringify({}) }), 'Đã xuất bản');
  const unpublish = () => act(() => apiFetch(`contents/${id}/publication`, { method: 'DELETE' }), 'Đã gỡ xuất bản');
  const decide = (result: 'approved' | 'rejected') => {
    let note: string | null = '';
    if (result === 'rejected') { note = prompt('Ghi chú khi trả lại:'); if (note === null) return; if (!note.trim()) return; }
    act(() => apiFetch(`contents/${id}/approvals`, { method: 'POST', body: JSON.stringify({ result, note }) }), result === 'approved' ? 'Đã duyệt' : 'Đã trả lại');
  };

  if (!c) return <div className="muted">{msg || 'Đang tải…'}</div>;
  const canApprove = ['manager', 'admin'].includes(role) && c.status === 'review';
  const canPublish = ['admin', 'editor'].includes(role);

  return (
    <div style={{ maxWidth: 640 }}>
      <button className="btn btn-g btn-sm" onClick={() => router.push('/content')}>← Danh sách</button>
      <h1 style={{ margin: '14px 0 6px', fontSize: 22 }}>{c.title}</h1>
      <div className="row"><span className={'badge b-' + c.status}><span className="dot" />{STATUS_LABEL[c.status] || c.status}</span>
        <span className="muted">/{c.slug} · {c.kind}</span></div>
      {msg && <div style={{ marginTop: 10, color: 'var(--p700)', fontWeight: 600 }}>{msg}</div>}

      <div className="card" style={{ padding: 18, marginTop: 16 }}>
        <div className="lbl" style={{ marginTop: 0 }}>Phiên bản hiện tại</div>
        <div className="muted">{c.current_version?.blocks?.length || 0} block {c.current_version?.blocks?.length ? '(' + c.current_version.blocks.map((b) => b.type).join(', ') + ')' : ''}</div>
        <button className="btn btn-g" style={{ marginTop: 8 }} onClick={saveVersion}>＋ Lưu version mẫu</button>
      </div>

      <div className="card" style={{ padding: 18, marginTop: 16 }}>
        <div className="lbl" style={{ marginTop: 0 }}>SEO · điểm: <b>{seo.score ?? '—'}</b>/100</div>
        <label className="lbl">Tiêu đề SEO</label>
        <input className="f" value={seo.title || ''} onChange={(e) => setSeo({ ...seo, title: e.target.value })} />
        <label className="lbl">Meta description</label>
        <textarea className="f" rows={2} value={seo.description || ''} onChange={(e) => setSeo({ ...seo, description: e.target.value })} />
        <label className="lbl">Từ khoá</label>
        <input className="f" value={seo.keywords || ''} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} />
        <button className="btn btn-p" style={{ marginTop: 12 }} onClick={saveSeo}>Lưu SEO</button>
      </div>

      <div className="card" style={{ padding: 18, marginTop: 16 }}>
        <div className="lbl" style={{ marginTop: 0 }}>Hành động</div>
        <div className="row">
          {c.status === 'draft' && <button className="btn btn-p" onClick={submit}>Gửi duyệt →</button>}
          {canApprove && <><button className="btn btn-p" onClick={() => decide('approved')}>✓ Duyệt</button>
            <button className="btn btn-d" onClick={() => decide('rejected')}>Trả lại</button></>}
          {canPublish && ['approved', 'published'].includes(c.status) && <button className="btn btn-p" onClick={publish}>🚀 Xuất bản</button>}
          {canPublish && ['published', 'scheduled'].includes(c.status) && <button className="btn btn-d" onClick={unpublish}>Gỡ xuất bản</button>}
        </div>
        {c.public_url && <div className="muted" style={{ marginTop: 10 }}>URL: <a href={c.public_url} target="_blank" rel="noreferrer">{c.public_url}</a></div>}
      </div>
    </div>
  );
}
