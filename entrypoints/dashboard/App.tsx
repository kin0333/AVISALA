import { useState } from "react"
import { MemoryColumn } from "../../components/memory-column"
import { useTokenRoll } from "../../hooks/use-token-roll"
import { useSqueezeHistory } from "../../hooks/use-squeeze-history"
import { cn } from "../../lib/cn"
import { type SqueezedEntry } from "../../lib/types"

const RAW_TOKEN_COUNT = 4200
const COMPRESSED_TOKEN_COUNT = 850

const SAMPLE_RAW = `[Turn 1] User: Hey, can you help me understand transformer architecture?
Assistant: Sure! Transformers use self-attention mechanisms to process sequences in parallel rather than sequentially like RNNs. The key innovation is the attention mechanism which allows the model to weigh the importance of different parts of the input when generating each output token.

[Turn 2] User: Okay so how does attention work exactly? I'm a bit confused.
Assistant: Great question! Attention works by computing three vectors for each token: Query (Q), Key (K), and Value (V). The attention score between two tokens is computed as the dot product of Q and K, scaled by the square root of the dimension, then passed through softmax. These scores weight the V vectors to produce the output.

[Turn 3] User: That makes sense. What about multi-head attention then?
Assistant: Multi-head attention runs several attention operations in parallel with different learned weight matrices. Each "head" can learn to attend to different aspects of the relationship between tokens. The outputs are concatenated and linearly projected.

[Turn 4] User: And the feedforward network?
Assistant: After each attention layer there's a position-wise feedforward network applied identically to each position. It consists of two linear transformations with a ReLU activation in between, allowing the model to apply non-linear transformations to the attended representations.

[Turn 5] User: What's layer normalization doing in there?
Assistant: Layer normalization normalizes the inputs across the feature dimension for each training example independently. It helps stabilize training and allows for higher learning rates. In transformers it's applied before or after attention and feedforward layers.

[Turn 6] User: How does positional encoding work?
Assistant: Since attention has no inherent notion of sequence order, positional encodings are added to the input embeddings. The original paper uses sine and cosine functions of different frequencies. Learned positional encodings are also common in modern models.

[Turn 7] User: What about the encoder-decoder architecture?
Assistant: The original transformer had both encoder and decoder. The encoder processes the input sequence bidirectionally. The decoder generates output auto-regressively, using masked self-attention to prevent attending to future tokens, and cross-attention to attend to the encoder output.

[Turn 8] User: How is BERT different from GPT?
Assistant: BERT is encoder-only and uses masked language modeling for pre-training — it predicts randomly masked tokens using bidirectional context. GPT is decoder-only and uses causal language modeling — it predicts the next token using only left context. BERT excels at understanding tasks; GPT at generation tasks.`

const SAMPLE_COMPRESSED = `Transformers: self-attention (Q/K/V dot-product, scaled, softmax-weighted V), multi-head (parallel heads, concat+linear), position-wise FFN (2 linear+ReLU), LayerNorm (stabilizes training), sinusoidal/learned positional encodings. Encoder-decoder: encoder=bidirectional; decoder=masked self-attn + cross-attn (autoregressive). BERT=encoder-only, masked LM, bidirectional. GPT=decoder-only, causal LM, left-context only.`

