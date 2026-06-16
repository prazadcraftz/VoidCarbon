import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'VoidCarbon - Personalized Carbon Footprint Tracker',
  description: 'Understand, track, and reduce your personal carbon footprint through dynamic calculations and Google Gemini AI goals.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} style={{ colorScheme: 'light' }}>
      <body className="min-h-full flex flex-col bg-page-bg font-sans text-[#3d5c45]">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-brand-cyan focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none"
        >
          Skip to content
        </a>
        
        <Suspense fallback={<div className="h-14 border-b border-white/5 bg-[#0f2318]/80" />}>
          <SiteHeader />
        </Suspense>
        
        <main id="main-content" className="flex-1 flex flex-col w-full" tabIndex={-1}>
          {children}
        </main>
        
        <SiteFooter />
      </body>
    </html>
  );
}
