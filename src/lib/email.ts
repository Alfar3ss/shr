import 'server-only';
import nodemailer from 'nodemailer';
import { SITE } from './site';

type MailInput = { to: string | string[]; subject: string; html: string; replyTo?: string };

export async function sendMail({ to, subject, html, replyTo }: MailInput) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.warn('[email] SMTP_USER or SMTP_PASS missing, email not sent:', subject);
    return { ok: false as const, error: 'not-configured' };
  }

  const port = Number(process.env.SMTP_PORT ?? 465);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('[email] invalid SMTP_PORT:', process.env.SMTP_PORT);
    return { ok: false as const, error: 'invalid-smtp-port' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'smtp.hostinger.com',
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? `${SITE.name} <${user}>`,
      to,
      subject,
      html,
      replyTo,
    });
    return { ok: true as const };
  } catch (error) {
    console.error('[email] failed', error);
    return { ok: false as const, error: error instanceof Error ? error.message : 'smtp-error' };
  }
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export type BookingMail = {
  id: number; code: string; status: string; carName: string; pickup: string; ret: string;
  pickupPlace: string; returnPlace: string; days: number; total: number;
  name: string; email: string; phone: string; country?: string; notes?: string; link: string;
};

const row = (l: string, v: string) =>
  `<tr><td style="padding:6px 0;color:#6c757d;width:150px">${l}</td><td style="padding:6px 0"><strong>${esc(v)}</strong></td></tr>`;

/** Same layout for admin and customer; the title changes. */
export function bookingHtml(b: BookingMail, title: string, intro: string, labels: Record<string, string>) {
  return `<div style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #ddd;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#273F44">
  <p style="font-size:20px;font-weight:bold;margin:0 0 4px">${esc(SITE.name)}</p>
  <p style="margin:0 0 16px;color:#6c757d">${esc(title)}</p>
  <p style="margin:0 0 16px">${esc(intro)}</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;border-top:1px solid #ddd">
    ${row(labels.order, '#' + b.id)}${row(labels.code, b.code)}${row(labels.status, b.status)}
    ${row(labels.car, b.carName)}
    ${row(labels.pickup, `${b.pickup} — ${b.pickupPlace}`)}
    ${row(labels.return, `${b.ret} — ${b.returnPlace}`)}
    ${row(labels.days, String(b.days))}
    ${row(labels.total, `€${b.total.toFixed(2)}`)}
    ${row(labels.payment, labels.paymentValue)}
  </table>
  <p style="margin:18px 0 6px;font-size:16px;font-weight:bold">${esc(labels.customer)}</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;border-top:1px solid #ddd">
    ${row(labels.name, b.name)}${row(labels.email, b.email)}${row(labels.phone, b.phone)}
    ${b.country ? row(labels.country, b.country) : ''}${b.notes ? row(labels.notes, b.notes) : ''}
  </table>
  <p style="margin:22px 0 0"><a href="${b.link}" style="background:#F0C540;color:#273F44;padding:12px 20px;text-decoration:none;font-weight:bold;border-radius:3px;display:inline-block">${esc(labels.view)}</a></p>
  <p style="margin:18px 0 0;font-size:12px;color:#6c757d">${esc(SITE.phoneDisplay)} · ${esc(SITE.email)}</p>
</div>`;
}
