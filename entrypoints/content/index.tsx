import { createRoot } from "react-dom/client"
import { SqueezeChip } from "../../components/squeeze-chip"
import { saveHistory } from "../../lib/compress-client"
import { isEditable } from "../../lib/editable"
import { estimateTokens } from "../../lib/token-estimate"
import { type SqueezedEntry } from "../../lib/types"

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",

  async main(ctx) {
    // Track the most-recently-focused editable element
    let activeEl: HTMLElement | null = null

    const ui = await createShadowRootUi(ctx, {
      name: "memsqueeze-chip-host",
      position: "inline",
      anchor: "body",
      onMount(container) {
        container.style.cssText = [
          "position: fixed",
          "z-index: 2147483647",
          "pointer-events: none",
          "bottom: 0",
          "right: 0",
          "padding: 0",
          "margin: 0",
        ].join(";")
      },
    })

    let chipRoot: ReturnType<typeof createRoot> | null = null
    let chipContainer: HTMLDivElement | null = null

    const dismissChip = () => {
      chipRoot?.unmount()
      chipRoot = null
      chipContainer?.remove()
      chipContainer = null
    }

    const mountChip = (el: HTMLElement) => {
      dismissChip()

      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      chipContainer = document.createElement("div")
      chipContainer.style.cssText = [
        "position: fixed",
        `top: ${rect.bottom - 34}px`,
        `left: ${rect.right - 160}px`,
        "pointer-events: all",
        "z-index: 2147483647",
      ].join(";")

      ui.shadow.appendChild(chipContainer)
      chipRoot = createRoot(chipContainer)
      chipRoot.render(
        <SqueezeChip
          targetEl={el}
          onDone={async (original, compressed, ratio) => {
            const entry: SqueezedEntry = {
              id: crypto.randomUUID(),
              url: window.location.href,
              original,
              compressed,
              originalTokens: estimateTokens(original),
              compressedTokens: estimateTokens(compressed),
              ratio,
              ts: Date.now(),
            }
            await saveHistory(entry)
          }}
          onDismiss={dismissChip}
        />
      )
    }

    // Show chip on focus
    document.addEventListener("focusin", (e) => {
      const target = e.target as Element
      if (isEditable(target)) {
        activeEl = target as HTMLElement
        mountChip(activeEl)
      }
    })

    // Hide chip on blur (with small delay so click on chip fires first)
    document.addEventListener("focusout", () => {
      setTimeout(() => {
        if (!ui.shadow.contains(document.activeElement)) dismissChip()
      }, 150)
    })

    // Handle context-menu message from background
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === "SQUEEZE_ACTIVE_FIELD" && activeEl) {
        mountChip(activeEl)
        // Programmatically trigger the squeeze
        const btn = ui.shadow.querySelector<HTMLButtonElement>(".memsqueeze-chip")
        btn?.click()
      }
    })

    // Re-position chip on scroll / resize
    const reposition = () => {
      if (activeEl && chipContainer) {
        const rect = activeEl.getBoundingClientRect()
        chipContainer.style.top = `${rect.bottom - 34}px`
        chipContainer.style.left = `${rect.right - 160}px`
      }
    }
    window.addEventListener("scroll", reposition, { passive: true })
    window.addEventListener("resize", reposition, { passive: true })

    ui.mount()
  },
})
