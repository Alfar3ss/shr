import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CalendarDays, Car, FileText, LayoutDashboard, LogOut, Users } from 'lucide-react';
import { getAdminUser } from '@/lib/supabase/server';
import { logout } from '../actions';

export const dynamic = 'force-dynamic';

const NAV = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', Icon: CalendarDays },
  { href: '/admin/clients', label: 'Clients', Icon: Users },
  { href: '/admin/cars', label: 'Cars & prices', Icon: Car },
  { href: '/admin/posts', label: 'Blog', Icon: FileText },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="bg-ink-header text-white md:w-60 md:shrink-0">
        <div className="p-5 text-lg font-bold">SHR <span className="text-brand">Admin</span></div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
          {NAV.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 whitespace-nowrap rounded px-3 py-2 text-sm hover:bg-white/10"><Icon size={18} /> {label}</Link>
          ))}
        </nav>
        <form action={logout} className="p-3 md:mt-auto">
          <p className="mb-2 truncate px-3 text-xs text-white/60">{user.email}</p>
          <button className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm hover:bg-white/10"><LogOut size={18} /> Log out</button>
        </form>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
