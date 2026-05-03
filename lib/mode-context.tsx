'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UIMode = 'normal' | 'focus' | 'deadline' | 'completed' | 'hacker';

interface ModeContextType {
  mode: UIMode;
  setMode: (mode: UIMode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<UIMode>('normal');

  useEffect(() => {
    // Apply CSS variables based on mode
    const root = document.documentElement;
    
    switch(mode) {
      case 'normal':
        root.style.setProperty('--accent', 'oklch(0.70 0.20 264)');
        root.style.setProperty('--primary', 'oklch(0.65 0.15 264)');
        root.style.setProperty('--background', 'oklch(0.08 0 0)');
        root.style.setProperty('--card', 'oklch(0.12 0.01 264)');
        root.classList.remove('mode-focus', 'mode-deadline', 'mode-completed', 'mode-hacker');
        root.classList.add('mode-normal');
        document.body.style.background = 'linear-gradient(135deg, oklch(0.08 0 0) 0%, oklch(0.10 0.01 264) 50%, oklch(0.09 0.005 240) 100%)';
        break;
      case 'focus':
        root.style.setProperty('--accent', 'oklch(0.70 0.20 264)');
        root.style.setProperty('--primary', 'oklch(0.65 0.15 264)');
        root.style.setProperty('--background', 'oklch(0.07 0 0)');
        root.style.setProperty('--card', 'oklch(0.10 0.005 264)');
        root.classList.remove('mode-normal', 'mode-deadline', 'mode-completed', 'mode-hacker');
        root.classList.add('mode-focus');
        document.body.style.background = 'linear-gradient(135deg, oklch(0.07 0 0) 0%, oklch(0.09 0.005 264) 50%, oklch(0.08 0 0) 100%)';
        break;
      case 'deadline':
        root.style.setProperty('--accent', 'oklch(0.65 0.20 30)');
        root.style.setProperty('--primary', 'oklch(0.60 0.18 35)');
        root.style.setProperty('--background', 'oklch(0.10 0.01 30)');
        root.style.setProperty('--card', 'oklch(0.14 0.02 30)');
        root.classList.remove('mode-normal', 'mode-focus', 'mode-completed', 'mode-hacker');
        root.classList.add('mode-deadline');
        document.body.style.background = 'linear-gradient(135deg, oklch(0.10 0.01 30) 0%, oklch(0.12 0.015 30) 50%, oklch(0.11 0.01 25) 100%)';
        break;
      case 'completed':
        root.style.setProperty('--accent', 'oklch(0.65 0.18 140)');
        root.style.setProperty('--primary', 'oklch(0.60 0.16 140)');
        root.style.setProperty('--background', 'oklch(0.08 0.005 140)');
        root.style.setProperty('--card', 'oklch(0.12 0.01 140)');
        root.classList.remove('mode-normal', 'mode-focus', 'mode-deadline', 'mode-hacker');
        root.classList.add('mode-completed');
        document.body.style.background = 'linear-gradient(135deg, oklch(0.08 0.005 140) 0%, oklch(0.10 0.008 140) 50%, oklch(0.09 0.005 140) 100%)';
        break;
      case 'hacker':
        root.style.setProperty('--accent', 'oklch(0.70 0.25 150)');
        root.style.setProperty('--primary', 'oklch(0.65 0.20 150)');
        root.style.setProperty('--background', 'oklch(0.02 0 0)');
        root.style.setProperty('--card', 'oklch(0.05 0 0)');
        root.classList.remove('mode-normal', 'mode-focus', 'mode-deadline', 'mode-completed');
        root.classList.add('mode-hacker');
        document.body.style.background = 'linear-gradient(135deg, oklch(0.02 0 0) 0%, oklch(0.04 0.005 150) 50%, oklch(0.03 0 0) 100%)';
        break;
    }
  }, [mode]);

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within ModeProvider');
  }
  return context;
}

export const modeStyles = {
  normal: {
    bg: 'bg-background',
    text: 'text-foreground',
    accent: 'text-accent',
    glow: 'neon-glow',
    border: 'border-border/30',
  },
  focus: {
    bg: 'bg-background',
    text: 'text-foreground',
    accent: 'text-accent',
    glow: 'neon-glow',
    border: 'border-border/20',
  },
  deadline: {
    bg: 'bg-background',
    text: 'text-foreground',
    accent: 'text-red-500',
    glow: 'neon-glow-red',
    border: 'border-red-500/30',
  },
  completed: {
    bg: 'bg-background',
    text: 'text-foreground',
    accent: 'text-green-500',
    glow: 'neon-glow-green',
    border: 'border-green-500/30',
  },
  hacker: {
    bg: 'bg-black',
    text: 'text-green-400',
    accent: 'text-green-400',
    glow: 'neon-glow-cyan',
    border: 'border-green-500/30',
  },
};
