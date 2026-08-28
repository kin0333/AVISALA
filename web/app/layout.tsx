import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AVISALA — MemSqueeze",
  description: "Infinite local memory. Zero token bloat. Compress prompts by 50–80% before they hit the LLM.",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={inter.className}>{children}</body>
  </html>
)

export default RootLayout
