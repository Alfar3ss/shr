'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, Phone, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { CurrencySwitch } from './CurrencyProvider';
import LangSwitcher from './LangSwitcher';
import { IMG, SITE } from '@/lib/site';

export default function Header() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/' as const, label: t('home') },
    { href: { pathname: '/our-cars', query: { category: '4x4' } } as const, label: t('fourx4') },
    { href: { pathname: '/our-cars', query: { category: 'midrange' } } as const, label: t('luxury') },
    { href: { pathname: '/our-cars', query: { category: 'citadine' } } as const, label: t('citadine') },
    { href: '/gallery' as const, label: t('gallery') },
    { href: '/contact' as const, label: t('contact') },
    { href: '/about' as const, label: t('about') },
  ];
  return (
    <header className="sticky top-0 z-40 bg-ink-header text-white shadow-md">
      <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-4 py-2">
        <Link href="/" aria-label={SITE.name} className="shrink-0">
          <Image src={IMG.logo} alt={SITE.name} width={126} height={60} priority className="h-[52px] w-auto" />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {links.map((l, i) => (
            <Link key={i} href={l.href} className="text-[13px] font-semibold tracking-wide text-white/90 transition-colors hover:text-brand">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 text-sm font-semibold hover:text-brand">
            <Phone size={16} className="text-brand" /> {SITE.phoneDisplay}
          </a>
          <CurrencySwitch />
          <LangSwitcher />
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label={t('menu')} aria-expanded={open}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-ink-header px-4 pb-4 lg:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((l, i) => (
              <Link key={i} href={l.href} onClick={() => setOpen(false)} className="border-b border-white/10 py-3 text-sm font-semibold">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 text-sm font-semibold"><Phone size={16} className="text-brand" /> {SITE.phoneDisplay}</a>
            <CurrencySwitch />
            <LangSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
