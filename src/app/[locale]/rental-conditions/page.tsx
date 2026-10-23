import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Check } from 'lucide-react';
import { alternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('conditionsTitle'), alternates: alternates(locale, '/rental-conditions') };
}

export default async function Conditions({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('conditions');
  const items = t.raw('items') as string[];
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <ul className="mt-6 space-y-3 rounded-md bg-white p-6">
        {items.map((i) => <li key={i} className="flex gap-3 text-gray-700"><Check size={18} className="mt-0.5 shrink-0 text-[#398c28]" /> {i}</li>)}
      </ul>
    </div>
  );
}
