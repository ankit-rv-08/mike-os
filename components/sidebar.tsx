'use client';
import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, MessageSquare, Activity, Wallet, Calendar, TrendingUp, Newspaper, Mic, FolderKanban } from 'lucide-react';

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
  return (
    <aside className="w-64 bg-black border-r border-white/10 h-screen sticky top-0 flex flex-col pt-8">
      <div className="px-6 mb-10">
        <h2 className="text-xl font-bold tracking-tighter text-blue-500">MIKE_os</h2>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 rounded-lg hover:bg-white/5 hover:text-white transition-all group"
          >
            <item.icon size={18} className="group-hover:text-blue-400 transition-colors" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 text-[10px] text-gray-600 uppercase tracking-widest text-center">
        v2.0-beta // rv-08
      </div>
    </aside>
  );
}