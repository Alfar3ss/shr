import { createAdminClient } from './supabase/admin';

export type Category = '4x4' | 'citadine' | 'midrange';
export type Car = {
  slug: string;
  name: string;
  category: Category;
  image: string;
  pricePerDay: number; // EUR
  deposit: number; // EUR
  transmission: 'manual' | 'automatic';
  fuel: 'diesel' | 'petrol';
  seats: number;
  ac: boolean;
  units: number;
  active: boolean;
};

const P = 'https://carrentmorocco.com/wp-content/plugins/vikrentcar/admin/resources';

// Source of truth for first launch. Once the `cars` table is filled (supabase/seed.sql),
// the admin panel edits that table and this list is only a fallback.
export const SEED_CARS: Car[] = [
  { slug: 'gwm-tank-300', name: '4x4 GWM Tank 300', category: '4x4', image: `${P}/tank_300_4x4.png`, pricePerDay: 95, deposit: 2000, transmission: 'automatic', fuel: 'petrol', seats: 5, ac: true, units: 1, active: true },
  { slug: 'toyota-hilux-double-cabine', name: '4x4 Toyota Hilux Double Cabine', category: '4x4', image: `${P}/qashqai1.jpg`, pricePerDay: 90, deposit: 2000, transmission: 'manual', fuel: 'diesel', seats: 5, ac: true, units: 1, active: true },
  { slug: 'toyota-land-cruiser-7-places', name: '4x4 Toyota Land Cruiser Auto 7 places', category: '4x4', image: `${P}/2toyota-cruiser.png`, pricePerDay: 105, deposit: 3000, transmission: 'automatic', fuel: 'diesel', seats: 7, ac: true, units: 1, active: true },
  { slug: 'hyundai-i10', name: 'Hyundai i10', category: 'citadine', image: `${P}/vthumb_i10.jpg`, pricePerDay: 20, deposit: 600, transmission: 'manual', fuel: 'petrol', seats: 5, ac: true, units: 2, active: true },
  { slug: 'peugeot-208', name: 'Peugeot 208', category: 'citadine', image: `${P}/vthumb_208.jpg`, pricePerDay: 22, deposit: 600, transmission: 'manual', fuel: 'diesel', seats: 5, ac: true, units: 2, active: true },
  { slug: 'peugeot-301', name: 'Peugeot 301', category: 'citadine', image: `${P}/vthumb_1untitled_design.png`, pricePerDay: 25, deposit: 600, transmission: 'manual', fuel: 'diesel', seats: 5, ac: true, units: 2, active: true },
  { slug: 'dacia-lodgy', name: 'Dacia Lodgy', category: 'citadine', image: `${P}/vthumb_1lodgy.jpg`, pricePerDay: 45, deposit: 1000, transmission: 'manual', fuel: 'diesel', seats: 7, ac: true, units: 1, active: true },
  { slug: 'kia-seltos', name: 'Kia Seltos', category: 'midrange', image: `${P}/vthumb_kia-seltos.jpg`, pricePerDay: 30, deposit: 1000, transmission: 'automatic', fuel: 'diesel', seats: 5, ac: true, units: 1, active: true },
  { slug: 'kia-sportage', name: 'Kia Sportage', category: 'midrange', image: `${P}/vthumb_sportage.jpg`, pricePerDay: 49, deposit: 1200, transmission: 'automatic', fuel: 'diesel', seats: 5, ac: true, units: 1, active: true },
  { slug: 'hyundai-tucson', name: 'Hyundai Tucson', category: 'midrange', image: `${P}/vthumb_1tucson.jpg`, pricePerDay: 50, deposit: 1200, transmission: 'automatic', fuel: 'diesel', seats: 5, ac: true, units: 1, active: true },
  { slug: 'volkswagen-t-roc', name: 'Volkswagen T-Roc', category: 'midrange', image: `${P}/vthumb_t-roc.jpg`, pricePerDay: 55, deposit: 1200, transmission: 'automatic', fuel: 'diesel', seats: 5, ac: true, units: 1, active: true },
];

type Row = {
  slug: string; name: string; category: Category; image: string; price_per_day: number; deposit: number;
  transmission: 'manual' | 'automatic'; fuel: 'diesel' | 'petrol'; seats: number; ac: boolean; units: number; active: boolean;
};

export async function getCars(opts: { includeInactive?: boolean } = {}): Promise<Car[]> {
  const sb = createAdminClient();
  if (sb) {
    const { data, error } = await sb.from('cars').select('*').order('price_per_day');
    if (!error && data && data.length) {
      const cars = (data as Row[]).map((r) => ({
        slug: r.slug, name: r.name, category: r.category, image: r.image, pricePerDay: Number(r.price_per_day),
        deposit: Number(r.deposit), transmission: r.transmission, fuel: r.fuel, seats: r.seats, ac: r.ac,
        units: r.units, active: r.active,
      }));
      return opts.includeInactive ? cars : cars.filter((c) => c.active);
    }
  }
  return SEED_CARS.filter((c) => opts.includeInactive || c.active);
}

export async function getCar(slug: string) {
  return (await getCars({ includeInactive: true })).find((c) => c.slug === slug) ?? null;
}
