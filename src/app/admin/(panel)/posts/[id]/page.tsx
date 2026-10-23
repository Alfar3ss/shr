import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import PostForm from '../../../PostForm';

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = createAdminClient();
  const { data } = sb ? await sb.from('posts').select('*').eq('id', Number(id)).maybeSingle() : { data: null };
  if (!data) notFound();
  return (<div className="space-y-5"><h1 className="text-2xl font-bold">Edit post</h1><PostForm post={data} /></div>);
}
