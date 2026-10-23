import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { alternates } from '@/lib/seo';
import { IMG } from '@/lib/site';
import { CITIES } from '@/lib/places';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('galleryTitle'), alternates: alternates(locale, '/gallery') };
}

export default async function Gallery({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('nav');
  const images = [...IMG.gallery, ...CITIES.map((c) => c.image)];
  return (
    <div className="mx-auto max-w-page px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{t('gallery')}</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {images.map((src, i) => (
          <Image key={src} src={src} alt={`SHR Cars ${i + 1}`} width={570} height={480} sizes="(max-width:768px) 50vw, 25vw" className="aspect-[4/3] w-full rounded-md object-cover" />
        ))}
      </div>
    </div>
  );
}
