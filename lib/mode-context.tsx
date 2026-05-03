'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { applyModePalette } from './mode-palette';

export type UIMode = 'normal' | 'focus' | 'deadline' | 'completed' | 'hacker';

interface ModeContextType {
  mode: UIMode;
  setMode: (mode: UIMode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<UIMode>('normal');

  useEffect(() => {
    applyModePalette(mode);
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
