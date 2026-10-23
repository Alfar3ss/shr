import '@fontsource-variable/montserrat';
import '../globals.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { CurrencyProvider } from '@/components/CurrencyProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { SITE } from '@/lib/site';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: '%s' },
  applicationName: SITE.name,
  openGraph: { siteName: SITE.name, type: 'website' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as never)) notFound();
  setRequestLocale(locale);
  const all = await getMessages();
  // only ship what client components use
  const messages = Object.fromEntries(['nav', 'search', 'cat', 'book', 'contact'].map((k) => [k, (all as Record<string, unknown>)[k]])) as AbstractIntlMessages;
  return (
    <html lang={locale}>
      <body className="font-sans antialiased" style={{ fontFamily: "'Montserrat Variable', system-ui, sans-serif" }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CurrencyProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
