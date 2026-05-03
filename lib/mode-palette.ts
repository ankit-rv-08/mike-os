export type UIMode = 'normal' | 'focus' | 'deadline' | 'completed' | 'hacker';

export const modePalettes = {
  normal: {
    name: 'Normal',
    accent: 'oklch(0.70 0.20 264)',      // Bright cyan
    primary: 'oklch(0.65 0.15 264)',     // Cyan-blue
    secondary: 'oklch(0.55 0.15 280)',   // Purple-blue
    background: 'oklch(0.08 0 0)',       // Deep black
    card: 'oklch(0.12 0.01 264)',        // Dark blue-tinted
    border: 'oklch(0.20 0.01 264)',      // Blue border
    foreground: 'oklch(0.95 0.02 264)',  // Light text
    glassTint: 'rgba(100, 200, 255, 0.1)',
    glowColor: 'rgba(100, 200, 255, 0.4)',
    gradient: 'linear-gradient(135deg, oklch(0.08 0 0) 0%, oklch(0.10 0.01 264) 50%, oklch(0.09 0.005 240) 100%)',
  },
  focus: {
    name: 'Focus',
    accent: 'oklch(0.75 0.22 264)',      // Intense cyan
    primary: 'oklch(0.68 0.18 264)',     // Stronger cyan
    secondary: 'oklch(0.58 0.16 280)',   // Stronger purple
    background: 'oklch(0.06 0 0)',       // Almost black
    card: 'oklch(0.09 0.005 264)',       // Darker card
    border: 'oklch(0.18 0.01 264)',      // Darker border
    foreground: 'oklch(0.97 0.02 264)',  // Brighter text
    glassTint: 'rgba(100, 220, 255, 0.08)',
    glowColor: 'rgba(100, 220, 255, 0.5)',
    gradient: 'linear-gradient(135deg, oklch(0.06 0 0) 0%, oklch(0.08 0.005 264) 50%, oklch(0.07 0 0) 100%)',
  },
  deadline: {
    name: 'Deadline',
    accent: 'oklch(0.65 0.25 30)',       // Bright red-orange
    primary: 'oklch(0.60 0.22 35)',      // Red-orange
    secondary: 'oklch(0.55 0.18 25)',    // Deep red
    background: 'oklch(0.11 0.02 25)',   // Dark red tint
    card: 'oklch(0.15 0.03 25)',         // Red-tinted card
    border: 'oklch(0.25 0.03 25)',       // Red border
    foreground: 'oklch(0.95 0.02 30)',   // Light text
    glassTint: 'rgba(239, 68, 68, 0.15)',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    gradient: 'linear-gradient(135deg, oklch(0.11 0.02 25) 0%, oklch(0.13 0.025 25) 50%, oklch(0.12 0.015 20) 100%)',
  },
  completed: {
    name: 'Completed',
    accent: 'oklch(0.70 0.20 140)',      // Bright green
    primary: 'oklch(0.65 0.18 140)',     // Green
    secondary: 'oklch(0.55 0.15 130)',   // Deep green
    background: 'oklch(0.09 0.008 140)', // Dark green tint
    card: 'oklch(0.13 0.01 140)',        // Green-tinted card
    border: 'oklch(0.22 0.02 140)',      // Green border
    foreground: 'oklch(0.95 0.02 140)',  // Light text
    glassTint: 'rgba(34, 197, 94, 0.12)',
    glowColor: 'rgba(34, 197, 94, 0.5)',
    gradient: 'linear-gradient(135deg, oklch(0.09 0.008 140) 0%, oklch(0.11 0.01 140) 50%, oklch(0.10 0.008 140) 100%)',
  },
  hacker: {
    name: 'Hacker',
    accent: 'oklch(0.75 0.28 150)',      // Intense green
    primary: 'oklch(0.70 0.25 150)',     // Bright green
    secondary: 'oklch(0.60 0.20 145)',   // Matrix green
    background: 'oklch(0.02 0 0)',       // Pure black
    card: 'oklch(0.04 0.002 0)',         // Almost black card
    border: 'oklch(0.15 0.02 150)',      // Green border
    foreground: 'oklch(0.78 0.25 150)',  // Green text
    glassTint: 'rgba(34, 197, 94, 0.1)',
    glowColor: 'rgba(34, 197, 94, 0.6)',
    gradient: 'linear-gradient(135deg, oklch(0.02 0 0) 0%, oklch(0.04 0.008 150) 50%, oklch(0.03 0 0) 100%)',
  },
} as const;

export function applyModePalette(mode: UIMode) {
  const palette = modePalettes[mode];
  const root = document.documentElement;

  // Apply CSS variables
  root.style.setProperty('--accent', palette.accent);
  root.style.setProperty('--primary', palette.primary);
  root.style.setProperty('--secondary', palette.secondary);
  root.style.setProperty('--background', palette.background);
  root.style.setProperty('--card', palette.card);
  root.style.setProperty('--border', palette.border);
  root.style.setProperty('--foreground', palette.foreground);

  // Apply body background
  document.body.style.background = palette.gradient;

  // Apply mode class
  root.classList.remove('mode-normal', 'mode-focus', 'mode-deadline', 'mode-completed', 'mode-hacker');
  root.classList.add(`mode-${mode}`);
}
