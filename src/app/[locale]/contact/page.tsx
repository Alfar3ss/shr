import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { alternates } from '@/lib/seo';
import { SITE } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('contactTitle'), alternates: alternates(locale, '/contact') };
}

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  return (
    <div className="mx-auto grid max-w-page gap-10 px-4 py-12 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="mt-3 text-gray-700">{t('text')}</p>
        <ul className="mt-6 space-y-4 text-sm">
          <li className="flex items-center gap-3"><Phone size={18} className="text-brand-dark" /> <a href={`tel:${SITE.phone}`} className="font-semibold">{SITE.phoneDisplay}</a></li>
          <li className="flex items-center gap-3"><MessageCircle size={18} className="text-brand-dark" /> <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="font-semibold">{t('whatsapp')}</a></li>
          <li className="flex items-center gap-3"><Mail size={18} className="text-brand-dark" /> <a href={`mailto:${SITE.email}`} className="font-semibold">{SITE.email}</a></li>
          <li className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 text-brand-dark" /> <span className="font-semibold">{SITE.address}</span></li>
        </ul>
      </div>
      <ContactForm />
    </div>
  );
}
