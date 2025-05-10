/**
 * Utility functions for interacting with the Wikipedia API
 */

// Base URL for the Wikipedia API
const API_BASE_URL = "https://en.wikipedia.org/w/api.php"

// Sample content to use as fallback when extraction fails
const FALLBACK_CONTENT = `
# Fallback Content: Introduction to Artificial Intelligence

Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving.

## History of AI

The field of AI research was founded at a workshop held on the campus of Dartmouth College during the summer of 1956. The attendees, including John McCarthy, Marvin Minsky, Allen Newell, and Herbert Simon, became the leaders of AI research for decades.

## Machine Learning

Machine learning is a subset of AI that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. Machine learning focuses on the development of computer programs that can access data and use it to learn for themselves.

## Deep Learning

Deep learning is a subset of machine learning that uses neural networks with many layers (hence "deep") to analyze various factors of data. Deep learning is making major advances in solving problems that have resisted the best attempts of the artificial intelligence community for many years.

## Applications of AI

AI has been used in various fields including:
- Healthcare: for medical diagnosis and drug discovery
- Finance: for fraud detection and algorithmic trading
- Transportation: for autonomous vehicles and traffic management
- Customer Service: for chatbots and virtual assistants
- Entertainment: for personalized content recommendations
`

/**
 * Extract content from a Wikipedia URL using the official MediaWiki API
 */
export async function extractContentFromWikipedia(url: string): Promise<string> {
  console.log("WikiAPI: Starting extraction from URL:", url)

  try {
    // Extract the page title from the URL
    const pageTitle = extractPageTitleFromUrl(url)
    if (!pageTitle) {
      console.error("WikiAPI: Could not extract page title from URL")
      return FALLBACK_CONTENT
    }

    console.log("WikiAPI: Extracted page title:", pageTitle)

    // Try multiple extraction methods with fallbacks
    try {
      // Method 1: Try the MediaWiki API first
      const content = await fetchWikipediaContent(pageTitle)

      // Validate content length
      if (content && content.length > 500) {
        console.log("WikiAPI: Successfully extracted content with primary method, length:", content.length)
        return content
      }

      throw new Error("Primary extraction method returned insufficient content")
    } catch (primaryError) {
      console.error("WikiAPI: Primary extraction method failed:", primaryError)

      try {
        // Method 2: Try the summary API as fallback
        console.log("WikiAPI: Trying summary API fallback...")
        const summaryContent = await fetchWikipediaSummary(pageTitle)

        if (summaryContent && summaryContent.length > 300) {
          console.log("WikiAPI: Successfully extracted content with summary API, length:", summaryContent.length)
          return summaryContent
        }

        throw new Error("Summary API fallback returned insufficient content")
      } catch (summaryError) {
        console.error("WikiAPI: Summary API fallback failed:", summaryError)

        try {
          // Method 3: Try direct page scraping as a last resort
          console.log("WikiAPI: Trying direct page scraping as last resort...")
          const scrapedContent = await scrapeWikipediaPage(url)

          if (scrapedContent && scrapedContent.length > 300) {
            console.log("WikiAPI: Successfully extracted content with scraping, length:", scrapedContent.length)
            return scrapedContent
          }

          throw new Error("Scraping fallback returned insufficient content")
        } catch (scrapingError) {
          console.error("WikiAPI: All extraction methods failed:", scrapingError)
          // Return fallback content as last resort
          console.log("WikiAPI: Using fallback content")
          return FALLBACK_CONTENT
        }
      }
    }
  } catch (error) {
    console.error("WikiAPI: Error extracting content from Wikipedia:", error)
    return FALLBACK_CONTENT
  }
}

/**
 * Extract the page title from a Wikipedia URL
 */
function extractPageTitleFromUrl(url: string): string | null {
  try {
    // Validate that it's a Wikipedia URL
    if (!url.includes("wikipedia.org/wiki/")) {
      console.error("WikiAPI: Invalid Wikipedia URL")
      return null
    }

    // Extract the page title from the URL
    const pageTitle = url.split("/wiki/")[1]?.split("#")[0] || ""
    if (!pageTitle) {
      console.error("WikiAPI: Could not extract page title from URL")
      return null
    }

    // Decode URL components
    return decodeURIComponent(pageTitle)
  } catch (error) {
    console.error("WikiAPI: Error extracting page title:", error)
    return null
  }
}

