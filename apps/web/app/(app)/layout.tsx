import { cookies } from 'next/headers';
import Sidebar from './Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const role = cookies().get('role')?.value || '';
  return (
    <div className="app">
      <Sidebar role={role} />
      <main className="main">{children}</main>
    </div>
  );
}
