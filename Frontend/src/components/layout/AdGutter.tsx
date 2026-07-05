import { Card } from '@/components/ui/card'

interface AdGutterProps {
  position: 'left' | 'right'
}

export function AdGutter({ position }: AdGutterProps) {
  return (
    <aside className="hidden xl:flex flex-col items-center justify-start py-8 px-4 border border-dashed border-border/80 rounded-2xl bg-card/30 backdrop-blur-sm min-h-[650px] text-center select-none sticky top-8 h-[calc(100vh-8rem)]">
      <div className="w-full flex flex-col items-center justify-center gap-1 border-b border-border/60 pb-4 mb-6">
        <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/50">Sponsored Space</span>
        <span className="text-[11px] text-muted-foreground/60">{position === 'left' ? 'Left Column' : 'Right Column'}</span>
      </div>
      
      {/* Decorative premium mockup of an advertisement card */}
      <Card className="w-full aspect-[300/600] max-h-[500px] border border-border/40 bg-card/60 flex flex-col items-center justify-center p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
        <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
          AD
        </div>
        <h4 className="font-semibold text-sm mb-2 text-foreground/80">Advertisement Placeholder</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Premium 300 x 600 banner layout optimized for high viewability.
        </p>
      </Card>
    </aside>
  )
}