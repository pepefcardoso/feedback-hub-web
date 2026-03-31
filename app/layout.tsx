import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';

import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Feedback Hub',
  description:
    'A platform for capturing, voting on, and prioritizing user ideas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-surface text-on-surface font-sans antialiased selection:bg-primary/20">
        <Navbar />

        <div className="flex-1 mx-auto w-full max-w-5xl px-6 py-8 md:py-12 flex flex-col md:flex-row gap-8">
          <Suspense fallback={<div className="w-full md:w-48 lg:w-56 shrink-0" />}>
            <Sidebar />
          </Suspense>

          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>

        <Footer />
      </body>
    </html>
  );
}