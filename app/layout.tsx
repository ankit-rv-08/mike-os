import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { ModeProvider } from '@/lib/mode-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'MIKE OS - Premium AI Operating System',
  description: 'Experience the future of AI-powered productivity',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background dark">
      <body className="font-sans antialiased bg-background text-foreground transition-colors duration-500">
        <ModeProvider>
          <Sidebar />
          <TopBar />
          <main className="ml-72 mt-20 p-8 min-h-screen transition-all duration-500">
            {children}
          </main>
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ModeProvider>
      </body>
    </html>
  )
}