/**
 * Fetch Wikipedia content using the MediaWiki API
 */
async function fetchWikipediaContent(pageTitle: string): Promise<string> {
  console.log("WikiAPI: Fetching content for page:", pageTitle)

  try {
    // First, get the page sections to build a structured document
    const sections = await fetchPageSections(pageTitle)

    // Then get the main content for each section
    const content = await fetchSectionContent(pageTitle, sections)

    return content
  } catch (error) {
    console.error("WikiAPI: Error fetching Wikipedia content:", error)
    throw error
  }
}

/**
 * Fetch the sections of a Wikipedia page
 */
async function fetchPageSections(pageTitle: string): Promise<any[]> {
  try {
    // Build the API URL for fetching sections
    const params = new URLSearchParams({
      action: "parse",
      page: pageTitle,
      prop: "sections",
      format: "json",
      origin: "*", // Required for CORS
    })

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      headers: {
        "User-Agent": "Notey App/1.0 (Educational Project)",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sections: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`API error: ${data.error.info}`)
    }

    return data.parse?.sections || []
  } catch (error) {
    console.error("WikiAPI: Error fetching page sections:", error)
    return [] // Return empty array to allow fallback to intro-only content
  }
}

/**
 * Fetch the content of a Wikipedia page with sections
 */
async function fetchSectionContent(pageTitle: string, sections: any[]): Promise<string> {
  try {
    // First, get the page introduction
    const introContent = await fetchPageIntroduction(pageTitle)
    let fullContent = introContent

    // Then, get content for important sections (limit to first 5 non-reference sections)
    const importantSections = sections
      .filter(
        (section) =>
          !["References", "External links", "See also", "Further reading", "Notes", "Citations"].includes(section.line),
      )
      .slice(0, 5)

    for (const section of importantSections) {
      try {
        const sectionContent = await fetchSectionById(pageTitle, section.index)
        if (sectionContent) {
          fullContent += `\n\n## ${section.line}\n\n${sectionContent}`
        }
      } catch (sectionError) {
        console.error(`WikiAPI: Error fetching section ${section.line}:`, sectionError)
        // Continue with other sections
      }
    }

    // Clean up the content
    const cleanedContent = cleanWikipediaContent(fullContent)

    // Limit content length to avoid overwhelming the AI
    const maxLength = 10000
    if (cleanedContent.length > maxLength) {
      console.log("WikiAPI: Content exceeds max length, truncating")
      return cleanedContent.substring(0, maxLength) + "\n\n[Content truncated due to length...]"
    }

    return cleanedContent
  } catch (error) {
    console.error("WikiAPI: Error fetching section content:", error)
    throw error
  }
}

/**
 * Fetch the introduction of a Wikipedia page
 */
async function fetchPageIntroduction(pageTitle: string): Promise<string> {
  try {
    // Build the API URL for fetching the introduction
    const params = new URLSearchParams({
      action: "query",
      titles: pageTitle,
      prop: "extracts",
      exintro: "1", // Only get the introduction
      explaintext: "1", // Get plain text, not HTML
      format: "json",
      origin: "*", // Required for CORS
    })

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      headers: {
        "User-Agent": "Notey App/1.0 (Educational Project)",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch introduction: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`API error: ${data.error.info}`)
    }

    // Extract the page content from the response
    const pages = data.query?.pages || {}
    const pageId = Object.keys(pages)[0]

    if (pageId === "-1") {
      throw new Error("Page not found")
    }

    const extract = pages[pageId]?.extract || ""

    // Add the title as a heading
    const title = pages[pageId]?.title || pageTitle
    return `# ${title}\n\n${extract}`
  } catch (error) {
    console.error("WikiAPI: Error fetching page introduction:", error)
    throw error
  }
}

/**
 * Fetch a specific section of a Wikipedia page by section ID
 */
