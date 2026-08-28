import { useState, useEffect, useCallback } from "react"
import { loadHistory, saveHistory } from "../lib/compress-client"
import { type SqueezedEntry } from "../lib/types"

export const useSqueezeHistory = () => {
  const [history, setHistory] = useState<SqueezedEntry[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const entries = await loadHistory()
    setHistory(entries)
    setLoading(false)
  }, [])

  const addEntry = useCallback(async (entry: SqueezedEntry) => {
    await saveHistory(entry)
    await refresh()
  }, [refresh])

  useEffect(() => { refresh() }, [refresh])

  return { history, loading, refresh, addEntry }
}
