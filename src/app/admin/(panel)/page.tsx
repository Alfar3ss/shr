import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import BookingsTable, { type BookingRow } from '../BookingsTable';

export default async function Dashboard() {
  const sb = createAdminClient();
  if (!sb) return <p>Supabase is not configured. See README.</p>;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const [{ count: upcoming }, { count: active }, { data: month }, { data: recent }] = await Promise.all([
    sb.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'confirmed').gt('pickup_at', now.toISOString()),
    sb.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'confirmed').lte('pickup_at', now.toISOString()).gte('return_at', now.toISOString()),
    sb.from('bookings').select('total').in('status', ['confirmed', 'completed']).gte('created_at', monthStart),
    sb.from('bookings').select('*, customers(name,email,phone)').order('created_at', { ascending: false }).limit(8),
  ]);
  const revenue = (month ?? []).reduce((s, r) => s + Number(r.total), 0);
  const stats = [
    ['Upcoming bookings', String(upcoming ?? 0)],
    ['Cars out right now', String(active ?? 0)],
    ['Booked this month (new)', `€${revenue.toFixed(0)}`],
  ];
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(([k, v]) => <div key={k} className="rounded-lg bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">{k}</p><p className="mt-1 text-3xl font-bold">{v}</p></div>)}
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">Latest bookings</h2><Link href="/admin/bookings" className="text-sm font-semibold text-[#2877df]">View all →</Link></div>
        <BookingsTable rows={(recent ?? []) as BookingRow[]} />
      </section>
    </div>
  );
}
