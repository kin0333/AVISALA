export const estimateTokens = (text: string): number =>
  Math.ceil(text.length / 4)

export interface CompressResponse {
  compressed: string
  original_tokens: number
  compressed_tokens: number
  ratio: number
}

const FILLER_WORDS =
  /\b(um|uh|like|so|basically|literally|just|very|really|quite|actually|honestly|you know|i mean|kind of|sort of|you see|the thing is|as you can see|in other words|needless to say|as i mentioned|to be honest|to be fair|at the end of the day|with that being said)\b/gi

export const compressText = (text: string): CompressResponse => {
  const lines = text.split("\n")
  const squeezed = lines
    .map(line =>
      line
        .replace(FILLER_WORDS, "")
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
    ratio: original_tokens === 0 ? 0 : 1 - compressed_tokens / original_tokens,
  }
}
