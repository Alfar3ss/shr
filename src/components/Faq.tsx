import { getTranslations } from 'next-intl/server';
import { ChevronDown } from 'lucide-react';
import JsonLd from './JsonLd';

export default async function Faq() {
  const t = await getTranslations();
  const items = t.raw('faq') as { q: string; a: string }[];
  return (
    <section className="mx-auto max-w-3xl px-4 py-16" aria-labelledby="faq-title">
      <h2 id="faq-title" className="mb-8 text-center text-3xl font-bold">{t('home.faqTitle')}</h2>
      <div className="space-y-3">
        {items.map((it) => (
          <details key={it.q} className="group rounded-md border border-gray-200 bg-white px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
              {it.q}
              <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{it.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
      }} />
    </section>
  );
}
