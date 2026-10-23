import { setBookingStatus } from './actions';
import { placeLabel } from '@/lib/places';

export type BookingRow = {
  id: number; code: string; car_slug: string; status: string; pickup_at: string; return_at: string;
  pickup_place: string; return_place: string; days: number; total: number; notes: string | null; source: string;
  customers: { name: string; email: string | null; phone: string | null } | null;
};

const fmt = (iso: string) => new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Casablanca' });
const COLOR: Record<string, string> = { confirmed: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', cancelled: 'bg-red-100 text-red-800', completed: 'bg-gray-200 text-gray-700' };

export default function BookingsTable({ rows }: { rows: BookingRow[] }) {
  if (!rows.length) return <p className="rounded-lg bg-white p-6 text-gray-500">No bookings.</p>;
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
          <tr><th className="p-3">#</th><th className="p-3">Customer</th><th className="p-3">Car</th><th className="p-3">Pickup</th><th className="p-3">Return</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((b) => (
            <tr key={b.id} className="align-top">
              <td className="p-3 font-semibold">{b.id}<div className="text-xs font-normal text-gray-400">{b.source}</div></td>
              <td className="p-3">
                <div className="font-semibold">{b.customers?.name ?? '—'}</div>
                {b.customers?.phone && <a className="text-xs text-[#2877df]" href={`https://wa.me/${b.customers.phone.replace(/\D/g, '')}`} target="_blank">{b.customers.phone}</a>}
                {b.customers?.email && <div className="text-xs text-gray-500">{b.customers.email}</div>}
                {b.notes && <div className="mt-1 max-w-[220px] text-xs italic text-gray-500">{b.notes}</div>}
              </td>
              <td className="p-3">{b.car_slug}</td>
              <td className="p-3">{fmt(b.pickup_at)}<div className="text-xs text-gray-500">{placeLabel(b.pickup_place)}</div></td>
              <td className="p-3">{fmt(b.return_at)}<div className="text-xs text-gray-500">{placeLabel(b.return_place)}</div></td>
              <td className="p-3 font-semibold">€{Number(b.total).toFixed(2)}<div className="text-xs font-normal text-gray-500">{b.days} days</div></td>
              <td className="p-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${COLOR[b.status] ?? ''}`}>{b.status}</span></td>
              <td className="p-3">
                <form action={setBookingStatus} className="flex gap-1">
                  <input type="hidden" name="id" value={b.id} />
                  {['confirmed', 'completed', 'cancelled'].filter((s) => s !== b.status).map((s) => (
                    <button key={s} name="status" value={s} className="rounded border px-2 py-1 text-xs hover:bg-gray-100">{s}</button>
                  ))}
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
