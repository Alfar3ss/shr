import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Check } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import SearchForm from '@/components/SearchForm';
import JsonLd from '@/components/JsonLd';
import { Price } from '@/components/CurrencyProvider';
import { getCar, getCars } from '@/lib/cars';
import { alternates, urlFor } from '@/lib/seo';
import { SITE } from '@/lib/site';
import CarCard from '@/components/CarCard';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const car = await getCar(slug);
  if (!car) return {};
  const t = await getTranslations({ locale, namespace: 'common' });
  const d = await getTranslations({ locale, namespace: 'carDesc' });
  const title = `${car.name} — ${t('startingFrom')} €${car.pricePerDay} ${t('perDay')} | ${SITE.name}`;
  return {
    title, description: d(car.category),
    alternates: alternates(locale, { pathname: '/car/[slug]', params: { slug } }),
    openGraph: { title, description: d(car.category), images: [car.image] },
  };
}

export default async function CarPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const car = await getCar(slug);
  if (!car || !car.active) notFound();
  const t = await getTranslations();
  const included = t.raw('included') as string[];
  const others = (await getCars()).filter((c) => c.slug !== car.slug && c.category === car.category).slice(0, 2);

  return (
    <div className="mx-auto max-w-page px-4 py-10">
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'Product', name: car.name, image: car.image,
        description: t(`carDesc.${car.category}`), brand: { '@type': 'Brand', name: SITE.name },
        offers: { '@type': 'Offer', priceCurrency: 'EUR', price: car.pricePerDay, availability: 'https://schema.org/InStock', url: urlFor(locale, { pathname: '/car/[slug]', params: { slug } }) },
      }} />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-md bg-white p-6">
          <Image src={car.image} alt={car.name} width={720} height={480} priority sizes="(max-width:1024px) 100vw, 50vw" className="mx-auto h-auto w-full max-w-[560px] object-contain" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">{t(`cat.${car.category}`)}</p>
          <h1 className="mt-1 text-3xl font-bold">{car.name}</h1>
          <p className="text-sm text-[#91a5af]">{t('common.orSimilar')}</p>
          <p className="mt-4 leading-relaxed text-gray-700">{t(`carDesc.${car.category}`)}</p>
          <p className="mt-5 flex items-baseline gap-2">
            <span className="text-sm uppercase tracking-wider text-gray-500">{t('common.startingFrom')}</span>
            <Price eur={car.pricePerDay} className="text-3xl font-bold" />
            <span className="text-gray-500">{t('common.perDay')}</span>
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {[
              [car.transmission === 'automatic' ? t('spec.automatic') : t('spec.manual'), ''],
              [car.fuel === 'diesel' ? t('spec.diesel') : t('spec.petrol'), ''],
              [t('spec.seats', { n: car.seats }), ''],
              [t('spec.ac'), ''],
            ].map(([v], i) => <div key={i} className="chip">{v}</div>)}
          </dl>
          <ul className="mt-6 space-y-1.5 text-sm font-medium text-[#398c28]">
            {included.map((i) => <li key={i} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0" /> {i}</li>)}
          </ul>
          <div className="mt-5 rounded-[3px] bg-[#cdebf1] p-4 text-sm text-[#285767]">
            <p><strong>{t('detail.deposit')}: €{car.deposit.toFixed(2)}</strong> — {t('deposit.text')}</p>
            <p className="mt-1">{t('deposit.cards')}</p>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-bold">{t('detail.selectDates')}</h2>
        <SearchForm mode="car" carSlug={car.slug} compact />
      </section>

      {others.length > 0 && (
        <section className="mt-12 space-y-6">
          <h2 className="text-xl font-bold">{t('detail.similar')}</h2>
          {others.map((c) => <CarCard key={c.slug} car={c} />)}
        </section>
      )}
    </div>
  );
}
