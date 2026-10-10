// Color themes a user can pick for their public portfolio. Applied at
// runtime as CSS custom properties (see ThemeContext + PortfolioPage), so
// switching themes never requires a rebuild.

export const THEMES = [
  {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      primary: '#6366f1',
      primaryDark: '#4338ca',
      accent: '#22d3ee',
      bg: '#0b1020',
      surface: '#141b2f',
      surfaceAlt: '#1c2540',
      text: '#e7eaf6',
      muted: '#9aa3c0',
      border: '#2a3355',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      primary: '#0ea5e9',
      primaryDark: '#0369a1',
      accent: '#2dd4bf',
      bg: '#f0f9ff',
      surface: '#ffffff',
      surfaceAlt: '#e0f2fe',
      text: '#0c2536',
      muted: '#4b6b7c',
      border: '#cfe8f6',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      primary: '#16a34a',
      primaryDark: '#166534',
      accent: '#eab308',
      bg: '#f4faf5',
      surface: '#ffffff',
      surfaceAlt: '#e7f5ea',
      text: '#13291a',
      muted: '#4d6355',
      border: '#d3e8d8',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      primary: '#f97316',
      primaryDark: '#c2410c',
      accent: '#ec4899',
      bg: '#fff8f2',
      surface: '#ffffff',
      surfaceAlt: '#ffedd9',
      text: '#301a0d',
      muted: '#805d47',
      border: '#f6dcc2',
    },
  },
  {
    id: 'grape',
    name: 'Grape',
    colors: {
      primary: '#a855f7',
      primaryDark: '#7e22ce',
      accent: '#f472b6',
      bg: '#faf5ff',
      surface: '#ffffff',
      surfaceAlt: '#f3e8ff',
      text: '#2a1338',
      muted: '#6d5480',
      border: '#e6d3f5',
    },
  },
  {
    id: 'slate',
    name: 'Slate',
    colors: {
      primary: '#334155',
      primaryDark: '#0f172a',
      accent: '#f59e0b',
      bg: '#f8fafc',
      surface: '#ffffff',
      surfaceAlt: '#eef2f6',
      text: '#0f172a',
      muted: '#5a6b7d',
      border: '#dbe3ea',
    },
  },
]

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) || THEMES[0]
}

export function themeToCssVars(theme) {
  const c = theme.colors
  return {
    '--ph-primary': c.primary,
    '--ph-primary-dark': c.primaryDark,
    '--ph-accent': c.accent,
    '--ph-bg': c.bg,
    '--ph-surface': c.surface,
    '--ph-surface-alt': c.surfaceAlt,
    '--ph-text': c.text,
    '--ph-muted': c.muted,
    '--ph-border': c.border,
  }
}
