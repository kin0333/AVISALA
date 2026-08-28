// Bun mock compression server — POST http://localhost:8000/compress
// Replace this with LLMLingua-2 or a Python compressor in Phase 2

const FILLER_WORDS =
  /\b(um|uh|like|so|basically|literally|just|very|really|quite|actually|honestly|you know|i mean|kind of|sort of|you see|the thing is|as you can see|in other words|needless to say|as i mentioned|to be honest|to be fair|at the end of the day|with that being said)\b/gi

const estimateTokens = (text: string) => Math.ceil(text.length / 4)

const compress = (text: string) => {
  const lines = text.split("\n")
  const squeezed = lines
    .map(line =>
      line
        .replace(FILLER_WORDS, "")
        // Collapse N consecutive commas/semicolons left by removed words
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

const server = Bun.serve({
  port: 8000,
  fetch(req) {
    // CORS pre-flight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      })
    }

    if (req.method === "POST" && new URL(req.url).pathname === "/compress") {
      return req.json().then((body: { text?: string }) => {
        const text = body?.text ?? ""
        if (!text) {
          return new Response(JSON.stringify({ error: "text is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          })
        }
        const result = compress(text)
        return new Response(JSON.stringify(result), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
      })
    }

    return new Response("MemSqueeze mock API — POST /compress", {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
  },
})

console.log(`\n  MemSqueeze mock server running at http://localhost:${server.port}\n`)
