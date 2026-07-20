'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header({ role }: { role: string }) {
  const path = usePathname();
  const router = useRouter();
  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }
  return (
    <header className="top">
      <div className="brand"><span className="logo">V</span> VietCMS</div>
      <nav className="row" style={{ gap: 4 }}>
        <Link className={'navlink' + (path.startsWith('/content') ? ' on' : '')} href="/content">Nội dung</Link>
        <Link className={'navlink' + (path.startsWith('/approvals') ? ' on' : '')} href="/approvals">Chờ duyệt</Link>
      </nav>
      <span className="who">Vai trò: <b>{role || '—'}</b></span>
      <button className="btn btn-g" onClick={logout}>Đăng xuất</button>
    </header>
  );
}
