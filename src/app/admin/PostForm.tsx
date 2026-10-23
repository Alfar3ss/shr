import { deletePost, savePost } from './actions';

export type PostData = { id?: number; title?: string; slug?: string; locale?: string; excerpt?: string; content?: string; cover?: string | null; published?: boolean };

export default function PostForm({ post }: { post: PostData }) {
  return (
    <div className="max-w-3xl space-y-4">
      <form action={savePost} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
        {post.id && <input type="hidden" name="id" value={post.id} />}
        <label className="block text-xs font-semibold">Title<input name="title" defaultValue={post.title} required className="field mt-1" /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-semibold">Slug (URL, auto if empty)<input name="slug" defaultValue={post.slug} className="field mt-1" /></label>
          <label className="block text-xs font-semibold">Language
            <select name="locale" defaultValue={post.locale ?? 'en'} className="field mt-1">{['en', 'fr', 'es', 'de', 'nl', 'it'].map((l) => <option key={l}>{l}</option>)}</select>
          </label>
        </div>
        <label className="block text-xs font-semibold">Cover image URL<input name="cover" defaultValue={post.cover ?? ''} className="field mt-1" placeholder="https://…" /></label>
        <label className="block text-xs font-semibold">Excerpt (shown in lists and Google)<textarea name="excerpt" rows={2} defaultValue={post.excerpt} className="mt-1 w-full rounded-[3px] border border-gray-300 p-3 text-sm" /></label>
        <label className="block text-xs font-semibold">Content (Markdown: ## title, **bold**, - list, [link](https://…))<textarea name="content" rows={16} defaultValue={post.content} className="mt-1 w-full rounded-[3px] border border-gray-300 p-3 font-mono text-sm" /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={post.published} /> Published</label>
        <button className="btn-brand">Save</button>
      </form>
      {post.id && (
        <form action={deletePost}><input type="hidden" name="id" value={post.id} /><button className="text-sm font-semibold text-red-600 hover:underline">Delete this post</button></form>
      )}
    </div>
  );
}
