import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — TDC Matchmaker",
};

/** Why: login has its own layout without the AppShell nav, keeping the page clean. */
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
