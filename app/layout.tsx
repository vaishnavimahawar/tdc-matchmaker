import type { Metadata } from "next";
import { Nunito, Source_Serif_4 } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { currentUser } from "@/lib/auth";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TDC Matchmaker Dashboard",
  description: "Internal desk for Indian matchmakers",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <html
      lang="en"
      className={`${nunito.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
