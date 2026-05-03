'use client';

import { useState } from 'react';
import { Search, Settings } from 'lucide-react';
import { useMode, type UIMode } from '@/lib/mode-context';

const modes: { value: UIMode; label: string; icon: string }[] = [
  { value: 'normal', label: 'Normal', icon: '◯' },
  { value: 'focus', label: 'Focus', icon: '◎' },
  { value: 'deadline', label: 'Deadline', icon: '◔' },
  { value: 'completed', label: 'Completed', icon: '✓' },
  { value: 'hacker', label: 'Hacker', icon: '▲' },
];

export function TopBar() {
  const { mode, setMode } = useMode();
  const [commandOpen, setCommandOpen] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setCommandOpen(!commandOpen);
    }
  };

  // Listen for Ctrl+K
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown as any);
  }

  return (
    <header className="fixed top-0 left-72 right-0 h-20 glass-panel border-b border-border/30 flex items-center justify-between px-8 z-40 transition-all duration-500">
      {/* Left: Mode Switcher */}
      <div className="flex items-center gap-2 transition-all duration-500">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider transition-all duration-300">
          Mode:
        </span>
        <div className="flex gap-1 p-1 bg-card/40 rounded-lg border border-border/30 transition-all duration-500">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`
                px-3 py-1.5 rounded text-xs font-medium transition-all duration-500 transform
                ${
                  mode === m.value
                    ? 'bg-accent/30 text-accent neon-glow border border-accent/50 scale-110'
                    : 'text-muted-foreground hover:text-foreground border border-transparent hover:bg-card/50 hover:scale-105'
                }
              `}
              title={m.label}
            >
              {m.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Search & Settings */}
      <div className="flex items-center gap-4 transition-all duration-500">
        {/* Command Palette */}
        <button
          onClick={() => setCommandOpen(!commandOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/40 border border-border/30 text-muted-foreground hover:text-foreground transition-all duration-500 hover:neon-glow group hover:scale-105 active:scale-95"
        >
          <Search className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
          <span className="text-sm hidden sm:inline">Ctrl K</span>
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg bg-card/40 border border-border/30 text-muted-foreground hover:text-accent transition-all duration-500 hover:neon-glow hover:scale-110 active:scale-95 hover:rotate-45">
          <Settings className="w-5 h-5 transition-transform duration-300" />
        </button>
      </div>

      {/* Command Palette Modal */}
      {commandOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 animate-fade-in">
          <div
            className="glass-panel w-full max-w-2xl border border-border/50 neon-glow animate-fade-in transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 px-6 py-4 border-b border-border/30">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search commands, pages..."
                className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setCommandOpen(false);
                }}
              />
            </div>
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              <div className="text-xs text-muted-foreground px-3 py-2 font-medium">
                Suggestions
              </div>
              {[
                'Dashboard',
                'AI Chat',
                'Calendar',
                'Trading',
                'News',
                'Finance',
                'Performance',
                'Projects',
                'Voice Assistant',
              ].map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-card/50 text-foreground hover:text-accent transition-colors duration-200"
                  onClick={() => {
                    setCommandOpen(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal overlay click handler */}
      {commandOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setCommandOpen(false)}
        />
      )}
    </header>
  );
}
