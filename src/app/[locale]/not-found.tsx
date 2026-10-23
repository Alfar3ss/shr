import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-xl font-semibold">{t('title')}</p>
      <p className="mt-2 text-gray-600">{t('text')}</p>
      <Link href="/" className="btn-brand mt-8">{t('home')}</Link>
    </div>
  );
}
