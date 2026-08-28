import { type ReactNode } from "react"
import { cn } from "@/lib/cn"
import { TokenCounter } from "@/components/token-counter"

interface MemoryColumnProps {
  title: string
  badge?: string
  tokenCount: number
  variant: "raw" | "compressed"
  children: ReactNode
}

export const MemoryColumn = ({
  title,
  badge,
  tokenCount,
  variant,
  children,
}: MemoryColumnProps) => (
  <div
    className={cn(
      "flex flex-col gap-6 rounded-2xl border p-8 shadow-card",
      "bg-dark-card",
      variant === "raw" ? "border-red-900/40" : "border-[#39FF14]/20"
    )}
  >
    <div className="flex items-center justify-between">
      <h2 className="text-base font-semibold text-white/80">{title}</h2>
      {badge && (
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-bold",
            variant === "raw"
              ? "border border-red-800/40 bg-red-950 text-red-400"
              : "border border-[#39FF14]/30 bg-[#39FF14]/10 text-[#39FF14]"
          )}
        >
          {badge}
        </span>
      )}
    </div>
    <TokenCounter value={tokenCount} variant={variant} />
    <div
      className={cn(
        "max-h-72 flex-1 overflow-y-auto rounded-xl border p-4 text-sm leading-relaxed",
        "bg-[#0f0f0f]",
        variant === "raw"
          ? "border-red-900/20 text-white/50"
          : "border-[#39FF14]/10 text-white/80"
      )}
    >
      {children}
    </div>
  </div>
)
