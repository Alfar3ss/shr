import { createAdminClient } from '@/lib/supabase/admin';

export default async function Clients() {
  const sb = createAdminClient();
  if (!sb) return <p>Supabase is not configured.</p>;
  const { data } = await sb.from('customers').select('*, bookings(id,total,status)').order('created_at', { ascending: false }).limit(500);
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Clients</h1>
      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-3">Name</th><th className="p-3">Contact</th><th className="p-3">Country</th><th className="p-3">Bookings</th><th className="p-3">Spent</th></tr></thead>
          <tbody className="divide-y">
            {(data ?? []).map((c) => {
              const b = (c.bookings ?? []) as { id: number; total: number; status: string }[];
              const spent = b.filter((x) => x.status !== 'cancelled').reduce((s, x) => s + Number(x.total), 0);
              return (
                <tr key={c.id}>
                  <td className="p-3 font-semibold">{c.name}</td>
                  <td className="p-3">
                    {c.phone && <a className="text-[#2877df]" href={`https://wa.me/${String(c.phone).replace(/\D/g, '')}`} target="_blank">{c.phone}</a>}
                    {c.email && <div className="text-xs text-gray-500">{c.email}</div>}
                  </td>
                  <td className="p-3">{c.country ?? '—'}</td>
                  <td className="p-3">{b.length}</td>
                  <td className="p-3">€{spent.toFixed(0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
