import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomInt } from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCar } from '@/lib/cars';
import { isAvailable, parseLocal, quote } from '@/lib/booking';
import { bookingHtml, sendMail } from '@/lib/email';
import { MAIL } from '@/lib/mail-labels';
import { placeLabel } from '@/lib/places';
import { SITE } from '@/lib/site';
import { urlFor } from '@/lib/seo';

const schema = z.object({
  slug: z.string().min(1), place: z.string().min(1), returnPlace: z.string().min(1),
  pickup: z.string(), pickupTime: z.string(), ret: z.string(), retTime: z.string(),
  name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(160),
  phone: z.string().trim().min(5).max(40), country: z.string().trim().max(80).optional().default(''),
  notes: z.string().trim().max(1500).optional().default(''), locale: z.string().default('en'),
  website: z.string().optional(), // honeypot
});

const fmt = (d: Date) => d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Casablanca' });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const b = parsed.data;
  if (b.website) return NextResponse.json({ ok: true, code: 'ignored' }); // bot

  const sb = createAdminClient();
  if (!sb) return NextResponse.json({ error: 'database-not-configured' }, { status: 503 });

  const car = await getCar(b.slug);
  const start = parseLocal(b.pickup, b.pickupTime);
  const end = parseLocal(b.ret, b.retTime);
  if (!car || !car.active || !start || !end || end <= start || start.getTime() < Date.now() - 3600_000) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  if (!(await isAvailable(car, start, end))) return NextResponse.json({ error: 'unavailable' }, { status: 409 });

  const q = quote(car, start, end); // price is always computed on the server

  // customer: reuse by email
  const email = b.email.toLowerCase();
  let customerId: number | null = null;
  const { data: existing } = await sb.from('customers').select('id').eq('email', email).maybeSingle();
  if (existing) {
    customerId = existing.id;
    await sb.from('customers').update({ name: b.name, phone: b.phone, country: b.country || null }).eq('id', existing.id);
  } else {
    const { data: created } = await sb.from('customers').insert({ name: b.name, email, phone: b.phone, country: b.country || null }).select('id').single();
    customerId = created?.id ?? null;
  }

  const code = String(randomInt(100_000_000, 999_999_999));
  const { data: booking, error } = await sb.from('bookings').insert({
    code, car_slug: car.slug, customer_id: customerId, status: 'confirmed',
    pickup_at: start.toISOString(), return_at: end.toISOString(),
    pickup_place: b.place, return_place: b.returnPlace, days: q.days, price_per_day: q.perDay, total: q.total,
    deposit: car.deposit, notes: b.notes || null, locale: b.locale, source: 'website',
  }).select('id').single();
  if (error || !booking) {
    console.error('[booking] insert failed', error);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }

  const link = urlFor(b.locale, { pathname: '/booking/[code]', params: { code } });
  const base = {
    id: booking.id, code, carName: car.name, pickup: fmt(start), ret: fmt(end),
    pickupPlace: placeLabel(b.place), returnPlace: placeLabel(b.returnPlace), days: q.days, total: q.total,
    name: b.name, email, phone: b.phone, country: b.country, notes: b.notes, link,
  };
  const en = MAIL.en;
  const loc = MAIL[b.locale] ?? en;
  // fire emails but never fail the booking because of email problems
  await Promise.allSettled([
    sendMail({
      to: process.env.ADMIN_EMAIL ?? SITE.email,
      replyTo: email,
      subject: `New booking #${booking.id} — ${car.name} — ${b.name}`,
      html: bookingHtml({ ...base, status: en.confirmed, link: `${SITE.url}/admin/bookings` }, `New booking #${booking.id}`, `${b.name} · ${b.phone}`, en),
    }),
    sendMail({
      to: email,
      subject: `${loc.subject} #${booking.id} — ${SITE.name}`,
      html: bookingHtml({ ...base, status: loc.confirmed }, `${loc.subject} #${booking.id}`, loc.intro, loc),
    }),
  ]);

  return NextResponse.json({ ok: true, code });
}
