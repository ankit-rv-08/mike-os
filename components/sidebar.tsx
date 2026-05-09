'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Activity, 
  Wallet, 
  Calendar, 
  TrendingUp, 
  Newspaper, 
  Mic, 
  FolderKanban,
  Settings,
  Cpu
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Core', href: '/' },
  { icon: MessageSquare, label: 'Neural', href: '/chat' },
  { icon: Activity, label: 'Vitals', href: '/performance' },
  { icon: Wallet, label: 'Capital', href: '/finance' },
  { icon: FolderKanban, label: 'Execution', href: '/projects' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Newspaper, label: 'News', href: '/news' },
  { icon: TrendingUp, label: 'Trading', href: '/trading' },
  { icon: Mic, label: 'Voice', href: '/voice' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] bg-[#09090b] border-r border-white/5 h-screen flex flex-col relative z-20">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Cpu className="text-blue-500 animate-pulse" size={24} />
          <h2 className="text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            MIKE_OS
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive 
                  ? 'text-white bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-md blur-[1px]"></span>
              )}
              <item.icon 
                size={18} 
                className={`transition-colors duration-300 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-300'}`} 
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-6 border-t border-white/5 bg-[#050505]/50 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">System Online</span>
          </div>
          <Settings size={16} className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
        </div>
        <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
          Ankith // v2.0-beta
        </div>
      </div>
    </aside>
  );
}