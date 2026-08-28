import { useState, useRef, useCallback } from "react"
import { compressText } from "../lib/compress-client"
import { type CompressResponse } from "../lib/compress-client"

interface UseCompressState {
  loading: boolean
  error: string | null
  result: CompressResponse | null
}

export const useCompress = () => {
  const [state, setState] = useState<UseCompressState>({
    loading: false,
    error: null,
    result: null,
  })
  const abortRef = useRef<AbortController | null>(null)

  const squeeze = useCallback(async (text: string): Promise<CompressResponse | null> => {
    if (!text.trim()) return null
    abortRef.current?.abort()
    setState({ loading: true, error: null, result: null })
    try {
      const result = await compressText(text)
      setState({ loading: false, error: null, result })
      return result
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      setState({ loading: false, error: msg, result: null })
      return null
    }
  }, [])

  return { ...state, squeeze }
}
