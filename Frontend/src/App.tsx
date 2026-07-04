import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ThemeController } from '@/components/ThemeController'

function App() {
  const [email] = useState('example@tempmail.com')

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-primary">TempMail</span>
        </div>
        <div>
          {/* Theme switcher */}
          <ThemeController />
        </div>
      </header>

      {/* Main Responsive Grid Layout (Gutters on Left & Right) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[300px_1fr_300px] gap-6 max-w-[1600px] w-full mx-auto px-6 py-8">
        
        {/* Left Ad Gutter */}
        <aside className="hidden xl:flex flex-col items-center justify-center border border-dashed border-border rounded-lg bg-card/50 min-h-[600px] text-center p-4">
          <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground/60 mb-2">Advertisement</span>
          <div className="text-sm text-muted-foreground/80">300 x 600 Banner Space</div>
        </aside>

        {/* Center Panel (Main Application Workspace) */}
        <main className="flex flex-col gap-6 w-full">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2">Your Temporary Email Address</h2>
            <div className="text-xl font-mono bg-muted p-3 rounded border border-border select-all break-all">
              {email}
            </div>
          </Card>

          <Card className="flex-1 p-6 min-h-[400px] flex items-center justify-center text-muted-foreground">
            No messages received yet. Waiting for incoming mail...
          </Card>
        </main>

        {/* Right Ad Gutter */}
        <aside className="hidden xl:flex flex-col items-center justify-center border border-dashed border-border rounded-lg bg-card/50 min-h-[600px] text-center p-4">
          <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground/60 mb-2">Advertisement</span>
          <div className="text-sm text-muted-foreground/80">300 x 600 Banner Space</div>
        </aside>

      </div>
    </div>
  )
}

export default App