import { type NextRequest, NextResponse } from "next/server"
import { extractContentFromWikipedia } from "@/lib/wikipedia-api"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    let url = ""
    try {
      const body = await request.json()
      url = body.url || ""
      console.log("API: Received URL for extraction:", url)
    } catch (error) {
      console.error("API: Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    if (!url) {
      console.error("API: No URL provided")
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    // Validate URL format
    if (!url.includes("wikipedia.org/wiki/")) {
      console.error("API: Invalid Wikipedia URL format")
      return NextResponse.json(
        {
          error: "Invalid Wikipedia URL format. URL must contain 'wikipedia.org/wiki/'",
          url: url,
        },
        { status: 400 },
      )
    }

    // Extract content from Wikipedia with better error handling
    try {
      console.log("API: Starting Wikipedia extraction for URL:", url)

      // Extract content using our enhanced utility
      const content = await extractContentFromWikipedia(url)

      if (!content || content.length < 50) {
        console.error("API: Extracted content is too short or empty")
        return NextResponse.json({
          error: "Failed to extract sufficient content from Wikipedia",
          fallbackUsed: true,
          content: "Using fallback content for demonstration purposes.",
        })
      }

      console.log("API: Successfully extracted content, length:", content.length)

      // Return a preview of the content for debugging
      const contentPreview = content.length > 200 ? content.substring(0, 200) + "..." : content

      return NextResponse.json({
        success: true,
        content: content,
        contentLength: content.length,
        contentPreview: contentPreview,
        url: url,
      })
    } catch (error) {
      console.error("API: Error extracting Wikipedia content:", error)
      // Ensure we return a valid JSON response even for errors
      return NextResponse.json(
        {
          error: "Failed to extract Wikipedia content: " + (error.message || "Unknown error"),
          url: url,
          fallbackUsed: true,
          content: "Using fallback content for demonstration purposes.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API: Unhandled error in extract-wikipedia API route:", error)
    // Ensure we return a valid JSON response for all errors
    return NextResponse.json(
      {
        error: "An unexpected error occurred in the Wikipedia extraction API",
        fallbackUsed: true,
        content: "Using fallback content for demonstration purposes.",
      },
      { status: 500 },
    )
  }
}
