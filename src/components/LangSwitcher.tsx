'use client';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';

const LABEL: Record<string, string> = { en: 'EN', fr: 'FR', es: 'ES', de: 'DE', nl: 'NL', it: 'IT' };
const NAME: Record<string, string> = { en: 'English', fr: 'Français', es: 'Español', de: 'Deutsch', nl: 'Nederlands', it: 'Italiano' };

export default function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  return (
    <select
      aria-label="Language"
      value={locale}
      onChange={(e) => {
        const { locale: _l, ...rest } = params as Record<string, string>;
        // keep dynamic params (slug, code, city) when switching language
        router.replace({ pathname, params: rest } as never, { locale: e.target.value });
      }}
      className="rounded-[3px] border border-white/20 bg-transparent px-2 py-1 text-sm text-white outline-none"
    >
      {locales.map((l) => (
        <option key={l} value={l} className="text-black">{LABEL[l]} — {NAME[l]}</option>
      ))}
    </select>
  );
}
