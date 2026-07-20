'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const ICONS: Record<string, React.ReactNode> = {
  home: <path d="M3 12l9-9 9 9M5 10v10h14V10" />,
  doc: <><path d="M4 4h16v16H4z" /><path d="M8 9h8M8 13h8M8 17h5" /></>,
  check: <path d="M20 6L9 17l-5-5" />,
  seo: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></>,
  rocket: <path d="M12 19V5M5 12l7-7 7 7" />,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>,
};
function Icon({ k }: { k: string }) {
  return <svg viewBox="0 0 24 24">{ICONS[k]}</svg>;
}

export default function Sidebar({ role }: { role: string }) {
  const path = usePathname();
  const router = useRouter();
  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }
  const initial = (role || 'U').charAt(0).toUpperCase();
  return (
    <aside className="side">
      <div className="brand">
        <span className="logo"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M4 5l8 14 8-14" /></svg></span>
        VietCMS
      </div>
      <div className="switch"><span className="g">✓</span> Site A <span className="chev">▾</span></div>
      <nav className="nav">
        <Link className={path.startsWith('/content') ? 'active' : ''} href="/content"><Icon k="doc" /> Nội dung</Link>
        <Link className={path.startsWith('/approvals') ? 'active' : ''} href="/approvals"><Icon k="check" /> Chờ duyệt</Link>
        <div className="sep" />
        <a className="disabled"><Icon k="seo" /> SEO &amp; Hiệu năng</a>
        <a className="disabled"><Icon k="rocket" /> Xuất bản</a>
        <a className="disabled"><Icon k="gear" /> Cài đặt</a>
      </nav>
      <div className="userchip">
        <span className="av">{initial}</span>
        <div><div className="nm">{role || '—'}</div><div className="rl">Tenant A</div></div>
        <button onClick={logout}>Đăng xuất</button>
      </div>
    </aside>
  );
}
