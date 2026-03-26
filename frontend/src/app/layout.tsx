import type { Metadata } from "next";
import { Geist, Geist_Mono, Lilita_One } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lilitaOne = Lilita_One({
  weight: "400",
  variable: "--font-lilita",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Collector's Vault",
  description: "Track your collection of video games, consoles, trading cards, and movies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lilitaOne.variable} antialiased`}
      >
        <Providers>
          <Header />
          <main className="container mx-auto px-4 py-8">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
