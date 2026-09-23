import type { Metadata, Viewport } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-lexend',
});

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Remix MercadoList',
  description: 'Imported from GitHub: Mercadomapsmm/MercadoList',
  applicationName: 'Remix MercadoList',
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Remix MercadoList',
    description: 'Imported from GitHub: Mercadomapsmm/MercadoList',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remix MercadoList',
    description: 'Imported from GitHub: Mercadomapsmm/MercadoList',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={lexend.variable}>
      <body suppressHydrationWarning className={`${lexend.className} min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-200`}>
        {children}
      </body>
    </html>
  );
}
