import cheerio from "cheerio"

// Function to extract content from a Wikipedia URL
export async function extractContentFromWikipedia(url: string): Promise<string> {
  console.log("WikiUtils: Starting extraction from URL:", url)

  try {
    // Validate that it's a Wikipedia URL
    if (!url.includes("wikipedia.org/wiki/")) {
      console.error("WikiUtils: Invalid Wikipedia URL")
      throw new Error("Invalid Wikipedia URL")
    }

    // Extract the page title from the URL for API use
    const pageTitle = url.split("/wiki/")[1]?.split("#")[0] || ""
    if (!pageTitle) {
      console.error("WikiUtils: Could not extract page title from URL")
      throw new Error("Could not extract page title from URL")
    }

    console.log("WikiUtils: Extracted page title:", pageTitle)

    // Direct scraping approach with better error handling
    try {
      console.log("WikiUtils: Attempting to scrape Wikipedia page")
      const scrapedContent = await scrapeWikipediaPage(url)

      if (!scrapedContent || scrapedContent.length < 50) {
        throw new Error("Insufficient content extracted")
      }

      console.log("WikiUtils: Successfully scraped Wikipedia page, content length:", scrapedContent.length)
      return scrapedContent
    } catch (error) {
      console.error("WikiUtils: Error in primary scraping method:", error)

      // Try fallback method - simpler extraction
      try {
        console.log("WikiUtils: Attempting fallback extraction method")
        const fallbackContent = await simplifiedWikipediaExtraction(url)

        if (!fallbackContent || fallbackContent.length < 50) {
          throw new Error("Insufficient content from fallback method")
        }

        console.log("WikiUtils: Fallback extraction successful, content length:", fallbackContent.length)
        return fallbackContent
      } catch (fallbackError) {
        console.error("WikiUtils: Fallback extraction also failed:", fallbackError)
        throw new Error(`Failed to extract Wikipedia content: ${error.message}`)
      }
    }
  } catch (error) {
    console.error("WikiUtils: Error extracting content from Wikipedia:", error)
    throw error
  }
}

// Simplified extraction method as fallback
async function simplifiedWikipediaExtraction(url: string): Promise<string> {
  try {
    // Use a more basic approach to fetch the page
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 Notey App (educational project)",
        },
        cache: "no-store",
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }

      const html = await response.text()

      if (!html || html.length < 1000) {
        throw new Error("Received insufficient HTML content")
      }

      const $ = cheerio.load(html)

      // Get the title
      const title = $("#firstHeading").text().trim() || "Wikipedia Article"

      // Get a simple extraction of paragraphs
      let content = `# ${title}\n\n`

      // Get the first few paragraphs
      $("#mw-content-text .mw-parser-output > p")
        .slice(0, 10)
        .each((_, el) => {
          const text = $(el).text().trim()
          if (text && text.length > 20) {
            content += text + "\n\n"
          }
        })

      // Get some headings and their content
      $("#mw-content-text .mw-parser-output > h2")
        .slice(0, 5)
        .each((_, heading) => {
          const headingText = $(heading).find(".mw-headline").text().trim()
          if (headingText && !["References", "External links", "See also"].includes(headingText)) {
            content += `## ${headingText}\n\n`

            // Get a few paragraphs after each heading
            let nextEl = $(heading).next()
            let count = 0

            while (nextEl.length && !nextEl.is("h2") && count < 3) {
              if (nextEl.is("p")) {
                const text = nextEl.text().trim()
                if (text && text.length > 20) {
                  content += text + "\n\n"
                  count++
                }
              }
              nextEl = nextEl.next()
            }
          }
        })

      // Clean up the content
      content = content
        .replace(/\[\d+\]/g, "") // Remove citation numbers
        .replace(/\n{3,}/g, "\n\n") // Normalize newlines
        .trim()

      return content
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError.name === "AbortError") {
        throw new Error("Request timed out after 5 seconds")
      }
      throw fetchError
    }
  } catch (error) {
    console.error("Error in simplified extraction:", error)
    throw error
  }
}