async function fetchSectionById(pageTitle: string, sectionId: number): Promise<string> {
  try {
    // Build the API URL for fetching a specific section
    const params = new URLSearchParams({
      action: "parse",
      page: pageTitle,
      section: sectionId.toString(),
      prop: "text",
      format: "json",
      origin: "*", // Required for CORS
    })

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      headers: {
        "User-Agent": "Notey App/1.0 (Educational Project)",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch section: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`API error: ${data.error.info}`)
    }

    // Extract the section content from the response
    const html = data.parse?.text?.["*"] || ""

    // Convert HTML to plain text
    return htmlToPlainText(html)
  } catch (error) {
    console.error("WikiAPI: Error fetching section by ID:", error)
    return "" // Return empty string to allow continuing with other sections
  }
}

/**
 * Convert HTML to plain text
 */
function htmlToPlainText(html: string): string {
  try {
    // Simple HTML to text conversion
    // Remove HTML tags
    let text = html.replace(/<[^>]*>/g, " ")

    // Decode HTML entities
    text = text
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")

    // Remove multiple spaces
    text = text.replace(/\s+/g, " ")

    // Remove edit links
    text = text.replace(/\[\s*edit\s*\]/gi, "")

    return text.trim()
  } catch (error) {
    console.error("WikiAPI: Error converting HTML to plain text:", error)
    return html // Return the original HTML if conversion fails
  }
}

/**
 * Clean up Wikipedia content
 */
function cleanWikipediaContent(content: string): string {
  try {
    return content
      .replace(/\[\d+\]/g, "") // Remove citation numbers [1], [2], etc.
      .replace(/\s+\n/g, "\n") // Remove extra spaces before newlines
      .replace(/\n{3,}/g, "\n\n") // Replace multiple newlines with double newlines
      .trim()
  } catch (error) {
    console.error("WikiAPI: Error cleaning content:", error)
    return content // Return the original content if cleaning fails
  }
}

/**
 * Alternative method: Fetch a summary of a Wikipedia page
 * This can be used as a fallback if the main method fails
 */
export async function fetchWikipediaSummary(pageTitle: string): Promise<string> {
  try {
    // Use the Wikipedia REST API for summaries
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`, {
      headers: {
        "User-Agent": "Notey App/1.0 (Educational Project)",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch summary: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Format the summary
    return `# ${data.title}\n\n${data.extract}`
  } catch (error) {
    console.error("WikiAPI: Error fetching Wikipedia summary:", error)
    throw error
  }
}

/**
 * Last resort method: Directly scrape the Wikipedia page
 */
async function scrapeWikipediaPage(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Notey App/1.0 (Educational Project)",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()

    // Very basic extraction of content
    const titleMatch = html.match(/<h1[^>]*id="firstHeading"[^>]*>(.*?)<\/h1>/i)
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, "") : "Wikipedia Article"

    // Extract paragraphs from the content area
    const contentMatches = html.match(/<div[^>]*class="mw-parser-output"[^>]*>([\s\S]*?)<\/div>/i)
    const content = contentMatches ? contentMatches[1] : ""

    // Extract paragraphs
    const paragraphs: string[] = []
    const paragraphMatches = content.match(/<p[^>]*>([\s\S]*?)<\/p>/gi)

    if (paragraphMatches) {
      for (const p of paragraphMatches.slice(0, 10)) {
        const text = p
          .replace(/<[^>]*>/g, " ")
          .replace(/\[\d+\]/g, "")
          .replace(/\s+/g, " ")
          .trim()

        if (text.length > 20) {
          paragraphs.push(text)
        }
      }
    }

    // Extract headings and their content
    const sections: string[] = []
    const headingMatches = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)

    if (headingMatches) {
      for (const h of headingMatches.slice(0, 5)) {
        const headingText = h
          .replace(/<[^>]*>/g, " ")
          .replace(/\[\s*edit\s*\]/gi, "")
          .replace(/\s+/g, " ")
          .trim()

        if (headingText && !["References", "External links", "See also"].includes(headingText)) {
          sections.push(`## ${headingText}`)
        }
      }
    }

    // Combine everything
    let result = `# ${title}\n\n${paragraphs.join("\n\n")}`

    if (sections.length > 0) {
      result += "\n\n" + sections.join("\n\n")
    }

    return result
  } catch (error) {
    console.error("WikiAPI: Error scraping Wikipedia page:", error)
    throw error
  }
}
