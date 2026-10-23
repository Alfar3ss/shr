import { getTranslations } from 'next-intl/server';
import { Star } from 'lucide-react';
import { REVIEWS } from '@/lib/reviews';
import { SITE } from '@/lib/site';

const Stars = () => (
  <span className="flex gap-0.5 text-[#fbbc04]" aria-label="5 stars">
    {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={16} fill="currentColor" />)}
  </span>
);

export default async function Reviews() {
  const t = await getTranslations('home');
  return (
    <section className="bg-white py-16" aria-labelledby="reviews-title">
      <div className="mx-auto max-w-page px-4">
        <p className="text-center text-xs font-bold tracking-[0.2em] text-brand-dark">{t('reviewsKicker')}</p>
        <h2 id="reviews-title" className="mt-2 text-center text-3xl font-bold">{t('reviewsTitle')}</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-gray-600">{t('reviewsText')}</p>
        <div className="mx-auto mt-6 flex w-fit flex-wrap items-center justify-center gap-4 rounded-full border border-gray-200 px-6 py-3">
          <span className="text-lg font-bold">G <span className="text-sm font-semibold text-gray-600">Google Reviews</span></span>
          <span className="text-2xl font-bold">{SITE.rating.toFixed(1)}</span>
          <Stars />
          <span className="text-sm text-gray-600">{t('reviewsCount', { count: SITE.reviewCount })}</span>
          <a href={SITE.googleMaps} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#2877df] hover:underline">{t('reviewsCta')} ↗</a>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="flex flex-col rounded-lg border border-gray-200 bg-[#fafafa] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-soft text-sm font-bold text-white">{r.initials}</span>
                <div>
                  <figcaption className="font-semibold">{r.name}</figcaption>
                  <p className="text-xs text-gray-500">Google · {r.date}</p>
                </div>
              </div>
              <div className="mt-3"><Stars /></div>
              <blockquote className="mt-3 text-sm leading-relaxed text-gray-700">{r.text}</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
