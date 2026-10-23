import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SearchForm from '@/components/SearchForm';
import CarCard from '@/components/CarCard';
import Reviews from '@/components/Reviews';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import { getCars } from '@/lib/cars';
import { getPosts } from '@/lib/blog';
import { CITIES } from '@/lib/places';
import { IMG, SITE } from '@/lib/site';
import { alternates } from '@/lib/seo';
import { MapPin, Wallet, Headset, CalendarCheck, Building2, ShieldCheck } from 'lucide-react';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('homeTitle'), description: t('homeDesc'),
    alternates: alternates(locale, '/'),
    openGraph: { title: t('homeTitle'), description: t('homeDesc'), images: [IMG.hero], locale },
  };
}

const ICONS = [MapPin, Wallet, Headset, CalendarCheck, Building2, ShieldCheck];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const hero = await getTranslations('hero');
  const common = await getTranslations('common');
  const features = t.raw('features') as { t: string; d: string }[];
  const sections = t.raw('sections') as { t: string; d: string }[];
  const [cars, posts] = await Promise.all([getCars(), getPosts(locale, 3)]);
  const featured = cars.filter((c) => c.category === '4x4').slice(0, 3);

  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'AutoRental', name: SITE.name, url: SITE.url,
        telephone: SITE.phoneDisplay, email: SITE.email, image: IMG.hero, priceRange: '€20 - €150',
        address: { '@type': 'PostalAddress', streetAddress: SITE.address, addressCountry: 'MA' },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: SITE.rating, reviewCount: SITE.reviewCount },
        sameAs: [SITE.facebook, SITE.instagram, SITE.googleMaps],
      }} />

      {/* HERO */}
      <section className="relative isolate">
        <Image src={IMG.hero} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="mx-auto max-w-page px-4 py-16 sm:py-24">
          <h1 className="mx-auto max-w-4xl text-center text-3xl font-bold leading-tight text-white sm:text-5xl">{hero('title')}</h1>
          <div className="mx-auto mt-10 max-w-6xl"><SearchForm /></div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto grid max-w-page items-center gap-10 px-4 py-16 md:grid-cols-2">
        <Image src={IMG.intro} alt={t('introTitle')} width={1024} height={768} sizes="(max-width:768px) 100vw, 50vw" className="h-auto w-full rounded-lg object-cover shadow-md" />
        <div>
          <h2 className="text-3xl font-bold">{t('introTitle')}</h2>
          <p className="mt-4 leading-relaxed text-gray-700">{t('introText')}</p>
          <Link href="/our-cars" className="btn-brand mt-6">{common('bookNow')}</Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-page gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = ICONS[i] ?? ShieldCheck;
            return (
              <div key={f.t} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/20 text-ink"><Icon size={24} /></span>
                <div>
                  <h3 className="font-bold">{f.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{f.d}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* THREE ADVENTURE BLOCKS */}
      <section className="mx-auto max-w-page space-y-10 px-4 py-16">
        {sections.map((s, i) => (
          <div key={s.t} className={`grid items-center gap-8 md:grid-cols-2 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
            <Image src={IMG.gallery[(i + 1) % IMG.gallery.length]} alt={s.t} width={570} height={480} sizes="(max-width:768px) 100vw, 50vw" className="h-72 w-full rounded-lg object-cover" />
            <div>
              <h2 className="text-2xl font-bold">{s.t}</h2>
              <p className="mt-3 leading-relaxed text-gray-700">{s.d}</p>
              <Link href="/our-cars" className="btn-outline mt-5">{common('book')}</Link>
            </div>
          </div>
        ))}
      </section>

      {/* FLEET */}
      <section className="bg-[#e7e7e7] py-16">
        <div className="mx-auto max-w-page space-y-6 px-4">
          <h2 className="text-center text-3xl font-bold">{t('carsTitle')}</h2>
          {featured.map((c, i) => <CarCard key={c.slug} car={c} priority={i === 0} />)}
          <div className="text-center"><Link href="/our-cars" className="btn-brand">{common('explore')}</Link></div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="mx-auto max-w-page px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">{t('galleryTitle')}</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {IMG.gallery.map((src, i) => (
            <Image key={src} src={src} alt={`${t('galleryTitle')} ${i + 1}`} width={570} height={480} sizes="(max-width:768px) 50vw, 20vw" className="aspect-[4/3] w-full rounded-md object-cover" />
          ))}
        </div>
      </section>

      {/* CITIES */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-page px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">{t('citiesTitle')}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {CITIES.map((c) => (
              <Link key={c.slug} href={{ pathname: '/car-rental/[city]', params: { city: c.slug } }} className="group relative block overflow-hidden rounded-lg">
                <Image src={c.image} alt={c.name} width={500} height={375} sizes="(max-width:768px) 50vw, 25vw" className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-sm font-bold text-white">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Reviews />

      {/* CTA */}
      <section className="bg-brand py-12 text-center">
        <p className="mx-auto max-w-2xl px-4 text-2xl font-bold text-ink">{t('ctaTitle')}</p>
        <Link href="/our-cars" className="mt-5 inline-flex rounded-[3px] bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-black">{common('explore')}</Link>
      </section>

      {/* HISTORY */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold">{t('historyTitle')}</h2>
        <p className="mt-4 leading-relaxed text-gray-700">{t('historyText')}</p>
        <Link href="/about" className="btn-outline mt-6">{t('aboutBtn')}</Link>
      </section>

      <Faq />

      {posts.length > 0 && (
        <section className="mx-auto max-w-page px-4 pb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">{t('blogTitle')}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} href={{ pathname: '/blog/[slug]', params: { slug: p.slug } }} className="group overflow-hidden rounded-lg bg-white shadow-sm">
                {p.cover && <Image src={p.cover} alt={p.title} width={350} height={263} sizes="(max-width:768px) 100vw, 33vw" className="aspect-[4/3] w-full object-cover" />}
                <div className="p-5">
                  <h3 className="font-bold group-hover:text-brand-dark">{p.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{new Date(p.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
