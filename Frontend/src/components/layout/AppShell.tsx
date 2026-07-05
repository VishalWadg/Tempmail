import { AdGutter } from "./AdGutter"
import { Header } from "./Header"

type AppShellProps ={
    children: React.ReactNode
}

export function AppShell({children}: AppShellProps) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            <Header/>
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-[240px_1fr_240px] gap-6 max-w-[1600px] w-full mx-auto px-6 py-8">
                <AdGutter position="left" />
                <main className="flex flex-col gap-6 w-full min-w-0">
                    {children}
                </main>
                <AdGutter position="right" />
            </div>
        </div>
    )
}