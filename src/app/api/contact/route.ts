import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendMail } from '@/lib/email';
import { SITE } from '@/lib/site';

const schema = z.object({
  name: z.string().trim().min(2).max(120), email: z.string().trim().email(), phone: z.string().trim().max(40).optional().default(''),
  message: z.string().trim().min(5).max(3000), website: z.string().optional(),
});
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true });
  const res = await sendMail({
    to: process.env.ADMIN_EMAIL ?? SITE.email, replyTo: d.email, subject: `Website message from ${d.name}`,
    html: `<p><strong>${esc(d.name)}</strong> · ${esc(d.email)} · ${esc(d.phone)}</p><p>${esc(d.message).replace(/\n/g, '<br>')}</p>`,
  });
  return NextResponse.json({ ok: res.ok }, { status: res.ok ? 200 : 502 });
}
