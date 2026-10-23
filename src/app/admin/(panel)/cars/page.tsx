import { getCars } from '@/lib/cars';
import { createAdminClient } from '@/lib/supabase/admin';
import { updateCar } from '../../actions';

export default async function CarsAdmin() {
  const cars = await getCars({ includeInactive: true });
  const fromDb = Boolean(createAdminClient());
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Cars & prices</h1>
      {!fromDb && <p className="rounded bg-yellow-50 p-3 text-sm text-yellow-800">Supabase is not configured: showing the built-in list (read-only).</p>}
      <p className="text-sm text-gray-600">Prices are per day in EUR. “Units” = how many identical cars you own (used for availability).</p>
      <div className="space-y-3">
        {cars.map((c) => (
          <form key={c.slug} action={updateCar} className="grid items-end gap-3 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-[1.6fr_1fr_1fr_0.7fr_auto_auto]">
            <input type="hidden" name="slug" value={c.slug} />
            <div><p className="font-semibold">{c.name}</p><p className="text-xs text-gray-500">{c.category} · {c.transmission} · {c.fuel}</p></div>
            <label className="text-xs font-semibold">€/day<input name="price_per_day" type="number" step="0.01" defaultValue={c.pricePerDay} className="field mt-1" /></label>
            <label className="text-xs font-semibold">Deposit €<input name="deposit" type="number" step="1" defaultValue={c.deposit} className="field mt-1" /></label>
            <label className="text-xs font-semibold">Units<input name="units" type="number" min={1} defaultValue={c.units} className="field mt-1" /></label>
            <label className="flex items-center gap-2 pb-3 text-sm"><input type="checkbox" name="active" defaultChecked={c.active} /> Active</label>
            <button disabled={!fromDb} className="btn-brand h-11 disabled:opacity-50">Save</button>
          </form>
        ))}
      </div>
    </div>
  );
}
