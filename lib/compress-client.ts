import { estimateTokens } from "./token-estimate"
import { type SqueezedEntry } from "./types"

const SERVER_URL = "http://localhost:8000/compress"
const HISTORY_KEY = "memsqueeze_history"
const MAX_HISTORY = 20

export interface CompressRequest {
  text: string
}

export interface CompressResponse {
  compressed: string
  original_tokens: number
  compressed_tokens: number
  ratio: number
}

// Naïve in-client fallback compressor: drop filler words and short lines
const clientCompress = (text: string): CompressResponse => {
  const fillerWords = /\b(um|uh|like|so|basically|literally|just|very|really|quite|actually|honestly|you know|i mean|kind of|sort of|you see|the thing is|as you can see)\b/gi
  const lines = text.split("\n")

  const squeezed = lines
    .map(line =>
      line
        .replace(fillerWords, "")
        .replace(/(?:[,;]\s*){2,}/g, ", ")
        .replace(/\.\s*[,;]/g, ".")
        .replace(/[,;]\s*\./g, ".")
        .replace(/^\s*[,;]\s*/g, "")
        .replace(/\s*[,;]\s*$/g, "")
        .replace(/\s{2,}/g, " ")
        .trim()
    )
    .filter(line => line.length > 0)
    .filter((line, i, arr) => i === 0 || line !== arr[i - 1])
    .join("\n")

  const original_tokens = estimateTokens(text)
  const compressed_tokens = estimateTokens(squeezed)
  return {
    compressed: squeezed,
    original_tokens,
    compressed_tokens,
    ratio: 1 - compressed_tokens / original_tokens,
  }
}

export const compressText = async (text: string): Promise<CompressResponse> => {
  try {
    const res = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text } satisfies CompressRequest),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json() as Promise<CompressResponse>
  } catch {
    // Server is down — fall back to client-side compressor so extension is always runnable
    return clientCompress(text)
  }
}

export const saveHistory = async (entry: SqueezedEntry): Promise<void> => {
  const existing = await loadHistory()
  const updated = [entry, ...existing].slice(0, MAX_HISTORY)
  await chrome.storage.local.set({ [HISTORY_KEY]: updated })
}

export const loadHistory = async (): Promise<SqueezedEntry[]> => {
  const data = await chrome.storage.local.get(HISTORY_KEY)
  return (data[HISTORY_KEY] as SqueezedEntry[]) ?? []
}
