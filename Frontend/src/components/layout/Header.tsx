import { ThemeController } from './ThemeController'

export function Header(){
    return (
        <header className="border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-primary">TempMail</span>
            </div>
            <div>
                {/* Theme switcher */}
                <ThemeController />
            </div>
        </header>
    )
}