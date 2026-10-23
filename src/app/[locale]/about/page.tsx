import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { alternates } from '@/lib/seo';
import { IMG } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('aboutTitle'), alternates: alternates(locale, '/about') };
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const h = await getTranslations('home');
  return (
    <div className="mx-auto grid max-w-page items-center gap-10 px-4 py-14 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="mt-4 leading-relaxed text-gray-700">{t('text')}</p>
        <p className="mt-4 leading-relaxed text-gray-700">{h('historyText')}</p>
        <Link href="/our-cars" className="btn-brand mt-6">{h('carsTitle')}</Link>
      </div>
      <Image src={IMG.intro} alt={t('title')} width={1024} height={768} priority sizes="(max-width:768px) 100vw, 50vw" className="h-auto w-full rounded-lg object-cover shadow-md" />
    </div>
  );
}
