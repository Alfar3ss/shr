import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import JsonLd from '@/components/JsonLd';
import { getPost } from '@/lib/blog';
import { alternates, urlFor } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug, locale);
  if (!post) return {};
  return {
    title: `${post.title} | ${SITE.name}`, description: post.excerpt,
    alternates: alternates(locale, { pathname: '/blog/[slug]', params: { slug } }),
    openGraph: { title: post.title, description: post.excerpt, type: 'article', images: post.cover ? [post.cover] : undefined },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPost(slug, locale);
  if (!post) notFound();
  const t = await getTranslations('blog');
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.excerpt,
        datePublished: post.created_at, image: post.cover ?? undefined,
        author: { '@type': 'Organization', name: SITE.name },
        mainEntityOfPage: urlFor(locale, { pathname: '/blog/[slug]', params: { slug } }),
      }} />
      <Link href="/blog" className="text-sm font-semibold text-brand-dark hover:underline">← {t('back')}</Link>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{post.title}</h1>
      <p className="mt-2 text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      {post.cover && <Image src={post.cover} alt={post.title} width={900} height={600} priority sizes="(max-width:768px) 100vw, 768px" className="mt-6 h-auto w-full rounded-lg object-cover" />}
      <div className="prose-content mt-8 space-y-4 leading-relaxed text-gray-800 [&_a]:text-[#2877df] [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_img]:rounded-md">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
