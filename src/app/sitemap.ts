import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { urlFor } from '@/lib/seo';
import { SEED_CARS, getCars } from '@/lib/cars';
import { CITIES } from '@/lib/places';
import { getPosts } from '@/lib/blog';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cars = (await getCars()).length ? await getCars() : SEED_CARS;
  const posts = await getPosts('en');
  const entries: MetadataRoute.Sitemap = [];

  const add = (href: Parameters<typeof urlFor>[1], priority: number) => {
    const languages: Record<string, string> = {};
    for (const l of routing.locales) languages[l] = urlFor(l, href);
    for (const l of routing.locales) entries.push({ url: urlFor(l, href), lastModified: new Date(), changeFrequency: 'weekly', priority, alternates: { languages } });
  };

  add('/', 1);
  add('/our-cars', 0.9);
  add('/about', 0.5);
  add('/contact', 0.5);
  add('/gallery', 0.4);
  add('/rental-conditions', 0.3);
  add('/blog', 0.6);
  cars.forEach((c) => add({ pathname: '/car/[slug]', params: { slug: c.slug } }, 0.8));
  CITIES.forEach((c) => add({ pathname: '/car-rental/[city]', params: { city: c.slug } }, 0.8));
  posts.forEach((p) => add({ pathname: '/blog/[slug]', params: { slug: p.slug } }, 0.6));
  return entries;
}
