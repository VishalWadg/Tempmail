import { useTheme } from './ThemeProvider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sun, Moon, Contrast, Sparkles, Check } from 'lucide-react'

export function ThemeController() {
  const { themePreference, contrastLevel, setThemePreference, setContrastLevel } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95">
          {themePreference === 'light' ? (
            <Sun className="h-[1.2rem] w-[1.2rem] transition-all text-primary" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem] transition-all text-primary" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        
        <DropdownMenuItem 
          onClick={() => setThemePreference('light')} 
          className="flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sun className="h-4 w-4" /> Light
          </span>
          {themePreference === 'light' && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setThemePreference('dark')} 
          className="flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Moon className="h-4 w-4" /> Dark
          </span>
          {themePreference === 'dark' && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Contrast Level</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => setContrastLevel('standard')} 
          className="flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" /> Standard
          </span>
          {contrastLevel === 'standard' && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setContrastLevel('medium')} 
          className="flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Contrast className="h-4 w-4 text-muted-foreground" /> Medium
          </span>
          {contrastLevel === 'medium' && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setContrastLevel('high')} 
          className="flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Contrast className="h-4 w-4 text-primary" /> High
          </span>
          {contrastLevel === 'high' && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}