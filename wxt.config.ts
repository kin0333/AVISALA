import { defineConfig } from "wxt"

export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "MemSqueeze",
    description: "Infinite local memory. Zero token bloat.",
    version: "0.1.0",
    permissions: ["contextMenus", "storage", "activeTab"],
    host_permissions: ["http://localhost:8000/*", "<all_urls>"],
    action: {
      default_popup: "popup.html",
      default_title: "MemSqueeze",
    },
  },
})
