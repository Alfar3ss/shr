import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import SearchForm from '@/components/SearchForm';
import CarCard, { type CardQuote } from '@/components/CarCard';
import { getCars } from '@/lib/cars';
import { isAvailable, parseLocal, quote } from '@/lib/booking';
import { alternates } from '@/lib/seo';

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export async function generateMetadata({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<SP> }): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const hasSearch = Boolean(one(sp.pickup) || one(sp.category));
  return {
    title: t('carsTitle'), description: t('carsDesc'),
    alternates: alternates(locale, '/our-cars'),
    robots: hasSearch ? { index: false, follow: true } : undefined, // search result URLs are not indexed
  };
}

export default async function OurCars({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<SP> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations('cars');
  const cat = await getTranslations('cat');

  const category = one(sp.category) ?? '';
  const place = one(sp.place) ?? 'marrakech';
  const returnPlace = one(sp.returnPlace) ?? place;
  const pickupDate = one(sp.pickup);
  const retDate = one(sp.ret);
  const pickupTime = one(sp.pickupTime) ?? '10:00';
  const retTime = one(sp.retTime) ?? '10:00';
  const start = parseLocal(pickupDate, pickupTime);
  const end = parseLocal(retDate, retTime);
  const hasDates = Boolean(start && end && end > start);

  let cars = await getCars();
  if (category) cars = cars.filter((c) => c.category === category);

  const rows = await Promise.all(
    cars.map(async (car) => {
      if (!hasDates) return { car, q: null as CardQuote, available: true };
      const [s, e] = [start!, end!];
      const q = quote(car, s, e);
      const available = await isAvailable(car, s, e);
      return {
        car,
        available,
        q: { ...q, query: { place, returnPlace, pickup: pickupDate!, pickupTime, ret: retDate!, retTime } } as CardQuote,
      };
    }),
  );
  const visible = hasDates ? rows.filter((r) => r.available) : rows;

  return (
    <div className="mx-auto max-w-page px-4 py-10">
      <h1 className="text-3xl font-bold">{category ? cat(category as '4x4') : t('title')}</h1>
      <p className="mt-2 text-gray-600">{t('intro')}</p>

      <div className="mt-6">
        <SearchForm compact initial={{ place, returnPlace, pickup: pickupDate, pickupTime, ret: retDate, retTime, category }} />
      </div>

      {hasDates && (
        <p className="mt-6 text-sm text-gray-600">
          {t('pickup')}: <strong>{pickupDate} {pickupTime}</strong> · {t('dropoff')}: <strong>{retDate} {retTime}</strong> ·{' '}
          <strong>{t('found', { n: visible.length })}</strong>
        </p>
      )}

      <div className="mt-6 space-y-6">
        {visible.length === 0 ? (
          <div className="rounded-md bg-white p-10 text-center">
            <p className="text-xl font-bold">{t('noneTitle')}</p>
            <p className="mt-2 text-gray-600">{t('noneText')}</p>
          </div>
        ) : (
          visible.map((r, i) => <CarCard key={r.car.slug} car={r.car} quote={r.q} available={r.available} priority={i === 0} />)
        )}
      </div>
    </div>
  );
}
