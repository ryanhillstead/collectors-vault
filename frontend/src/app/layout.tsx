import type { Metadata } from "next";
import { Manrope, Geist_Mono, Fraunces, Lilita_One } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const lilitaOne = Lilita_One({
  weight: "400",
  variable: "--font-lilita",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Collector's Vault — Track what you treasure",
  description:
    "A luxe portfolio for the things you collect: video games, trading cards, comics, coins and more. Track value, watch it grow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${geistMono.variable} ${fraunces.variable} ${lilitaOne.variable} vault-grain font-sans antialiased`}
      >
        <Providers>
          <div className="vault-atmosphere" aria-hidden />
          <Header />
          <main className="container mx-auto px-4 py-10 sm:px-6">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
