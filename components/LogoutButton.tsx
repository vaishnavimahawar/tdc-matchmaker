"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Why: logout button handles the session invalidation API call and redirects back to /login. */
export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      window.location.href = "/login";
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-900 disabled:opacity-50"
    >
      {loading ? "Signing out…" : "Log out"}
    </button>
  );
}
