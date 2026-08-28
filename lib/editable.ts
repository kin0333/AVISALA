export type EditableElement = HTMLTextAreaElement | HTMLInputElement | HTMLElement

// Detects whether an element is squeezeble
export const isEditable = (el: Element | null): el is EditableElement => {
  if (!el) return false
  if (el instanceof HTMLTextAreaElement) return true
  if (el instanceof HTMLInputElement) {
    return ["text", "search", "url", "email"].includes(el.type)
  }
  return (el as HTMLElement).isContentEditable
}

export const readText = (el: EditableElement): string => {
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    return el.value
  }
  return el.textContent ?? ""
}

// Write back text, handling React-controlled inputs that intercept native .value= setter
export const writeText = (el: EditableElement, text: string): void => {
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    // React-controlled inputs: use native setter so React's event detects the change
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype,
      "value"
    )?.set
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(el, text)
    } else {
      el.value = text
    }
    el.dispatchEvent(new Event("input", { bubbles: true }))
    el.dispatchEvent(new Event("change", { bubbles: true }))
  } else {
    // contenteditable — execCommand preserves undo stack on supported browsers
    el.focus()
    document.execCommand("selectAll")
    document.execCommand("insertText", false, text)
    // Fallback for browsers that disabled execCommand
    if (el.textContent !== text) {
      el.textContent = text
      el.dispatchEvent(new InputEvent("input", { bubbles: true, data: text }))
    }
  }
}

// Best-effort position of the bottom-right of an element
export const getElementBounds = (el: HTMLElement) => el.getBoundingClientRect()
