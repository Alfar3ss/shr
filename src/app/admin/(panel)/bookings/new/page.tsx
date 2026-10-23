import { getCars } from '@/lib/cars';
import { PLACES } from '@/lib/places';
import { createManualBooking } from '../../../actions';

export default async function NewBooking({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const cars = await getCars({ includeInactive: true });
  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold">New booking</h1>
      {error === 'dates' && <p className="rounded bg-red-50 p-3 text-sm text-red-700">Check the dates.</p>}
      {error === 'unavailable' && <p className="rounded bg-red-50 p-3 text-sm text-red-700">No unit of this car is free for those dates. Tick “force” to book anyway.</p>}
      <form action={createManualBooking} className="grid gap-4 rounded-lg bg-white p-6 shadow-sm sm:grid-cols-2">
        <label className="sm:col-span-2 text-xs font-semibold">Car
          <select name="car" className="field mt-1" required>{cars.map((c) => <option key={c.slug} value={c.slug}>{c.name} — €{c.pricePerDay}/day</option>)}</select>
        </label>
        <label className="text-xs font-semibold">Pickup date<input name="pickup" type="date" required className="field mt-1" /></label>
        <label className="text-xs font-semibold">Pickup time<input name="pickupTime" type="time" defaultValue="10:00" className="field mt-1" /></label>
        <label className="text-xs font-semibold">Return date<input name="ret" type="date" required className="field mt-1" /></label>
        <label className="text-xs font-semibold">Return time<input name="retTime" type="time" defaultValue="10:00" className="field mt-1" /></label>
        <label className="text-xs font-semibold">Pickup place<select name="place" className="field mt-1">{PLACES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}</select></label>
        <label className="text-xs font-semibold">Return place<select name="returnPlace" className="field mt-1">{PLACES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}</select></label>
        <label className="text-xs font-semibold">Customer name<input name="name" required className="field mt-1" /></label>
        <label className="text-xs font-semibold">Phone / WhatsApp<input name="phone" className="field mt-1" /></label>
        <label className="text-xs font-semibold">Email (optional)<input name="email" type="email" className="field mt-1" /></label>
        <label className="text-xs font-semibold">Total € (empty = automatic)<input name="total" type="number" step="0.01" className="field mt-1" /></label>
        <label className="sm:col-span-2 text-xs font-semibold">Notes<textarea name="notes" rows={3} className="mt-1 w-full rounded-[3px] border border-gray-300 p-3 text-sm" /></label>
        <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="force" /> Force booking even if the car is already taken</label>
        <button className="btn-brand sm:col-span-2">Save booking</button>
      </form>
    </div>
  );
}
