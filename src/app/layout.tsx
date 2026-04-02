import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'NeuroQuest Academy',
  description: 'AI-powered adaptive learning for neurodiverse students',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="min-h-screen">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              borderRadius: '16px',
              padding: '12px 20px',
              background: '#fff',
              color: '#2D2D2D',
              boxShadow: '0 4px 24px rgba(108, 99, 255, 0.15)',
            },
          }}
        />
      </body>
    </html>
  );
}
