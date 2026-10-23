'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { randomInt } from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { createAuthClient, getAdminUser } from '@/lib/supabase/server';
import { getCar } from '@/lib/cars';
import { isAvailable, quote } from '@/lib/booking';

async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');
  const sb = createAdminClient();
  if (!sb) throw new Error('Supabase not configured');
  return sb;
}

export async function login(formData: FormData) {
  const sb = await createAuthClient();
  if (!sb) redirect('/admin/login?error=config');
  const { error } = await sb.auth.signInWithPassword({
    email: String(formData.get('email') ?? '').trim(), password: String(formData.get('password') ?? ''),
  });
  if (error || !(await getAdminUser())) {
    await sb.auth.signOut();
    redirect('/admin/login?error=1');
  }
  redirect('/admin');
}

export async function logout() {
  const sb = await createAuthClient();
  await sb?.auth.signOut();
  redirect('/admin/login');
}

export async function setBookingStatus(formData: FormData) {
  const sb = await requireAdmin();
  const id = Number(formData.get('id'));
  const status = String(formData.get('status'));
  if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) return;
  await sb.from('bookings').update({ status }).eq('id', id);
  revalidatePath('/admin', 'layout');
}

export async function createManualBooking(formData: FormData) {
  const sb = await requireAdmin();
  const car = await getCar(String(formData.get('car')));
  const start = new Date(`${formData.get('pickup')}T${formData.get('pickupTime') || '10:00'}:00+01:00`);
  const end = new Date(`${formData.get('ret')}T${formData.get('retTime') || '10:00'}:00+01:00`);
  if (!car || isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) redirect('/admin/bookings/new?error=dates');
  if (!(await isAvailable(car, start, end)) && formData.get('force') !== 'on') redirect('/admin/bookings/new?error=unavailable');

  const q = quote(car, start, end);
  const priceOverride = Number(formData.get('total'));
  const total = priceOverride > 0 ? priceOverride : q.total;
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();

  let customerId: number | null = null;
  if (email) {
    const { data: ex } = await sb.from('customers').select('id').eq('email', email).maybeSingle();
    customerId = ex?.id ?? (await sb.from('customers').insert({ name, email, phone }).select('id').single()).data?.id ?? null;
  } else {
    customerId = (await sb.from('customers').insert({ name, email: null, phone }).select('id').single()).data?.id ?? null;
  }
  await sb.from('bookings').insert({
    code: String(randomInt(100_000_000, 999_999_999)), car_slug: car.slug, customer_id: customerId, status: 'confirmed',
    pickup_at: start.toISOString(), return_at: end.toISOString(),
    pickup_place: String(formData.get('place') ?? 'marrakech'), return_place: String(formData.get('returnPlace') ?? 'marrakech'),
    days: q.days, price_per_day: total / q.days, total, deposit: car.deposit,
    notes: String(formData.get('notes') ?? '') || null, locale: 'en', source: 'admin',
  });
  revalidatePath('/admin', 'layout');
  redirect('/admin/bookings');
}

export async function updateCar(formData: FormData) {
  const sb = await requireAdmin();
  const slug = String(formData.get('slug'));
  await sb.from('cars').update({
    price_per_day: Number(formData.get('price_per_day')), deposit: Number(formData.get('deposit')),
    units: Math.max(1, Number(formData.get('units'))), active: formData.get('active') === 'on',
  }).eq('slug', slug);
  revalidatePath('/', 'layout');
  revalidatePath('/admin/cars');
}

const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export async function savePost(formData: FormData) {
  const sb = await requireAdmin();
  const id = Number(formData.get('id') || 0);
  const title = String(formData.get('title') ?? '').trim();
  const row = {
    title, slug: slugify(String(formData.get('slug') || title)), locale: String(formData.get('locale') || 'en'),
    excerpt: String(formData.get('excerpt') ?? ''), content: String(formData.get('content') ?? ''),
    cover: String(formData.get('cover') ?? '') || null, published: formData.get('published') === 'on',
  };
  if (!title) redirect('/admin/posts');
  if (id) await sb.from('posts').update(row).eq('id', id);
  else await sb.from('posts').insert(row);
  revalidatePath('/', 'layout');
  redirect('/admin/posts');
}

export async function deletePost(formData: FormData) {
  const sb = await requireAdmin();
  await sb.from('posts').delete().eq('id', Number(formData.get('id')));
  revalidatePath('/', 'layout');
  redirect('/admin/posts');
}
