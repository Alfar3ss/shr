import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import SearchForm from '@/components/SearchForm';
import CarCard from '@/components/CarCard';
import JsonLd from '@/components/JsonLd';
import { getCars } from '@/lib/cars';
import { CITIES, cityBySlug } from '@/lib/places';
import { alternates } from '@/lib/seo';
import { routing } from '@/i18n/routing';
import { SITE } from '@/lib/site';

export const revalidate = 600;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => CITIES.map((c) => ({ locale, city: c.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; city: string }> }): Promise<Metadata> {
  const { locale, city: slug } = await params;
  const city = cityBySlug(slug);
  if (!city) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('cityTitle', { city: city.name }), description: t('cityDesc', { city: city.name }),
    alternates: alternates(locale, { pathname: '/car-rental/[city]', params: { city: slug } }),
    openGraph: { images: [city.image] },
  };
}

export default async function CityPage({ params }: { params: Promise<{ locale: string; city: string }> }) {
  const { locale, city: slug } = await params;
  setRequestLocale(locale);
  const city = cityBySlug(slug);
  if (!city) notFound();
  const t = await getTranslations('city');
  const cars = (await getCars()).slice(0, 6);

  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'AutoRental', name: `${SITE.name} — ${city.name}`,
        areaServed: city.name, telephone: SITE.phoneDisplay, image: city.image, url: SITE.url,
      }} />
      <section className="relative isolate">
        <Image src={city.image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <div className="mx-auto max-w-page px-4 py-16 text-center text-white sm:py-20">
          <h1 className="text-3xl font-bold sm:text-5xl">{t('title', { city: city.name })}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">{t('text', { city: city.name })}</p>
          <div className="mx-auto mt-8 max-w-6xl text-left"><SearchForm initial={{ place: slug }} /></div>
        </div>
      </section>
      <div className="mx-auto max-w-page space-y-6 px-4 py-12">
        <h2 className="text-2xl font-bold">{t('fleet', { city: city.name })}</h2>
        {cars.map((c) => <CarCard key={c.slug} car={c} />)}
      </div>
    </>
  );
}
