// Mẫu tích hợp FE — form đăng nhập. Áp design system Blue ở bản hi-fi.
import React, { useState } from 'react';
import { api, ApiError } from './api-client';

export function LoginForm({ onLoggedIn }: { onLoggedIn: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { access_token } = await api.login(email, password);
      onLoggedIn(access_token);
    } catch (err) {
      // Hiển thị thông báo CHUNG từ server (không lộ user tồn tại hay không)
      setError(err instanceof ApiError ? (err.problem.detail || err.problem.title) : 'Đã có lỗi.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" autoComplete="email"
        value={email} onChange={(e) => setEmail(e.target.value)} required />

      <label htmlFor="password">Mật khẩu</label>
      <input id="password" type="password" autoComplete="current-password"
        value={password} onChange={(e) => setPassword(e.target.value)} required />

      {error && <div role="alert">{error}</div>}
      <button type="submit" disabled={busy}>{busy ? 'Đang đăng nhập…' : 'Đăng nhập'}</button>
    </form>
  );
}
