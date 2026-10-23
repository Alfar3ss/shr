import { getTranslations } from 'next-intl/server';
import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { CITIES } from '@/lib/places';
import { SITE } from '@/lib/site';

export default async function Footer() {
  const t = await getTranslations('footer');
  const n = await getTranslations('nav');
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#1e252d] text-white">
      <div className="mx-auto grid max-w-page gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h6 className="mb-4 text-sm font-bold tracking-wider">{t('aboutTitle')}</h6>
          <p className="text-sm leading-relaxed text-white/70">{t('aboutText')}</p>
          <div className="mt-4 flex gap-3">
            <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-brand hover:text-white"><Facebook size={20} /></a>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-brand hover:text-white"><Instagram size={20} /></a>
          </div>
        </div>
        <div>
          <h6 className="mb-4 text-sm font-bold tracking-wider">{t('essential')}</h6>
          <ul className="space-y-2 text-sm text-brand">
            <li><Link href="/">{n('home')}</Link></li>
            <li><Link href="/our-cars">{n('cars')}</Link></li>
            <li><Link href="/blog">{n('blog')}</Link></li>
            <li><Link href="/rental-conditions">{n('conditions')}</Link></li>
            <li><Link href="/contact">{n('contact')}</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="mb-4 text-sm font-bold tracking-wider">{t('agency')}</h6>
          <ul className="space-y-3 text-sm text-brand">
            <li className="flex items-center gap-2"><Phone size={16} /><a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a></li>
            <li className="flex items-center gap-2"><Mail size={16} /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /><span>{SITE.address}</span></li>
          </ul>
        </div>
        <div>
          <h6 className="mb-4 text-sm font-bold tracking-wider">{t('locations')}</h6>
          <ul className="space-y-2 text-sm text-brand">
            {CITIES.map((c) => (
              <li key={c.slug}><Link href={{ pathname: '/car-rental/[city]', params: { city: c.slug } }}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-ink-footer">
        <div className="mx-auto flex max-w-page flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-white/70 sm:flex-row">
          <p>© {year} {SITE.name} — {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
