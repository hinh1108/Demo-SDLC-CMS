'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('ngoc@a.vn');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((data && data.detail) || 'Đăng nhập thất bại');
      router.replace('/content');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20, background: 'linear-gradient(135deg,#EFF5FF,#F8FAFC 60%)' }}>
      <form className="card" style={{ width: '100%', maxWidth: 400, padding: 32 }} onSubmit={submit} noValidate>
        <div className="row">
          <span className="logo" style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 20 }}>V</span>
          <div><div style={{ fontWeight: 700, fontSize: 18 }}>VietCMS</div><div className="muted">Đăng nhập quản trị</div></div>
        </div>
        <label className="lbl" htmlFor="email">Email</label>
        <input id="email" className="f" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="lbl" htmlFor="pw">Mật khẩu</label>
        <input id="pw" className="f" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div style={{ color: 'var(--err)', fontSize: 13, marginTop: 12, fontWeight: 500 }} role="alert">{error}</div>}
        <button className="btn btn-p" style={{ width: '100%', justifyContent: 'center', marginTop: 18 }} disabled={busy}>
          {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
        <div className="muted" style={{ marginTop: 14, lineHeight: 1.7 }}>
          Demo (mật khẩu <b>Password123!</b>): <b>ngoc@a.vn</b> (biên tập), <b>hai@a.vn</b> (duyệt), <b>cont@a.vn</b> (cộng tác), <b>ed@b.vn</b> (tenant B)
        </div>
      </form>
    </div>
  );
}
