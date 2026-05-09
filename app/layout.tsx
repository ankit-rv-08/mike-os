'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 1024);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return (
    <html lang="en">
      <body className="antialiased bg-black overflow-hidden select-none">
        <div className="scanline" />
        
        {/* Global Grid Overlay */}
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--neon-blue)_0%,_transparent_1px)] bg-[length:40px_40px] opacity-10" />

        <div className="flex h-screen w-screen p-2 lg:p-6 gap-4">
          {/* Responsive Sidebar - Hidden on mobile, HUD-style on desktop */}
          {!isMobile && (
            <motion.div initial={{ x: -100 }} animate={{ x: 0 }} className="w-72">
              <Sidebar className="h-full hud-panel border-cyan-500/40" />
            </motion.div>
          )}

          <main className="flex-1 hud-panel relative overflow-hidden flex flex-col">
            <header className="p-4 border-b border-cyan-500/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">System Online // MIKE OS v2.0</span>
              </div>
              <div className="text-[10px] text-cyan-500/50 uppercase tracking-tighter">
                NITK_SRK_GRID_SECURED
              </div>
            </header>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {children}
            </div>

            {/* Mobile Bottom HUD - Only shows on Small screens */}
            {isMobile && (
              <footer className="h-16 border-t border-cyan-500/20 bg-black/80 backdrop-blur-xl flex items-center justify-around px-4">
                {/* Mobile Icons go here */}
              </footer>
            )}
          </main>
        </div>
      </body>
    </html>
  );
}