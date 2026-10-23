'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

type Payload = { slug: string; place: string; returnPlace: string; pickup: string; pickupTime: string; ret: string; retTime: string };

export default function BookingForm({ payload, locale }: { payload: Payload; locale: string }) {
  const t = useTranslations('book');
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = {
      ...payload, locale,
      name: String(f.get('name') ?? '').trim(), email: String(f.get('email') ?? '').trim(),
      phone: String(f.get('phone') ?? '').trim(), country: String(f.get('country') ?? '').trim(),
      notes: String(f.get('notes') ?? '').trim(), website: String(f.get('website') ?? ''), // honeypot
    };
    if (!body.name || !body.email || !body.phone) return setError(t('required'));
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) { setError(t('unavailable')); setBusy(false); return; }
      if (!res.ok || !data.code) throw new Error('fail');
      router.push({ pathname: '/booking/[code]', params: { code: data.code } });
    } catch {
      setError(t('errorGeneric')); setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-md bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">{t('details')}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="name" className="mb-1 block text-xs font-semibold text-gray-600">{t('name')} *</label><input id="name" name="name" required autoComplete="name" className="field" /></div>
        <div><label htmlFor="email" className="mb-1 block text-xs font-semibold text-gray-600">{t('email')} *</label><input id="email" name="email" type="email" required autoComplete="email" className="field" /></div>
        <div><label htmlFor="phone" className="mb-1 block text-xs font-semibold text-gray-600">{t('phone')} *</label><input id="phone" name="phone" type="tel" required autoComplete="tel" className="field" /></div>
        <div><label htmlFor="country" className="mb-1 block text-xs font-semibold text-gray-600">{t('country')}</label><input id="country" name="country" autoComplete="country-name" className="field" /></div>
      </div>
      <div><label htmlFor="notes" className="mb-1 block text-xs font-semibold text-gray-600">{t('notes')}</label><textarea id="notes" name="notes" rows={3} className="w-full rounded-[3px] border border-gray-300 p-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30" /></div>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="rounded-[3px] bg-[#f4f5f7] p-3 text-sm"><strong>{t('payAtAgency')}</strong> — {t('payNote')}</div>
      {error && <p role="alert" className="text-sm font-semibold text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="btn-brand w-full disabled:opacity-60">{busy ? t('submitting') : t('confirm')}</button>
    </form>
  );
}
