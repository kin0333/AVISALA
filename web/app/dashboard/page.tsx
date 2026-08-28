import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TokenDemo } from "@/components/token-demo"

const DashboardPage = () => (
  <div className="min-h-screen bg-dark-bg">
    <SiteHeader />
    <TokenDemo />
    <SiteFooter />
  </div>
)

export default DashboardPage
