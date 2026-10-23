import { routing, type Locale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { SITE } from './site';

type Href = Parameters<typeof getPathname>[0]['href'];

export function urlFor(locale: string, href: Href) {
  return SITE.url.replace(/\/$/, '') + getPathname({ locale: locale as Locale, href });
}

/** canonical + hreflang alternates for a page that exists in every language */
export function alternates(locale: string, href: Href) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = urlFor(l, href);
  languages['x-default'] = urlFor(routing.defaultLocale, href);
  return { canonical: urlFor(locale, href), languages };
}
