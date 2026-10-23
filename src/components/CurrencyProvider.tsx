'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { CURRENCIES, type CurrencyCode } from '@/lib/site';

const Ctx = createContext<{ code: CurrencyCode; setCode: (c: CurrencyCode) => void }>({ code: 'EUR', setCode: () => {} });

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [code, setCodeState] = useState<CurrencyCode>('EUR');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('currency') as CurrencyCode | null;
      if (saved && saved in CURRENCIES) setCodeState(saved);
    } catch {}
  }, []);
  const setCode = (c: CurrencyCode) => {
    setCodeState(c);
    try { localStorage.setItem('currency', c); } catch {}
  };
  return <Ctx.Provider value={{ code, setCode }}>{children}</Ctx.Provider>;
}

export const useCurrency = () => useContext(Ctx);

export function Price({ eur, className }: { eur: number; className?: string }) {
  const { code } = useCurrency();
  const { symbol, rate } = CURRENCIES[code];
  const value = (eur * rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return <span className={className}>{code === 'USD' ? `${symbol}${value}` : `${value} ${symbol}`}</span>;
}

export function CurrencySwitch() {
  const { code, setCode } = useCurrency();
  return (
    <select
      aria-label="Currency"
      value={code}
      onChange={(e) => setCode(e.target.value as CurrencyCode)}
      className="rounded-[3px] border border-white/20 bg-transparent px-2 py-1 text-sm text-white outline-none"
    >
      {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
        <option key={c} value={c} className="text-black">{c} ({CURRENCIES[c].symbol})</option>
      ))}
    </select>
  );
}
