'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('contact');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(f.entries())),
      });
      setState(res.ok ? 'sent' : 'error');
      if (res.ok) e.currentTarget.reset();
    } catch { setState('error'); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-md bg-white p-6 shadow-sm">
      <div><label htmlFor="c-name" className="mb-1 block text-xs font-semibold text-gray-600">{t('name')}</label><input id="c-name" name="name" required className="field" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="c-email" className="mb-1 block text-xs font-semibold text-gray-600">{t('email')}</label><input id="c-email" name="email" type="email" required className="field" /></div>
        <div><label htmlFor="c-phone" className="mb-1 block text-xs font-semibold text-gray-600">{t('phone')}</label><input id="c-phone" name="phone" type="tel" className="field" /></div>
      </div>
      <div><label htmlFor="c-msg" className="mb-1 block text-xs font-semibold text-gray-600">{t('message')}</label><textarea id="c-msg" name="message" rows={5} required className="w-full rounded-[3px] border border-gray-300 p-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30" /></div>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state === 'sent' && <p role="status" className="text-sm font-semibold text-[#398c28]">{t('sent')}</p>}
      {state === 'error' && <p role="alert" className="text-sm font-semibold text-red-600">{t('error')}</p>}
      <button type="submit" disabled={state === 'sending'} className="btn-brand w-full disabled:opacity-60">{t('send')}</button>
    </form>
  );
}
