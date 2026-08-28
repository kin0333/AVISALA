import { cn } from "@/lib/cn"

interface TokenCounterProps {
  value: number
  variant: "raw" | "compressed"
}

export const TokenCounter = ({ value, variant }: TokenCounterProps) => {
  const isRaw = variant === "raw"

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={cn(
          "text-5xl font-black tabular-nums",
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
