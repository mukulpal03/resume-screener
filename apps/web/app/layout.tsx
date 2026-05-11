import type { Metadata } from 'next';
import { Poppins, Instrument_Serif, Geist, Playfair_Display } from 'next/font/google';
import Footer from './components/layout/footer';
import { Toaster } from './components/ui/sonner';
import { ClerkProvider } from '@clerk/nextjs';
import { NAV_LINKS } from './constants/nav';
import WebNavbar from './components/web-navbar';

import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-geist',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Resume Screener',
  description: 'AI Resume Analyzer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${poppins.variable} ${instrumentSerif.variable} ${geist.variable} ${playfair.variable}`}
      >
        <body className="font-sans">
          <WebNavbar links={NAV_LINKS} />
          {children}
          <Footer />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
