import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getPosts } from '@/lib/blog';
import { alternates } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('blogTitle'), description: t('blogDesc'), alternates: alternates(locale, '/blog') };
}

export default async function BlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const posts = await getPosts(locale);
  return (
    <div className="mx-auto max-w-page px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{t('title')}</h1>
      {posts.length === 0 ? (
        <p className="text-gray-600">{t('empty')}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} href={{ pathname: '/blog/[slug]', params: { slug: p.slug } }} className="group overflow-hidden rounded-lg bg-white shadow-sm">
              {p.cover && <Image src={p.cover} alt={p.title} width={350} height={263} sizes="(max-width:768px) 100vw, 33vw" className="aspect-[4/3] w-full object-cover" />}
              <div className="p-5">
                <h2 className="font-bold group-hover:text-brand-dark">{p.title}</h2>
                <p className="mt-2 text-sm text-gray-600">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
