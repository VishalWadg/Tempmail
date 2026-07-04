import themeData from 'material-theme.json'
import { colord } from 'colord';
import { createContext, useContext, useEffect, useState } from 'react';

type SchemeKey = keyof typeof themeData.schemes;
type ThemeMode = 'light' | 'dark';
type ContrastLevel = 'standard' | 'medium' | 'high';

type ThemeContextType = {
  themeMode: ThemeMode
  contrastLevel: ContrastLevel
  setThemeMode: (mode: ThemeMode) => void
  setContrastLevel: (level: ContrastLevel) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('tempmail-theme-mode') as ThemeMode
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const [contrastLevel, setContrastLevel] = useState<ContrastLevel>(() => {
    return (localStorage.getItem('tempmail-contrast-level') as ContrastLevel) || 'standard'
  })

  // Listen for OS theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('tempmail-theme-mode')) {
        setThemeMode(e.matches ? 'dark' : 'light')
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    localStorage.setItem('tempmail-theme-mode', themeMode)
    localStorage.setItem('tempmail-contrast-level', contrastLevel)

    // Build the string and safely cast it to the precise type TypeScript expects
    const schemeString = `${themeMode}${contrastLevel === 'standard' ? '' : `-${contrastLevel}-contrast`}`
    const schemeKey = schemeString as SchemeKey

    const scheme = themeData.schemes[schemeKey]
    if (!scheme) return

    const root = document.documentElement

    if (themeMode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    const mapping = {
      background: scheme.background,
      foreground: scheme.onBackground,
      card: scheme.surfaceContainerLow || scheme.surface,
      'card-foreground': scheme.onSurface,
      popover: scheme.surfaceContainer,
      'popover-foreground': scheme.onSurface,
      primary: scheme.primary,
      'primary-foreground': scheme.onPrimary,
      secondary: scheme.secondary,
      'secondary-foreground': scheme.onSecondary,
      muted: scheme.surfaceVariant,
      'muted-foreground': scheme.onSurfaceVariant,
      accent: scheme.primaryContainer,
      'accent-foreground': scheme.onPrimaryContainer,
      border: scheme.outlineVariant,
      input: scheme.outlineVariant,
      ring: scheme.primary,
    }
    Object.entries(mapping).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
  }, [themeMode, contrastLevel])

  return (
    <ThemeContext.Provider value={{ themeMode, contrastLevel, setThemeMode, setContrastLevel }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}