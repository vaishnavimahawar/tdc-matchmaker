import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import type { Matchmaker } from "@/lib/auth";

const NAV = [
  { href: "/", label: "Desk" },
  { href: "/profiles", label: "The book" },
  { href: "/matches", label: "Top pairs" },
  { href: "/shortlist", label: "Shortlist" },
];

/** Why: a persistent, quiet nav keeps the tool feeling like a studio, not a corporate portal. */
export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: Matchmaker | null;
}) {
  return (
    <div className="min-h-full bg-[#FBF6F0] text-stone-800">
      <header className="border-b border-rose-100 bg-[#FBF6F0]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="font-serif text-xl text-rose-900">
            TDC Matchmaker
          </Link>

          {user ? (
            <div className="flex flex-wrap items-center gap-5">
              <nav className="flex flex-wrap gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full px-3 py-1.5 text-sm text-stone-600 transition hover:bg-white hover:text-rose-800"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3 border-l border-rose-200/70 pl-4">
                <span className="font-serif text-sm font-medium text-stone-800">
                  {user.displayName}
                </span>
                <LogoutButton />
              </div>
            </div>
          ) : null}
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
