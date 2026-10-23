import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import BookingsTable, { type BookingRow } from '../../BookingsTable';

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const sb = createAdminClient();
  if (!sb) return <p>Supabase is not configured.</p>;
  let q = sb.from('bookings').select('*, customers(name,email,phone)').order('pickup_at', { ascending: false }).limit(300);
  if (status) q = q.eq('status', status);
  const { data } = await q;
  const tabs = ['', 'confirmed', 'completed', 'cancelled'];
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <Link href="/admin/bookings/new" className="btn-brand">+ New booking (phone / WhatsApp)</Link>
      </div>
      <div className="flex gap-2 text-sm">
        {tabs.map((t) => (
          <Link key={t} href={t ? `/admin/bookings?status=${t}` : '/admin/bookings'} className={`rounded-full px-3 py-1 ${(status ?? '') === t ? 'bg-ink text-white' : 'bg-white'}`}>{t || 'all'}</Link>
        ))}
      </div>
      <BookingsTable rows={(data ?? []) as BookingRow[]} />
    </div>
  );
}
