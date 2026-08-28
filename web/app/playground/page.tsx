import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ChatPlayground } from "@/components/chat-playground"

const PlaygroundPage = () => (
  <div className="min-h-screen bg-dark-bg">
    <SiteHeader />
    <main className="px-6 py-10">
      <ChatPlayground />
    </main>
    <SiteFooter />
  </div>
)

export default PlaygroundPage
