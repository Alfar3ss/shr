import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import BookingForm from '@/components/BookingForm';
import { Price } from '@/components/CurrencyProvider';
import { getCar } from '@/lib/cars';
import { isAvailable, parseLocal, quote } from '@/lib/booking';
import { placeLabel } from '@/lib/places';

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function BookPage({ params, searchParams }: { params: Promise<{ locale: string; slug: string }>; searchParams: Promise<SP> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const car = await getCar(slug);
  if (!car || !car.active) notFound();
  const t = await getTranslations();

  const place = one(sp.place) ?? 'marrakech';
  const returnPlace = one(sp.returnPlace) ?? place;
  const pickup = one(sp.pickup);
  const ret = one(sp.ret);
  const pickupTime = one(sp.pickupTime) ?? '10:00';
  const retTime = one(sp.retTime) ?? '10:00';
  const start = parseLocal(pickup, pickupTime);
  const end = parseLocal(ret, retTime);

  if (!start || !end || end <= start) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-lg font-semibold">{t('book.datesMissing')}</p>
        <Link href={{ pathname: '/car/[slug]', params: { slug } }} className="btn-brand mt-6">{car.name}</Link>
      </div>
    );
  }

  const q = quote(car, start, end);
  const free = await isAvailable(car, start, end);

  return (
    <div className="mx-auto grid max-w-page gap-8 px-4 py-10 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <h1 className="text-3xl font-bold">{t('book.title')}</h1>
        {!free ? (
          <div className="mt-6 rounded-md bg-white p-8">
            <p className="font-bold text-red-600">{t('detail.notAvailable')}</p>
            <Link href="/our-cars" className="btn-brand mt-5">{t('cars.allCars')}</Link>
          </div>
        ) : (
          <BookingForm
            locale={locale}
            payload={{ slug, place, returnPlace, pickup: pickup!, pickupTime, ret: ret!, retTime }}
          />
        )}
      </div>

      <aside className="h-fit rounded-md bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <h2 className="mb-4 text-lg font-bold">{t('book.summary')}</h2>
        <Image src={car.image} alt={car.name} width={360} height={240} sizes="360px" className="mx-auto h-auto w-full max-w-[260px] object-contain" />
        <p className="mt-3 text-center font-bold uppercase text-[#4d626e]">{car.name}</p>
        <dl className="mt-4 space-y-2 border-t pt-4 text-sm">
          <div><dt className="text-gray-500">{t('cars.pickup')}</dt><dd className="font-semibold">{pickup} {pickupTime} — {placeLabel(place)}</dd></div>
          <div><dt className="text-gray-500">{t('cars.dropoff')}</dt><dd className="font-semibold">{ret} {retTime} — {placeLabel(returnPlace)}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">{t('cars.duration', { n: q.days })}</dt><dd><Price eur={q.perDay} /> {t('common.perDay')}</dd></div>
          <div className="flex justify-between border-t pt-3 text-base font-bold"><dt>{t('common.total')}</dt><dd><Price eur={q.total} /></dd></div>
        </dl>
        <p className="mt-4 rounded-[3px] bg-[#cdebf1] p-3 text-xs text-[#285767]">{t('book.payNote')} · {t('detail.deposit')}: €{car.deposit.toFixed(2)}</p>
      </aside>
    </div>
  );
}
