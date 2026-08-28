import { useEffect, useState } from "react"
import { loadHistory } from "../../lib/compress-client"
import { type SqueezedEntry } from "../../lib/types"
import { cn } from "../../lib/cn"

export const PopupApp = () => {
  const [history, setHistory] = useState<SqueezedEntry[]>([])
  const [avgSavings, setAvgSavings] = useState(0)

  useEffect(() => {
    loadHistory().then((entries) => {
      setHistory(entries)
      if (entries.length > 0) {
        const avg = entries.reduce((sum, e) => sum + e.ratio, 0) / entries.length
        setAvgSavings(Math.round(avg * 100))
      }
    })
  }, [])

  const handleOpenDashboard = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") })
  }

  return (
    <div className="w-72 bg-[#0f0f0f] text-white p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#39FF14] text-lg font-black tracking-tight">MEM</span>
          <span className="text-white text-lg font-black tracking-tight">SQUEEZE</span>
        </div>
        <span className="text-[10px] text-white/30 uppercase tracking-widest">v0.1</span>
      </div>

      {/* Stats */}
      <div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-4 flex items-center justify-between">
        <div className="text-center">
          <div className="text-2xl font-black text-[#39FF14]">
            {history.length > 0 ? `${avgSavings}%` : "—"}
          </div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">avg savings</div>
        </div>
        <div className="w-px h-8 bg-[#2a2a2a]" />
        <div className="text-center">
          <div className="text-2xl font-black text-white">{history.length}</div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">squeezes</div>
        </div>
        <div className="w-px h-8 bg-[#2a2a2a]" />
        <div className="text-center">
          <div className="text-2xl font-black text-white">
            {history.length > 0 ? history[0].compressedTokens.toLocaleString() : "—"}
          </div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">last tokens</div>
        </div>
      </div>

      {/* How to use */}
      <div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-3 space-y-1.5">
        <p className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">How to use</p>
        <p className="text-xs text-white/50 leading-relaxed">
          Right-click any text box → <span className="text-[#39FF14] font-medium">Squeeze Context</span>
        </p>
        <p className="text-xs text-white/50 leading-relaxed">
          Or click the floating chip that appears when a text box is focused.
        </p>
      </div>

      {/* Server notice */}
      <div className="rounded-lg bg-yellow-950/30 border border-yellow-900/20 px-3 py-2 text-[10px] text-yellow-500/70 leading-relaxed">
        For better compression run: <code className="font-mono text-yellow-400">bun run server</code>
        <br />Falls back to in-browser mode if server is offline.
      </div>

      {/* Open Dashboard */}
      <button
        className={cn(
          "w-full py-2.5 rounded-xl text-sm font-bold",
          "bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14]",
          "hover:bg-[#39FF14]/20 hover:shadow-[0_0_16px_rgba(57,255,20,0.2)]",
          "active:scale-[0.98] transition-all duration-150"
        )}
        aria-label="Open Token Dashboard"
        tabIndex={0}
        onClick={handleOpenDashboard}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleOpenDashboard() }}
      >
        Open Token Dashboard ↗
      </button>
    </div>
  )
}
