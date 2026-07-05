interface CircularTimerProps {
  timeLeft: number
  maxTime: number
  size?: number        // Optional: Custom size in pixels (default: 48px)
  strokeWidth?: number // Optional: Custom border width (default: 3px)
}

export function CircularTimer({ timeLeft, maxTime, size = 48, strokeWidth = 3 }: CircularTimerProps) {
    // Compute radius based on size and border stroke, leaving a small margin
    const radius = (size - strokeWidth - 6) / 2
    const circumference = 2 * Math.PI * radius
    
    // Calculate how much of the circular progress bar to show (offset)
    // Guard: Avoid division by zero or negative maxTime values
    const validMaxTime = maxTime > 0 ? maxTime : 1

    // Clamp the ratio between 0 and 1 to prevent layout overflows
    const ratio = Math.min(1, Math.max(0, timeLeft / validMaxTime))

    // Calculate how much of the circular progress bar to show (offset)
    const strokeOffset = circumference - ratio * circumference
    return (
        <div 
        className="relative flex items-center justify-center select-none" 
        style={{ width: size, height: size }}
        title="Time until next auto-refresh"
        >
        <svg className="w-full h-full transform -rotate-90">
            {/* Grey background circle track */}
            <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-muted-foreground/10 fill-none"
            strokeWidth={strokeWidth}
            />
            {/* Blue active progress circle overlay */}
            <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-primary fill-none transition-all duration-1000 ease-linear"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            />
        </svg>
        {/* Centered text showing seconds remaining */}
        <span className="absolute font-mono text-[10px] font-bold text-muted-foreground/80">
            {timeLeft}s
        </span>
        </div>
    )
}