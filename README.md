# MemSqueeze

**Infinite local memory. Zero token bloat.**

A Chrome extension that compresses prompts by 50–80% before they hit the LLM — right from any text box on any page.

## Phase 1 — Chrome Extension + Token Dashboard

### Stack

- **Bun** (runtime & package manager)
- **WXT** (extension framework, Manifest V3)
- **React 18** + **TypeScript** + **Tailwind CSS**

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Generate WXT types
npm run prepare

# 3. Terminal A — mock compression server
bun run server

# 4. Terminal B — extension dev build (hot reload)
npm run dev
```

Then in Chrome:
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select `.output/chrome-mv3`
4. Open `demo/playground.html` in Chrome to test

---

## How to Use

| Method | Steps |
|---|---|
| **Right-click menu** | Focus any text box on any site → right-click → **Squeeze Context** |
| **Focus chip** | Click inside any text field → a dark chip appears → click **Squeeze Context** |
| **Token Dashboard** | Click the extension icon → **Open Token Dashboard** |

---

## Architecture

```
entrypoints/
  background.ts          — context menu creation + message relay
  content/index.tsx      — shadow-DOM chip injection + squeeze logic
  dashboard/             — Token Dashboard (4,200 → 850 demo)
  popup/                 — extension popup

components/
  squeeze-chip.tsx       — the floating Squeeze Context button
  token-counter.tsx      — animated token number display
  memory-column.tsx      — left/right dashboard panels

hooks/
  use-compress.ts        — POST /compress + state management
  use-token-roll.ts      — requestAnimationFrame counter animation
  use-squeeze-history.ts — chrome.storage history

lib/
  compress-client.ts     — HTTP client with in-browser fallback
  editable.ts            — detect/read/write textarea + contenteditable
  token-estimate.ts      — ~4 chars/token estimator
  types.ts               — shared types

server/
  index.ts               — Bun mock POST /compress (port 8000)

demo/
  playground.html        — textarea + contenteditable test page
```

---

## Mock Server

The Bun server at `http://localhost:8000/compress` accepts:

```json
POST /compress
{ "text": "your long prompt here" }
```

Returns:

```json
{
  "compressed": "…dense compressed text…",
  "original_tokens": 420,
  "compressed_tokens": 95,
  "ratio": 0.77
}
```

**No server needed** — the extension falls back to an in-browser compressor automatically.

---

## Phase 2 Roadmap

- [ ] LLMLingua-2 (Microsoft) Python server replacing the mock
- [ ] ChromaDB vector store for long-term memory across sessions
- [ ] Local Ollama/Qwen integration for on-device generation
- [ ] Streamlit/Gradio analytics dashboard
