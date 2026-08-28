import { NextResponse } from "next/server"
import { compressText } from "@/lib/compress"

export const POST = async (request: Request) => {
  const body = await request.json().catch(() => ({})) as { text?: string }
  const text = body.text ?? ""

  if (!text.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 })
  }

  return NextResponse.json(compressText(text))
}
