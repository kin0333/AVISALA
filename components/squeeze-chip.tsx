import { useState, useEffect, useCallback } from "react"
import { cn } from "../lib/cn"
import { useCompress } from "../hooks/use-compress"

interface SqueezeChipProps {
  targetEl: HTMLElement
  onDone?: (original: string, compressed: string, ratio: number) => void
  onDismiss?: () => void
}

export const SqueezeChip = ({ targetEl, onDone, onDismiss }: SqueezeChipProps) => {
  const { loading, squeeze } = useCompress()
  const [done, setDone] = useState(false)
  const [savings, setSavings] = useState(0)

  const handleClick = useCallback(async () => {
    const text = targetEl instanceof HTMLTextAreaElement || targetEl instanceof HTMLInputElement
      ? targetEl.value
      : targetEl.textContent ?? ""

    if (!text.trim()) return
    const result = await squeeze(text)
    if (!result) return

    // Write back to field
    if (targetEl instanceof HTMLTextAreaElement || targetEl instanceof HTMLInputElement) {
      const setter = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(targetEl),
        "value"
      )?.set
      setter ? setter.call(targetEl, result.compressed) : (targetEl.value = result.compressed)
      targetEl.dispatchEvent(new Event("input", { bubbles: true }))
      targetEl.dispatchEvent(new Event("change", { bubbles: true }))
    } else {
      targetEl.focus()
      document.execCommand("selectAll")
      document.execCommand("insertText", false, result.compressed)
    }

    setSavings(Math.round(result.ratio * 100))
    setDone(true)
    onDone?.(text, result.compressed, result.ratio)
    setTimeout(() => onDismiss?.(), 2000)
  }, [targetEl, squeeze, onDone, onDismiss])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
    if (e.key === "Escape") onDismiss?.()
  }, [handleClick, onDismiss])

  return (
    <button
      className={cn(
        "memsqueeze-chip",
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
        "bg-[#1a1a1a] border border-[#2a2a2a] text-white",
        "shadow-[0_2px_12px_rgba(0,0,0,0.6)]",
        "transition-all duration-200 hover:border-[#39FF14] hover:shadow-[0_0_12px_rgba(57,255,20,0.25)]",
        "active:scale-95 cursor-pointer",
        "animate-[squeezeIn_0.2s_cubic-bezier(0.34,1.56,0.64,1)_forwards]",
        done && "border-[#39FF14]"
      )}
      aria-label="Squeeze Context — compress this prompt to use fewer tokens"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={loading}
    >
      <span
        className={cn(
          "w-2 h-2 rounded-full",
          loading ? "bg-yellow-400 animate-pulse" : done ? "bg-[#39FF14]" : "bg-[#39FF14]/60"
        )}
        aria-hidden="true"
      />
      {loading ? "Squeezing…" : done ? `Squeezed · ${savings}% smaller` : "Squeeze Context"}
    </button>
  )
}
