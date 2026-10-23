import { login } from '../actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form action={login} className="w-full max-w-sm space-y-4 rounded-lg bg-white p-8 shadow">
        <h1 className="text-xl font-bold">SHR Cars — Admin</h1>
        {error === 'config' && <p className="rounded bg-yellow-50 p-3 text-sm text-yellow-800">Supabase is not configured yet (see README).</p>}
        {error === '1' && <p className="rounded bg-red-50 p-3 text-sm text-red-700">Wrong email or password, or this account is not an admin.</p>}
        <div><label className="mb-1 block text-xs font-semibold text-gray-600" htmlFor="email">Email</label><input id="email" name="email" type="email" required className="field" autoComplete="username" /></div>
        <div><label className="mb-1 block text-xs font-semibold text-gray-600" htmlFor="password">Password</label><input id="password" name="password" type="password" required className="field" autoComplete="current-password" /></div>
        <button className="btn-brand w-full">Sign in</button>
      </form>
    </div>
  );
}
