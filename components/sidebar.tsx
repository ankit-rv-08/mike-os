'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  MessageCircle,
  Calendar,
  TrendingUp,
  Newspaper,
  DollarSign,
  BarChart3,
  CheckSquare,
  Mic2,
} from 'lucide-react';

const navItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/' },
  { icon: MessageCircle, label: 'AI Chat', href: '/chat' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: TrendingUp, label: 'Trading', href: '/trading' },
  { icon: Newspaper, label: 'News', href: '/news' },
  { icon: DollarSign, label: 'Finance', href: '/finance' },
  { icon: BarChart3, label: 'Performance', href: '/performance' },
  { icon: CheckSquare, label: 'Projects', href: '/projects' },
  { icon: Mic2, label: 'Voice', href: '/voice' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 glass-panel-lg border-r border-border/30 p-6 flex flex-col gap-12 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent via-primary to-accent flex items-center justify-center">
          <span className="text-xl font-bold text-background">M</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-glow">MIKE OS</h1>
          <p className="text-xs text-muted-foreground">v1.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300
                ${
                  isActive
                    ? 'bg-accent/20 text-accent neon-glow border border-accent/50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50 border border-transparent hover:neon-glow'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="border-t border-border/30 pt-4 space-y-2">
        <p className="text-xs text-muted-foreground">Status</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-foreground">System Online</span>
        </div>
      </div>
    </aside>
  );
}
