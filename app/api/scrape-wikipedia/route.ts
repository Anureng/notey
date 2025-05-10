import { type NextRequest, NextResponse } from "next/server"
import { extractContentFromWikipedia } from "@/lib/wikipedia-utils"

export async function POST(request: NextRequest) {
  try {
    // Get the Wikipedia URL from the request
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    // Extract content from Wikipedia
    const content = await extractContentFromWikipedia(url)

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Error scraping Wikipedia:", error)
    return NextResponse.json({ error: "Failed to scrape Wikipedia content" }, { status: 500 })
  }
}
