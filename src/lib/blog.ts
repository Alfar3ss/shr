import { createAdminClient } from './supabase/admin';

export type Post = {
  id: number; slug: string; locale: string; title: string; excerpt: string; content: string;
  cover: string | null; published: boolean; created_at: string;
};

export async function getPosts(locale: string, limit?: number): Promise<Post[]> {
  const sb = createAdminClient();
  if (!sb) return [];
  const run = async (loc: string) => {
    let q = sb.from('posts').select('*').eq('published', true).eq('locale', loc).order('created_at', { ascending: false });
    if (limit) q = q.limit(limit);
    const { data } = await q;
    return (data ?? []) as Post[];
  };
  const own = await run(locale);
  return own.length || locale === 'en' ? own : run('en');
}

export async function getPost(slug: string, locale: string): Promise<Post | null> {
  const sb = createAdminClient();
  if (!sb) return null;
  for (const loc of locale === 'en' ? ['en'] : [locale, 'en']) {
    const { data } = await sb.from('posts').select('*').eq('slug', slug).eq('locale', loc).eq('published', true).maybeSingle();
    if (data) return data as Post;
  }
  return null;
}