export const DashboardApp = () => {
  const [squeezed, setSqueezed] = useState(false)
  const [squeezing, setSqueezing] = useState(false)
  const { history, loading: histLoading } = useSqueezeHistory()

  const { current: compressedCount, rolling, start: startRoll, reset: resetRoll } = useTokenRoll(
    RAW_TOKEN_COUNT,
    COMPRESSED_TOKEN_COUNT,
    1400
  )

  const handleSqueeze = () => {
    if (rolling || squeezed) return
    setSqueezing(true)
    setTimeout(() => {
      setSqueezing(false)
      setSqueezed(true)
      startRoll()
    }, 400)
  }

  const handleReset = () => {
    setSqueezed(false)
    setSqueezing(false)
    resetRoll()
  }

  const savingsPercent = Math.round((1 - COMPRESSED_TOKEN_COUNT / RAW_TOKEN_COUNT) * 100)

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-8 py-10 flex flex-col gap-8">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-[#39FF14]">MEM</span>SQUEEZE
          </h1>
          <p className="text-white/40 text-sm mt-1">Infinite local memory. Zero token bloat.</p>
        </div>
        <div className="flex gap-3 items-center">
          {squeezed && (
            <div className="rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/30 px-5 py-2 text-sm font-bold text-[#39FF14] animate-[squeezeIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
              {savingsPercent}% fewer tokens
            </div>
          )}
          <button
            className={cn(
              "rounded-xl px-5 py-2 text-sm font-bold transition-all duration-200",
              squeezed
                ? "bg-[#2a2a2a] border border-[#3a3a3a] text-white/50 hover:text-white hover:border-[#4a4a4a]"
                : "bg-[#39FF14] text-black hover:bg-[#4aff2a] shadow-[0_0_20px_rgba(57,255,20,0.4)]",
              "active:scale-95",
              squeezing && "opacity-60 pointer-events-none"
            )}
            aria-label={squeezed ? "Reset demo" : "Squeeze context"}
            tabIndex={0}
            onClick={squeezed ? handleReset : handleSqueeze}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") squeezed ? handleReset() : handleSqueeze() }}
          >
            {squeezing ? "Squeezing…" : squeezed ? "↺ Reset Demo" : "▶ Run Squeeze"}
          </button>
        </div>
      </header>

      {/* Main two-column grid */}
      <div className="grid grid-cols-2 gap-6">
        <MemoryColumn
          title="Raw Memory"
          badge="UNCOMPRESSED"
          tokenCount={RAW_TOKEN_COUNT}
          variant="raw"
        >
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">{SAMPLE_RAW}</pre>
        </MemoryColumn>

        <div
          className={cn(
            "transition-all duration-500",
            squeezed ? "opacity-100 translate-y-0" : "opacity-40 translate-y-2"
          )}
        >
          <MemoryColumn
            title="Compressed Smart Context"
            badge={squeezed ? `${savingsPercent}% SMALLER` : "WAITING"}
            tokenCount={compressedCount}
            variant="compressed"
          >
            <pre
              className={cn(
                "whitespace-pre-wrap font-sans text-xs leading-relaxed transition-opacity duration-500",
                squeezed ? "opacity-100" : "opacity-0"
              )}
            >
              {SAMPLE_COMPRESSED}
            </pre>
            {!squeezed && (
              <p className="text-white/20 text-xs text-center py-8">
                Click <span className="text-[#39FF14]">▶ Run Squeeze</span> to compress
              </p>
            )}
          </MemoryColumn>
        </div>
      </div>

      {/* Arrow label */}
      <div className="flex items-center justify-center gap-4 -mt-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-red-900/30" />
        <div
          className={cn(
            "text-xs text-white/40 px-4 py-1.5 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] transition-all duration-500",
            squeezed && "text-[#39FF14] border-[#39FF14]/30"
          )}
        >
          {squeezed
            ? `MemSqueeze pipeline → ${savingsPercent}% reduction, same meaning`
            : "MemSqueeze pipeline"}
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#39FF14]/20" />
      </div>

      {/* Live squeeze history */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
            Live Squeeze History
          </h2>
          <span className="text-xs text-white/30">{history.length} squeezes recorded</span>
        </div>

        {histLoading ? (
          <p className="text-white/20 text-sm">Loading history…</p>
        ) : history.length === 0 ? (
          <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 text-center">
            <p className="text-white/30 text-sm">No squeezes yet.</p>
            <p className="text-white/20 text-xs mt-1">
              Right-click any text box in your browser and choose <span className="text-[#39FF14]/60">Squeeze Context</span>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {history.map((entry: SqueezedEntry) => (
              <HistoryRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

const HistoryRow = ({ entry }: { entry: SqueezedEntry }) => {
  const [expanded, setExpanded] = useState(false)
  const savings = Math.round(entry.ratio * 100)
  const date = new Date(entry.ts).toLocaleTimeString()

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[#39FF14] font-bold text-sm tabular-nums shrink-0">
            -{savings}%
          </span>
          <span className="text-white/40 text-xs truncate">{entry.url}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-white/30 tabular-nums">
            {entry.originalTokens.toLocaleString()} → {entry.compressedTokens.toLocaleString()} tk
          </span>
          <span className="text-xs text-white/20">{date}</span>
          <button
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
            aria-label={expanded ? "Collapse history entry" : "Expand history entry"}
            tabIndex={0}
            onClick={() => setExpanded(v => !v)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setExpanded(v => !v) }}
          >
            {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="rounded-lg bg-[#0f0f0f] border border-red-900/20 p-3">
            <p className="text-[10px] text-red-400/60 uppercase tracking-wider mb-1">Original</p>
            <p className="text-xs text-white/50 leading-relaxed line-clamp-5">{entry.original}</p>
          </div>
          <div className="rounded-lg bg-[#0f0f0f] border border-[#39FF14]/10 p-3">
            <p className="text-[10px] text-[#39FF14]/60 uppercase tracking-wider mb-1">Compressed</p>
            <p className="text-xs text-white/70 leading-relaxed line-clamp-5">{entry.compressed}</p>
          </div>
        </div>
      )}
    </div>
  )
}
