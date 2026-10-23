import 'server-only';
import { createAdminClient } from './supabase/admin';
import type { Car } from './cars';

export const DAY_MS = 24 * 60 * 60 * 1000;

export function rentalDays(pickup: Date, ret: Date) {
  const diff = ret.getTime() - pickup.getTime();
  return Math.max(1, Math.ceil(diff / DAY_MS));
}

export function quote(car: Car, pickup: Date, ret: Date) {
  const days = rentalDays(pickup, ret);
  return { days, perDay: car.pricePerDay, total: Math.round(days * car.pricePerDay * 100) / 100 };
}

/** Units of a car already booked (pending/confirmed) that overlap the requested period. */
export async function bookedUnits(slug: string, pickup: Date, ret: Date): Promise<number> {
  const sb = createAdminClient();
  if (!sb) return 0;
  const { count } = await sb
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('car_slug', slug)
    .in('status', ['pending', 'confirmed'])
    .lt('pickup_at', ret.toISOString())
    .gt('return_at', pickup.toISOString());
  return count ?? 0;
}

export async function isAvailable(car: Car, pickup: Date, ret: Date) {
  return (await bookedUnits(car.slug, pickup, ret)) < car.units;
}

/** Parse "YYYY-MM-DD" + "HH:mm" into a Date (Morocco time, UTC+1, treated as UTC+1 offset). */
export function parseLocal(date: string | undefined, time: string | undefined): Date | null {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const t = time && /^\d{2}:\d{2}$/.test(time) ? time : '10:00';
  const d = new Date(`${date}T${t}:00+01:00`);
  return isNaN(d.getTime()) ? null : d;
}
