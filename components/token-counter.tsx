import { cn } from "../lib/cn"

interface TokenCounterProps {
  value: number
  label?: string
  variant: "raw" | "compressed"
  className?: string
}

export const TokenCounter = ({ value, label, variant, className }: TokenCounterProps) => {
  const isRaw = variant === "raw"

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      {label && (
        <span className="text-xs uppercase tracking-widest text-white/40 font-medium">
          {label}
        </span>
      )}
      <span
        className={cn(
          "text-5xl font-black tabular-nums transition-all duration-75",
          isRaw
            ? "text-red-400"
            : "text-[#39FF14] drop-shadow-[0_0_12px_rgba(57,255,20,0.6)]"
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {value.toLocaleString()}
      </span>
      <span className="text-xs text-white/40">tokens</span>
    </div>
  )
}
