"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Why: the login form is a client component because it manages form state and calls the API. */
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed");
        return;
      }

      /** Why: router.push + refresh ensures the middleware sees the new cookie. */
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Why: centred branding keeps the login warm and on-brand. */}
        <div className="mb-6 text-center">
          <h1 className="font-serif text-3xl text-rose-900">Welcome Back</h1>
          <p className="mt-1 text-sm text-stone-500">
            Sign in to access your desk
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-rose-100 bg-white p-8 shadow-[0_8px_30px_rgba(120,70,70,0.06)]"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-stone-600"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                className="mt-1.5 w-full rounded-2xl border border-rose-100 bg-[#FBF6F0] px-4 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-200"
                placeholder="e.g. priya"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-stone-600"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1.5 w-full rounded-2xl border border-rose-100 bg-[#FBF6F0] px-4 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error ? (
            <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-rose-800 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
