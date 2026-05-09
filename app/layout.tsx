import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MIKE OS | System',
  description: 'Personal Operating System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#050505] text-white flex h-screen overflow-hidden antialiased selection:bg-blue-500 selection:text-white`}>
        {/* Sidebar fixed on the left */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-gradient-to-br from-[#050505] to-[#0a0a0a]">
          {children}
        </main>
      </body>
    </html>
  );
}