import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TokenDemo } from "@/components/token-demo"

const HomePage = () => (
  <div className="min-h-screen bg-dark-bg">
    <SiteHeader />

    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(57,255,20,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#39FF14]/80">
          AVISALA
        </p>
        <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
          Infinite local memory.
          <span className="block text-[#39FF14]">Zero token bloat.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/50">
          MemSqueeze compresses conversation history and document context by 50–80%
          before it hits the LLM — so local models stay fast and cloud APIs stay cheap.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/playground"
            className="rounded-xl bg-[#39FF14] px-5 py-3 text-sm font-bold text-black shadow-[0_0_24px_rgba(57,255,20,0.35)] transition-transform hover:scale-[1.02]"
          >
            Open live playground
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-dark-border bg-dark-card px-5 py-3 text-sm font-bold text-white/80 hover:text-white"
          >
            Token dashboard
          </Link>
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-8 md:grid-cols-3">
      {[
        {
          title: "Context bloat",
          copy: "Long chats and files fill the window. You pay for the same history over and over.",
        },
        {
          title: "The squeezer",
          copy: "Drop filler, keep entities and facts, then send a dense prompt to the model.",
        },
        {
          title: "Works anywhere",
          copy: "Right-click any textarea or contenteditable box — ChatGPT, Claude, Cursor, this site.",
        },
      ].map(card => (
        <article
          key={card.title}
          className="rounded-2xl border border-dark-border bg-dark-card p-6 shadow-card"
        >
          <h2 className="text-sm font-bold text-white">{card.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/45">{card.copy}</p>
        </article>
      ))}
    </section>

    <TokenDemo />

    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="rounded-2xl border border-[#39FF14]/20 bg-[#39FF14]/5 p-8">
        <h2 className="text-xl font-black">Try it on a real prompt box</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/50">
          The playground is a live composer — textarea plus a ChatGPT-style contenteditable field.
          Load the Chrome extension, or squeeze in the browser without it.
        </p>
        <Link
          href="/playground"
          className="mt-5 inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black"
        >
          Go to playground
        </Link>
      </div>
    </section>

    <SiteFooter />
  </div>
)

export default HomePage
