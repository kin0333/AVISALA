import { type ReactNode } from "react"
import { cn } from "../lib/cn"
import { TokenCounter } from "./token-counter"

interface MemoryColumnProps {
  title: string
  badge?: string
  tokenCount: number
  variant: "raw" | "compressed"
  children: ReactNode
  className?: string
}

export const MemoryColumn = ({
  title,
  badge,
  tokenCount,
  variant,
  children,
  className,
}: MemoryColumnProps) => (
  <div
    className={cn(
      "flex flex-col gap-6 rounded-2xl border p-8",
      "bg-[#1a1a1a] shadow-[0_4px_24px_rgba(0,0,0,0.4)]",
      variant === "raw" ? "border-red-900/40" : "border-[#39FF14]/20",
      className
    )}
  >
    <div className="flex items-center justify-between">
      <h2 className="text-base font-semibold text-white/80">{title}</h2>
      {badge && (
        <span
          className={cn(
            "text-xs font-bold px-2.5 py-0.5 rounded-full",
            variant === "raw"
              ? "bg-red-950 text-red-400 border border-red-800/40"
              : "bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30"
          )}
        >
          {badge}
        </span>
      )}
    </div>

    <TokenCounter value={tokenCount} variant={variant} />

    <div
      className={cn(
        "flex-1 rounded-xl p-4 text-sm leading-relaxed overflow-y-auto max-h-72",
        "bg-[#0f0f0f] border",
        variant === "raw" ? "border-red-900/20 text-white/50" : "border-[#39FF14]/10 text-white/80"
      )}
    >
      {children}
    </div>
  </div>
)
