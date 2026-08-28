export interface SqueezedEntry {
  id: string
  url: string
  original: string
  compressed: string
  originalTokens: number
  compressedTokens: number
  ratio: number
  ts: number
}

export type MessageType = "SQUEEZE_ACTIVE_FIELD" | "SQUEEZE_DONE" | "SQUEEZE_ERROR"

export interface ExtensionMessage {
  type: MessageType
  payload?: unknown
}
