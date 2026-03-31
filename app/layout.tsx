import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="...">
        <AuthProvider>
          <Navbar />
          <div className="...">
            <Suspense fallback={<div className="w-full md:w-48 lg:w-56 shrink-0" />}>
              <Sidebar />
            </Suspense>
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}