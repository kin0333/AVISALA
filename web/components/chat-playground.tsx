"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { type CompressResponse } from "@/lib/compress"
import { estimateTokens } from "@/lib/compress"
import { cn } from "@/lib/cn"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  text: string
}

const STARTER_PROMPT =
  "You are a helpful assistant. I have been working on a transformer-based language model and I want to understand how multi-head attention works in detail. Basically, um, I mean the thing is, I'm really confused about how the Q, K, V matrices are computed and what the attention scores actually represent in terms of, like, semantic similarity between tokens. Can you explain it step by step? Also, I want to understand positional encodings as well — both the sinusoidal kind and the learned kind. And actually, can you tell me about layer normalization too? I'm kind of confused about where it goes in the architecture."

const SAMPLE_REPLY =
  "Multi-head attention runs Q/K/V projections in parallel. Scores are scaled dot-products, softmaxed, then used to weight values. Positional encodings restore order. LayerNorm sits before or after each block."

export const ChatPlayground = () => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [textareaValue, setTextareaValue] = useState(STARTER_PROMPT)
  const [searchValue, setSearchValue] = useState("transformer attention QKV layer norm")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "This is a live AVISALA prompt box — same kind of composer ChatGPT and Claude use. Right-click → Squeeze Context, or hit Squeeze before you send.",
    },
  ])
  const [loading, setLoading] = useState(false)
  const [lastResult, setLastResult] = useState<CompressResponse | null>(null)
  const [status, setStatus] = useState("Ready")

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerText.trim()) {
      editorRef.current.innerText = STARTER_PROMPT
    }
  }, [])

  const readComposer = () => {
    const editable = editorRef.current?.innerText?.trim() ?? ""
    return editable || textareaValue
  }

  const handleSqueeze = useCallback(async () => {
    const text = readComposer()
    if (!text.trim()) return

    setLoading(true)
    setStatus("Squeezing…")
    try {
      const response = await fetch("/api/compress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!response.ok) throw new Error("Compress failed")
      const result = await response.json() as CompressResponse
      setLastResult(result)
      setTextareaValue(result.compressed)
      if (editorRef.current) editorRef.current.innerText = result.compressed
      const savings = Math.round(result.ratio * 100)
      setStatus(`Squeezed · ${savings}% fewer tokens`)
    } catch {
      setStatus("Could not reach compressor")
    } finally {
      setLoading(false)
    }
  }, [textareaValue])

  const handleSend = () => {
    const text = readComposer()
    if (!text.trim()) return

    setMessages(current => [
      ...current,
      { id: crypto.randomUUID(), role: "user", text },
      { id: crypto.randomUUID(), role: "assistant", text: SAMPLE_REPLY },
    ])
    setTextareaValue("")
    if (editorRef.current) editorRef.current.innerText = ""
    setStatus("Sent")
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleSqueezeKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleSqueeze()
    }
  }

  const handleSendKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleSend()
    }
  }

  const originalTokens = lastResult?.original_tokens ?? estimateTokens(readComposer())
  const compressedTokens = lastResult?.compressed_tokens ?? originalTokens

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#39FF14]/70">
            Live composer
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight">AVISALA chat</h1>
        </div>
        <div className="flex items-center gap-3">
          <label className="sr-only" htmlFor="avisala-search">Search chats</label>
          <input
            id="avisala-search"
            type="search"
            value={searchValue}
            placeholder="Search chats"
            className="w-44 rounded-full border border-dark-border bg-dark-card px-3 py-1.5 text-xs text-white/80 outline-none focus:border-[#39FF14]/40"
            onChange={event => setSearchValue(event.target.value)}
          />
          <div className="rounded-full border border-dark-border bg-dark-card px-3 py-1 text-xs text-white/50">
            {status}
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-red-900/30 bg-dark-card px-4 py-3">
          <p className="text-[10px] uppercase tracking-widest text-red-400/70">Raw</p>
          <p className="text-2xl font-black tabular-nums text-red-400">{originalTokens.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[#39FF14]/20 bg-dark-card px-4 py-3">
          <p className="text-[10px] uppercase tracking-widest text-[#39FF14]/70">Squeezed</p>
          <p className="text-2xl font-black tabular-nums text-[#39FF14]">{compressedTokens.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-2xl border border-dark-border bg-[#111] p-5 shadow-card">
        {messages.map(message => (
          <div
            key={message.id}
            className={cn(
              "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
              message.role === "user"
                ? "ml-auto bg-[#39FF14]/10 text-white"
                : "bg-[#1c1c1c] text-white/80"
            )}
          >
            <p className="mb-1 text-[10px] uppercase tracking-widest text-white/35">
              {message.role === "user" ? "You" : "AVISALA"}
            </p>
            {message.text}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-dark-border bg-dark-card p-3 shadow-card">
        <label className="sr-only" htmlFor="avisala-prompt">Prompt</label>
        <textarea
          id="avisala-prompt"
          className="mb-3 min-h-[96px] w-full resize-y rounded-xl border border-dark-border bg-[#0f0f0f] px-4 py-3 text-sm leading-relaxed text-white outline-none focus:border-[#39FF14]/40"
          value={textareaValue}
          placeholder="Paste a long prompt, then squeeze it…"
          onChange={event => setTextareaValue(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-label="AVISALA contenteditable prompt"
          tabIndex={0}
          suppressContentEditableWarning
          className="mb-3 min-h-[88px] rounded-xl border border-dashed border-dark-border bg-[#0f0f0f] px-4 py-3 text-sm leading-relaxed text-white/80 outline-none focus:border-[#39FF14]/40"
          onKeyDown={handleKeyDown}
        />

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-white/35">
            Right-click either box → Squeeze Context, or use the button.
          </p>
          <div className="flex gap-2">
            <button
              className="rounded-xl border border-[#39FF14]/30 bg-[#39FF14]/10 px-4 py-2 text-sm font-bold text-[#39FF14] transition-all hover:bg-[#39FF14]/20 active:scale-95 disabled:opacity-50"
              aria-label="Squeeze context in this prompt"
              tabIndex={0}
              disabled={loading}
              onClick={handleSqueeze}
              onKeyDown={handleSqueezeKeyDown}
            >
              {loading ? "Squeezing…" : "Squeeze Context"}
            </button>
            <button
              className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black transition-all hover:bg-white/90 active:scale-95"
              aria-label="Send prompt"
              tabIndex={0}
              onClick={handleSend}
              onKeyDown={handleSendKeyDown}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
