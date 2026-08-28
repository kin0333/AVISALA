export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "memsqueeze",
      title: "Squeeze Context",
      contexts: ["editable"],
    })
  })

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== "memsqueeze" || !tab?.id) return
    chrome.tabs.sendMessage(tab.id, { type: "SQUEEZE_ACTIVE_FIELD" })
  })
})
