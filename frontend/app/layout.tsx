import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { APP_NAME } from '@/lib/constants';

// ─── Fonts ────────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: 'AI-powered parking enforcement management system',
  keywords: ['parking', 'enforcement', 'violations', 'challans', 'ANPR', 'OCR'],
  authors: [{ name: 'SmartPark Systems' }],
  robots: 'noindex, nofollow',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: APP_NAME,
    description: 'AI-powered parking enforcement management system',
    type: 'website',
    locale: 'en_IN',
  },
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-ink text-text-primary min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