// Main scraping function with improved error handling
async function scrapeWikipediaPage(url: string): Promise<string> {
  console.log("WikiUtils: Scraping Wikipedia page:", url)

  try {
    // Fetch the HTML content with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout (reduced from 10)

    try {
      console.log("WikiUtils: Fetching HTML content")
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 Notey App (educational project)",
        },
        cache: "no-store",
        next: { revalidate: 0 }, // Ensure fresh content
      })
      clearTimeout(timeoutId)

      console.log("WikiUtils: HTML fetch response status:", response.status)
      if (!response.ok) {
        throw new Error(`Failed to fetch Wikipedia page: ${response.statusText}`)
      }

      const html = await response.text()
      if (!html || html.length < 1000) {
        throw new Error("Received insufficient HTML content")
      }

      console.log("WikiUtils: Successfully fetched HTML content, length:", html.length)

      // Load HTML into cheerio with error handling
      let $
      try {
        $ = cheerio.load(html)
        console.log("WikiUtils: Loaded HTML into cheerio")
      } catch (cheerioError) {
        console.error("WikiUtils: Error loading HTML into cheerio:", cheerioError)
        throw new Error("Failed to parse Wikipedia HTML")
      }

      // Extract the title
      const title = $("#firstHeading").text().trim() || "Wikipedia Article"
      console.log("WikiUtils: Extracted title:", title)

      // Extract the main content
      let content = ""

      // Add the title
      content += `# ${title}\n\n`

      // Extract the lead paragraph (introduction) with better error handling
      try {
        const leadParagraphs = $("#mw-content-text .mw-parser-output > p").filter(function () {
          return $(this).prevAll("h2, #toc").length === 0
        })

        if (leadParagraphs.length > 0) {
          leadParagraphs.each((_, element) => {
            const paragraphText = $(element).text().trim()
            if (paragraphText && !paragraphText.includes("Coordinates:")) {
              content += paragraphText + "\n\n"
            }
          })
        } else {
          // Fallback if we can't find lead paragraphs
          $("#mw-content-text .mw-parser-output > p")
            .slice(0, 3)
            .each((_, element) => {
              const paragraphText = $(element).text().trim()
              if (paragraphText) {
                content += paragraphText + "\n\n"
              }
            })
        }
      } catch (paragraphError) {
        console.error("WikiUtils: Error extracting paragraphs:", paragraphError)
        // Continue with other content even if paragraph extraction fails
      }

      // Process each section with better error handling
      try {
        $("#mw-content-text .mw-parser-output > h2").each((_, heading) => {
          try {
            const headingText = $(heading).find(".mw-headline").text().trim()

            // Skip certain sections
            if (
              headingText &&
              !["References", "External links", "See also", "Further reading", "Notes", "Citations"].includes(
                headingText,
              )
            ) {
              content += `## ${headingText}\n\n`

              // Find paragraphs after this heading
              let currentElement = $(heading).next()
              let paragraphCount = 0

              while (currentElement.length && !currentElement.is("h2") && paragraphCount < 5) {
                if (currentElement.is("p")) {
                  const paragraphText = currentElement.text().trim()
                  if (paragraphText) {
                    content += paragraphText + "\n\n"
                    paragraphCount++
                  }
                }
                currentElement = currentElement.next()
              }
            }
          } catch (sectionError) {
            console.error("WikiUtils: Error processing section:", sectionError)
            // Continue with other sections
          }
        })
      } catch (sectionsError) {
        console.error("WikiUtils: Error processing sections:", sectionsError)
        // Continue with what we have
      }

      // Clean up the content
      content = content
        .replace(/\[\d+\]/g, "") // Remove citation numbers [1], [2], etc.
        .replace(/\s+\n/g, "\n") // Remove extra spaces before newlines
        .replace(/\n{3,}/g, "\n\n") // Replace multiple newlines with double newlines
        .trim()

      // Ensure we have some content
      if (content.length < 100) {
        throw new Error("Insufficient content extracted")
      }

      // Limit content length to avoid overwhelming the AI
      const maxLength = 10000
      if (content.length > maxLength) {
        console.log("WikiUtils: Content exceeds max length, truncating")
        content = content.substring(0, maxLength) + "\n\n[Content truncated due to length...]"
      }

      console.log("WikiUtils: Successfully extracted content, length:", content.length)
      return content
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError.name === "AbortError") {
        console.error("WikiUtils: Wikipedia page fetch request timed out")
        throw new Error("Wikipedia page fetch request timed out")
      }
      throw fetchError
    }
  } catch (error) {
    console.error("WikiUtils: Error scraping Wikipedia page:", error)
    throw error
  }
}
