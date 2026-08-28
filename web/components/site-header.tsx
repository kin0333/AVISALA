"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/cn"

const NAV = [
  { href: "/", label: "Home" },
  { href: "/playground", label: "Playground" },
  { href: "/dashboard", label: "Dashboard" },
]

export const SiteHeader = () => {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-dark-border/80 bg-[#0f0f0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="AVISALA home">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-[#39FF14]/30 bg-[#39FF14]/10 text-xs font-black text-[#39FF14]">
            A
          </span>
          <span className="text-sm font-black tracking-tight">
            AVISALA
            <span className="ml-2 font-medium text-white/35">MemSqueeze</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Primary">
          {NAV.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
