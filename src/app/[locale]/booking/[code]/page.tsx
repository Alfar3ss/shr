import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCar } from '@/lib/cars';
import { placeLabel } from '@/lib/places';
import { Price } from '@/components/CurrencyProvider';

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function BookingPage({ params }: { params: Promise<{ locale: string; code: string }> }) {
  const { locale, code } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('confirm');
  const c = await getTranslations('cars');
  const sb = createAdminClient();
  const { data: b } = sb ? await sb.from('bookings').select('*').eq('code', code).maybeSingle() : { data: null };
  if (!b) {
    return <div className="mx-auto max-w-xl px-4 py-24 text-center"><p className="text-lg font-semibold">{t('notFound')}</p></div>;
  }
  const car = await getCar(b.car_slug);
  const fmt = (iso: string) => new Date(iso).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Casablanca' });
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <div className="rounded-md bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 text-[#398c28]"><CheckCircle2 size={32} /><h1 className="text-2xl font-bold">{t('title')}</h1></div>
        <p className="mt-3 text-gray-600">{t('text')}</p>
        <dl className="mt-6 divide-y text-sm">
          {[
            [t('orderNumber'), `#${b.id}`],
            [t('code'), b.code],
            [t('status'), t('statusConfirmed')],
            [car?.name ?? b.car_slug, ''],
            [c('pickup'), `${fmt(b.pickup_at)} — ${placeLabel(b.pickup_place)}`],
            [c('dropoff'), `${fmt(b.return_at)} — ${placeLabel(b.return_place)}`],
          ].map(([k, v], i) => (
            <div key={i} className="flex justify-between gap-4 py-3"><dt className="text-gray-500">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>
          ))}
          <div className="flex justify-between py-3 text-base"><dt className="font-bold">Total</dt><dd className="font-bold"><Price eur={Number(b.total)} /></dd></div>
        </dl>
        <Link href="/" className="btn-brand mt-6">{t('back')}</Link>
      </div>
    </div>
  );
}
