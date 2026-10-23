import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function PostsAdmin() {
  const sb = createAdminClient();
  if (!sb) return <p>Supabase is not configured.</p>;
  const { data } = await sb.from('posts').select('id,title,slug,locale,published,created_at').order('created_at', { ascending: false });
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Blog posts</h1><Link href="/admin/posts/new" className="btn-brand">+ New post</Link></div>
      <div className="divide-y rounded-lg bg-white shadow-sm">
        {(data ?? []).length === 0 && <p className="p-6 text-gray-500">No posts yet.</p>}
        {(data ?? []).map((p) => (
          <Link key={p.id} href={`/admin/posts/${p.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50">
            <div><p className="font-semibold">{p.title}</p><p className="text-xs text-gray-500">/{p.slug} · {p.locale} · {new Date(p.created_at).toLocaleDateString('en-GB')}</p></div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.published ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>{p.published ? 'published' : 'draft'}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
