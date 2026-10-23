import { MessageCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { SITE } from '@/lib/site';

export default async function WhatsAppButton() {
  const t = await getTranslations('contact');
  return (
    <a
      href={`https://wa.me/${SITE.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp')}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle size={22} />
      <span className="hidden sm:inline">{t('whatsapp')}</span>
    </a>
  );
}
