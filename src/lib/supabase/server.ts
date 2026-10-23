import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';

/** Cookie-aware client used for admin login / session checks. */
export async function createAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list: { name: string; value: string; options: CookieOptions }[]) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          /* called from a Server Component: ignore */
        }
      },
    },
  });
}

export async function getAdminUser() {
  const sb = await createAuthClient();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  const allowed = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (!email || !allowed.includes(email)) return null;
  return data.user;
}
