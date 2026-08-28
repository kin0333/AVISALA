"use client"

import { useState } from "react"
import { MemoryColumn } from "@/components/memory-column"
import { useTokenRoll } from "@/hooks/use-token-roll"
import { cn } from "@/lib/cn"

const RAW_TOKEN_COUNT = 4200
const COMPRESSED_TOKEN_COUNT = 850

const SAMPLE_RAW = `[Turn 1] User: Hey, can you help me understand transformer architecture?
Assistant: Sure! Transformers use self-attention mechanisms to process sequences in parallel rather than sequentially like RNNs.

[Turn 2] User: Okay so how does attention work exactly? I'm a bit confused.
Assistant: Attention computes Query, Key, and Value vectors. Scores are Q·K / √d, softmaxed, then used to weight V.

[Turn 3] User: That makes sense. What about multi-head attention then?
Assistant: Multi-head attention runs several attention operations in parallel. Each head learns a different relationship.

[Turn 4] User: How is BERT different from GPT?
Assistant: BERT is encoder-only and bidirectional. GPT is decoder-only and causal — next-token prediction.`

const SAMPLE_COMPRESSED = `Transformers: self-attention (Q/K/V, scaled softmax), multi-head (parallel heads). BERT=encoder-only, masked LM, bidirectional. GPT=decoder-only, causal LM, left-context only.`

export const TokenDemo = () => {
  const [squeezed, setSqueezed] = useState(false)
  const [squeezing, setSqueezing] = useState(false)
  const { current, rolling, start, reset } = useTokenRoll(
    RAW_TOKEN_COUNT,
    COMPRESSED_TOKEN_COUNT,
    1400
  )

  const savingsPercent = Math.round((1 - COMPRESSED_TOKEN_COUNT / RAW_TOKEN_COUNT) * 100)

  const handleSqueeze = () => {
    if (rolling || squeezed) return
    setSqueezing(true)
    setTimeout(() => {
      setSqueezing(false)
      setSqueezed(true)
      start()
    }, 400)
  }

  const handleReset = () => {
    setSqueezed(false)
    setSqueezing(false)
    reset()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    squeezed ? handleReset() : handleSqueeze()
  }

  return (
    <section id="demo" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#39FF14]/70">
            Live token dashboard
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">
            4,200 tokens → 850 tokens
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/45">
            Same facts. Same answer. 80% less context bloat.
          </p>
        </div>
        <button
          className={cn(
            "rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 active:scale-95",
            squeezed
              ? "border border-[#3a3a3a] bg-[#2a2a2a] text-white/50 hover:text-white"
              : "bg-[#39FF14] text-black shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:bg-[#4aff2a]",
            squeezing && "pointer-events-none opacity-60"
          )}
          aria-label={squeezed ? "Reset demo" : "Run squeeze demo"}
          tabIndex={0}
          onClick={squeezed ? handleReset : handleSqueeze}
          onKeyDown={handleKeyDown}
        >
          {squeezing ? "Squeezing…" : squeezed ? "Reset demo" : "Run Squeeze"}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
            squeezed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-40"
          )}
        >
          <MemoryColumn
            title="Compressed Smart Context"
            badge={squeezed ? `${savingsPercent}% SMALLER` : "WAITING"}
            tokenCount={current}
            variant="compressed"
          >
            {squeezed ? (
              <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                {SAMPLE_COMPRESSED}
              </pre>
            ) : (
              <p className="py-8 text-center text-xs text-white/25">
                Click Run Squeeze to compress
              </p>
            )}
          </MemoryColumn>
        </div>
      </div>
    </section>
  )
}
