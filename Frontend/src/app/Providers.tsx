import { createContext, useContext, useEffect, useState } from 'react'
import themeData from '../material-theme.json'
import {safeLocalStorage} from '@/lib/storage'

type ThemePreference = 'light' | 'dark'
type ContrastLevel = 'standard' | 'medium' | 'high'

type ThemeContextType = {
  themePreference: ThemePreference
  contrastLevel: ContrastLevel
  setThemePreference: (pref: ThemePreference) => void
  setContrastLevel: (level: ContrastLevel) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)


export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(() => {
    const saved = safeLocalStorage.getItem('tempmail-theme-preference') as ThemePreference
    if (saved) return saved
    // Initial fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const [contrastLevel, setContrastLevelState] = useState<ContrastLevel>(() => {
    return (safeLocalStorage.getItem('tempmail-contrast-level') as ContrastLevel) || 'standard'
  })

  // Setter wrapper that persists preference
  const setThemePreference = (pref: ThemePreference) => {
    setThemePreferenceState(pref)
    safeLocalStorage.setItem('tempmail-theme-preference', pref)
  }

  // Setter wrapper that persists contrast
  const setContrastLevel = (level: ContrastLevel) => {
    setContrastLevelState(level)
    safeLocalStorage.setItem('tempmail-contrast-level', level)
  }

  // Effect to apply mapped CSS variables to root based on active preference
  useEffect(() => {
    let schemeKey = ''
    if (themePreference === 'light') {
      if (contrastLevel === 'standard') schemeKey = 'light'
      else if (contrastLevel === 'medium') schemeKey = 'light-medium-contrast'
      else schemeKey = 'light-high-contrast'
    } else {
      if (contrastLevel === 'standard') schemeKey = 'dark'
      else if (contrastLevel === 'medium') schemeKey = 'dark-medium-contrast'
      else schemeKey = 'dark-high-contrast'
    }

    const scheme = themeData.schemes[schemeKey as keyof typeof themeData.schemes]
    if (!scheme) return

    const root = document.documentElement

    // Toggle .dark class for Tailwind dark: variants compatibility
    if (themePreference === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Map Material Design tokens to shadcn CSS variable tokens
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
      destructive: scheme.error,
      'destructive-foreground': scheme.onError,
      border: scheme.outlineVariant,
      input: scheme.outlineVariant,
      ring: scheme.primary,
    }

    // Inject styles dynamically into :root
    Object.entries(mapping).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
  }, [themePreference, contrastLevel])

  return (
    <ThemeContext.Provider value={{ themePreference, contrastLevel, setThemePreference, setContrastLevel }}>
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