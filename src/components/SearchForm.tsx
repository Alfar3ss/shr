'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { PLACES } from '@/lib/places';

type Props = {
  mode?: 'search' | 'car';
  carSlug?: string;
  initial?: { place?: string; returnPlace?: string; pickup?: string; pickupTime?: string; ret?: string; retTime?: string; category?: string };
  compact?: boolean;
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINS = ['00', '15', '30', '45'];
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);

export default function SearchForm({ mode = 'search', carSlug, initial, compact }: Props) {
  const t = useTranslations('search');
  const cat = useTranslations('cat');
  const router = useRouter();
  const [place, setPlace] = useState(initial?.place ?? 'marrakech');
  const [diff, setDiff] = useState(Boolean(initial?.returnPlace && initial.returnPlace !== initial.place));
  const [returnPlace, setReturnPlace] = useState(initial?.returnPlace ?? 'marrakech');
  const [pickup, setPickup] = useState(initial?.pickup ?? '');
  const [ret, setRet] = useState(initial?.ret ?? '');
  const [ph, setPh] = useState((initial?.pickupTime ?? '10:00').slice(0, 2));
  const [pm, setPm] = useState((initial?.pickupTime ?? '10:00').slice(3, 5));
  const [rh, setRh] = useState((initial?.retTime ?? '10:00').slice(0, 2));
  const [rm, setRm] = useState((initial?.retTime ?? '10:00').slice(3, 5));
  const [category, setCategory] = useState(initial?.category ?? '');
  const [error, setError] = useState('');

  // Defaults are set after mount to avoid server/client date mismatch
  useEffect(() => {
    if (!pickup) {
      const today = new Date();
      setPickup(iso(addDays(today, 1)));
      setRet(iso(addDays(today, 4)));
    }
  }, [pickup]);

  const today = iso(new Date());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const start = new Date(`${pickup}T${ph}:${pm}:00`);
    const end = new Date(`${ret}T${rh}:${rm}:00`);
    if (!pickup || !ret || end <= start) {
      setError(t('invalid'));
      return;
    }
    setError('');
    const query: Record<string, string> = {
      place, returnPlace: diff ? returnPlace : place,
      pickup, pickupTime: `${ph}:${pm}`, ret, retTime: `${rh}:${rm}`,
    };
    if (mode === 'car' && carSlug) {
      router.push({ pathname: '/book/[slug]', params: { slug: carSlug }, query } as never);
    } else {
      if (category) query.category = category;
      router.push({ pathname: '/our-cars', query } as never);
    }
  }

  const label = 'mb-1 block text-xs font-semibold text-white/90';
  const dark = !compact;
  const lab = dark ? label : 'mb-1 block text-xs font-semibold text-gray-600';
  const timeSel = 'field !px-2';

  return (
    <form onSubmit={submit} className={dark ? 'rounded-md bg-black/55 p-4 backdrop-blur-sm sm:p-5' : 'rounded-md border border-gray-200 bg-white p-4'}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <div className={diff ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <label className={lab} htmlFor="place">{t('pickupLocation')}</label>
          <select id="place" className="field" value={place} onChange={(e) => setPlace(e.target.value)}>
            {PLACES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <label className={`mt-2 flex items-center gap-2 text-xs ${dark ? 'text-white/90' : 'text-gray-600'}`}>
            <input type="checkbox" checked={diff} onChange={(e) => setDiff(e.target.checked)} className="h-4 w-4 accent-[#F0C540]" />
            {t('differentReturn')}
          </label>
        </div>
        {diff && (
          <div className="lg:col-span-3">
            <label className={lab} htmlFor="rplace">{t('dropoffLocation')}</label>
            <select id="rplace" className="field" value={returnPlace} onChange={(e) => setReturnPlace(e.target.value)}>
              {PLACES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
        )}
        <div className="lg:col-span-3">
          <label className={lab} htmlFor="pickup">{t('pickupDate')}</label>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input id="pickup" type="date" className="field" min={today} value={pickup} required
              onChange={(e) => { setPickup(e.target.value); if (ret && e.target.value > ret) setRet(e.target.value); }} />
            <div className="flex items-center gap-1">
              <select aria-label={t('pickupTime')} className={timeSel} value={ph} onChange={(e) => setPh(e.target.value)}>{HOURS.map((h) => <option key={h}>{h}</option>)}</select>
              <span className={dark ? 'text-white' : ''}>:</span>
              <select aria-label={t('pickupTime')} className={timeSel} value={pm} onChange={(e) => setPm(e.target.value)}>{MINS.map((m) => <option key={m}>{m}</option>)}</select>
            </div>
          </div>
        </div>
        <div className="lg:col-span-3">
          <label className={lab} htmlFor="ret">{t('dropoffDate')}</label>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input id="ret" type="date" className="field" min={pickup || today} value={ret} required onChange={(e) => setRet(e.target.value)} />
            <div className="flex items-center gap-1">
              <select aria-label={t('dropoffTime')} className={timeSel} value={rh} onChange={(e) => setRh(e.target.value)}>{HOURS.map((h) => <option key={h}>{h}</option>)}</select>
              <span className={dark ? 'text-white' : ''}>:</span>
              <select aria-label={t('dropoffTime')} className={timeSel} value={rm} onChange={(e) => setRm(e.target.value)}>{MINS.map((m) => <option key={m}>{m}</option>)}</select>
            </div>
          </div>
        </div>
        {mode === 'search' && (
          <div className="lg:col-span-2">
            <label className={lab} htmlFor="category">{t('category')}</label>
            <select id="category" className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">{t('any')}</option>
              <option value="midrange">{cat('midrange')}</option>
              <option value="citadine">{cat('citadine')}</option>
              <option value="4x4">{cat('4x4')}</option>
            </select>
          </div>
        )}
        <div className={`flex items-end ${mode === 'search' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <button type="submit" className="btn-brand h-11 w-full">{t('search')}</button>
        </div>
      </div>
      {error && <p className="mt-3 text-sm font-semibold text-red-300" role="alert">{error}</p>}
    </form>
  );
}
