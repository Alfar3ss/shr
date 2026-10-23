import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Check, Droplet, Snowflake, User, GitFork } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Price } from './CurrencyProvider';
import type { Car } from '@/lib/cars';

export type CardQuote = { days: number; perDay: number; total: number; query: Record<string, string> } | null;

export default async function CarCard({ car, quote, available = true, priority }: { car: Car; quote?: CardQuote; available?: boolean; priority?: boolean }) {
  const t = await getTranslations();
  const detail = { pathname: '/car/[slug]', params: { slug: car.slug } } as const;
  const bookHref = quote
    ? ({ pathname: '/book/[slug]', params: { slug: car.slug }, query: quote.query } as const)
    : detail;
  const included = t.raw('included') as string[];
  const auto = car.transmission === 'automatic';

  return (
    <article className="grid gap-6 rounded-[3px] bg-white p-5 shadow-[0_1px_5px_rgba(0,0,0,.2)] sm:p-6 lg:grid-cols-[1fr_1.15fr_1.25fr] lg:gap-8">
      {/* image + name */}
      <div className="flex flex-col items-center justify-center text-center">
        <Link href={detail} className="block w-full">
          <Image src={car.image} alt={car.name} width={420} height={280} priority={priority} sizes="(max-width:1024px) 90vw, 30vw" className="mx-auto h-auto max-h-[210px] w-full max-w-[320px] object-contain" />
        </Link>
        <h3 className="mt-3 text-lg font-medium uppercase text-[#4d626e]">
          <Link href={detail}>{car.name}</Link>
        </h3>
        <p className="text-sm text-[#91a5af]">{t('common.orSimilar')}</p>
      </div>

      {/* chips + deposit */}
      <div>
        <div className="grid grid-cols-2 gap-3">
          <span className={auto ? 'chip !border-[#f0524f] !bg-[#f0524f] !text-white' : 'chip'}><GitFork size={15} /> {t(auto ? 'spec.automatic' : 'spec.manual')}</span>
          <span className="chip"><Droplet size={15} /> {t(car.fuel === 'diesel' ? 'spec.diesel' : 'spec.petrol')}</span>
          <span className="chip"><User size={15} /> {t('spec.seats', { n: car.seats })}</span>
          {car.ac && <span className="chip"><Snowflake size={15} /> {t('spec.ac')}</span>}
        </div>
        <ul className="mt-4 space-y-1 text-sm text-gray-600">
          <li><strong className="underline">{t('spec.fuelPolicy')}:</strong> {t('spec.fuelPolicyText')}</li>
          <li>{t('spec.minAge')}: {t('spec.minAgeText', { n: 21 })}</li>
        </ul>
        <div className="mt-4 rounded-[3px] bg-[#cdebf1] p-4 text-[13px] leading-relaxed text-[#285767]">
          <ul className="list-disc space-y-2 pl-5">
            <li><u>{t('deposit.title')}: €{car.deposit.toFixed(2)}</u> — {t('deposit.text')}</li>
            <li>{t('deposit.cards')}</li>
          </ul>
        </div>
      </div>

      {/* checklist + price */}
      <div className="flex flex-col lg:border-l lg:border-[#e2e7e9] lg:pl-6">
        <ul className="space-y-1.5 border-b border-[#ddd] pb-4 text-[13px] font-medium text-[#398c28]">
          {included.map((i) => (
            <li key={i} className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-[#3c9a1f]" /> {i}</li>
          ))}
        </ul>
        <div className="mt-4 text-center">
          {!quote && <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('common.startingFrom')}</p>}
          <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <p className="flex items-baseline gap-1.5">
              <Price eur={car.pricePerDay} className="text-3xl font-bold leading-none text-[#222]" />
              <span className="text-sm text-gray-500">{t('common.perDay')}</span>
            </p>
            {quote && (
              <p className="rounded-[3px] bg-[#f4f5f7] px-2.5 py-1 text-sm text-gray-500">
                {t('common.total')} ({quote.days} {quote.days > 1 ? t('common.days') : t('common.day')}): <Price eur={quote.total} className="font-semibold text-[#222]" />
              </p>
            )}
          </div>
        </div>
        {available ? (
          <Link href={bookHref} className="btn-brand mt-4 w-full">{t('common.bookNow')}</Link>
        ) : (
          <span className="mt-4 block rounded-[3px] bg-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-500">{t('cars.soldOut')}</span>
        )}
      </div>
    </article>
  );
}
