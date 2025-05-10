import { type NextRequest, NextResponse } from "next/server"
import type { EnhancedFlashcard } from "@/components/enhanced-flashcard"
import { extractContentFromWikipedia } from "@/lib/wikipedia-api"
import { aiConfig } from "@/lib/ai-config"

// Sample flashcards to use as fallback when API calls fail
const FALLBACK_FLASHCARDS: EnhancedFlashcard[] = [
  {
    title: "Artificial Intelligence Definition",
    content:
      "**Artificial Intelligence (AI)** refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions. The term may also be applied to any machine that exhibits traits associated with a human mind such as *learning* and *problem-solving*.",
  },
  {
    title: "Machine Learning",
    content:
      "**Machine learning** is a subset of AI that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. Machine learning focuses on the development of computer programs that can access data and use it to learn for themselves.",
    graph: {
      type: "line",
      data: {
        labels: ["Data Size", "Small", "Medium", "Large", "Very Large"],
        datasets: [
          {
            label: "Model Performance vs Data Size",
            data: [0, 30, 60, 80, 90],
          },
        ],
      },
    },
  },
  {
    title: "Deep Learning",
    content:
      '**Deep learning** is a subset of machine learning that uses neural networks with many layers (hence "deep") to analyze various factors of data. Deep learning is making major advances in solving problems that have resisted the best attempts of the artificial intelligence community for many years.',
    formula: "y = f(∑ wixi + b)",
  },
  {
    title: "Natural Language Processing",
    content:
      "**Natural Language Processing (NLP)** is a branch of AI that helps computers understand, interpret, and manipulate human language. NLP draws from many disciplines, including computer science and computational linguistics.",
  },
  {
    title: "Computer Vision",
    content:
      "**Computer vision** is an interdisciplinary field that deals with how computers can gain high-level understanding from digital images or videos. It seeks to automate tasks that the human visual system can do and involves the development of a theoretical and algorithmic basis to achieve automatic visual understanding.",
  },
  {
    title: "Reinforcement Learning",
    content:
      "**Reinforcement learning** is an area of machine learning concerned with how software agents ought to take actions in an environment in order to maximize the notion of cumulative reward. It differs from supervised learning in that labeled input/output pairs need not be presented, and sub-optimal actions need not be explicitly corrected.",
    formula: "Q(s,a) ← Q(s,a) + α[r + γ·maxQ(s',a') - Q(s,a)]",
  },
]

// Function to call Groq API with improved prompt
async function callGroqAPI(content: string): Promise<EnhancedFlashcard[]> {
  console.log("Calling Groq API with content length:", content.length)

  // Check if API key is available
  if (!aiConfig.apiKey) {
    console.error("Missing Groq API key")
    throw new Error("Missing API key")
  }

  try {
    // Prepare the prompt for the AI with clearer instructions and formatting guidance
    const prompt = `
You are an expert at creating educational flashcards. 
I'll provide you with content from a Wikipedia article, and I want you to create 6-8 flashcards based on the most important concepts.

For each flashcard, include:
1. A clear, concise title that captures the key concept
2. Detailed content that explains the concept in 2-4 sentences with proper formatting for better readability
3. If applicable, a formula (written in plain text format that can be displayed without special rendering)
4. If applicable, data for a simple graph (with labels and data points)

CONTENT FROM WIKIPEDIA:
${content.substring(0, 10000)} 
${content.length > 10000 ? "... [content truncated for length]" : ""}

RESPONSE FORMAT:
Provide your response as a valid JSON array of flashcard objects with the following structure:
[
  {
    "title": "Concept Title",
    "content": "Detailed explanation of the concept in 2-4 sentences with **bold text** for important terms, *italics* for emphasis, and other Markdown formatting for better readability.",
    "formula": "E = mc²", // Optional, include only if relevant
    "graph": { // Optional, include only if relevant
      "type": "line",
      "data": {
        "labels": ["Label1", "Label2", "Label3", "Label4", "Label5"],
        "datasets": [
          {
            "label": "Dataset Label",
            "data": [value1, value2, value3, value4, value5]
          }
        ]
      }
    }
  }
]

FORMATTING GUIDELINES:
- Use Markdown syntax for formatting:
  - **bold text** for important terms and key concepts
  - *italic text* for emphasis and secondary points
  - Use bullet points where appropriate:
    * First point
    * Second point
  - Use numbered lists for sequential information:
    1. First step
    2. Second step
  - Use \`code formatting\` for technical terms or specific notation
  - Use > for important quotes or callouts
- Make sure the formatting enhances readability and learning
- Ensure all Markdown is properly escaped in the JSON
- IMPORTANT: Avoid using control characters or special characters that would break JSON parsing

IMPORTANT GUIDELINES:
- Create flashcards that cover the most important concepts from the article
- Ensure formulas are written in plain text format (e.g., "E = mc²", "F = G(m₁m₂)/r²")
- For graphs, provide 5-7 data points that illustrate a relevant trend or relationship
- Make sure your response is ONLY the JSON array, with no additional text before or after
- Ensure the JSON is valid and properly formatted
- Do not include any control characters (like tabs or newlines) within string values
`

    // Call the Groq API
    const response = await fetch(aiConfig.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiConfig.apiKey}`,
      },
      body: JSON.stringify({
        model: aiConfig.modelName,
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant that creates educational flashcards based on Wikipedia content. You always respond with valid JSON and use Markdown formatting for better readability. Ensure all JSON is properly escaped and contains no control characters within string values.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8, // Lower temperature for more consistent output
        max_tokens: 3000, // Increased token limit for more detailed flashcards
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Groq API error:", response.status, errorText)
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()

    // Extract the content from the response
    const aiResponse = data.choices[0]?.message?.content || ""
    console.log("Groq API response preview:", aiResponse.substring(0, 200) + "...")

    // Parse the JSON response with improved error handling
    try {
      // Find JSON in the response (in case there's any extra text)
      const jsonMatch = aiResponse.match(/\[\s*\{[\s\S]*\}\s*\]/)
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse

      // Try to parse the JSON with a more robust approach
      let flashcards
      try {
        // First attempt: direct parsing
        flashcards = JSON.parse(jsonString)
      } catch (parseError) {
        console.error("Error parsing JSON directly:", parseError)

        // Enhanced cleaning process
        const cleanedJson = jsonString
          // Replace escaped quotes with temporary placeholders
          .replace(/\\"/g, "___QUOTE___")
          // Replace unescaped control characters
          .replace(/[\n\r\t\b\f\v]/g, " ")
          // Replace any other control characters
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
          // Fix common JSON syntax issues
          .replace(/,\s*}/g, "}")
          .replace(/,\s*]/g, "]")
          // Restore escaped quotes
          .replace(/___QUOTE___/g, '\\"')
          // Ensure proper string escaping
          .replace(/([^\\])"/g, '$1\\"')
          .replace(/^"/, '\\"')
          // Fix double escaping
          .replace(/\\\\/g, "\\")
          // Trim whitespace
          .trim()

        // Log the cleaned JSON for debugging
        console.log("Cleaned JSON preview:", cleanedJson.substring(0, 200) + "...")

        try {
          // Second attempt: parse the cleaned JSON
          flashcards = JSON.parse(cleanedJson)
        } catch (secondParseError) {
          console.error("Error parsing cleaned JSON:", secondParseError)

          // Last resort: try to manually extract and construct the flashcards
          try {
            console.log("Attempting manual extraction of flashcards...")

            // Create a fallback set of flashcards from the raw text
            // This is a very simplified approach that might not work for all cases
            const fallbackFlashcards = extractFlashcardsManually(aiResponse)

            if (fallbackFlashcards.length > 0) {
              console.log("Successfully extracted fallback flashcards:", fallbackFlashcards.length)
              return fallbackFlashcards
            } else {
              throw new Error("Failed to extract fallback flashcards")
            }
          } catch (fallbackError) {
            console.error("Error with fallback extraction:", fallbackError)
            throw new Error("Failed to parse AI response in any format")
          }
        }
      }

      if (!Array.isArray(flashcards)) {
        throw new Error("Response is not an array")
      }

      // Validate and clean up each flashcard
      const validatedFlashcards = flashcards.map((card) => {
        // Ensure required fields exist
        if (!card.title || !card.content) {
          return {
            title: card.title || "Untitled Flashcard",
            content: card.content || "No content available",
          }
        }

        // Clean up and validate graph data if present
        if (card.graph) {
          // Ensure graph has required structure
          if (!card.graph.data || !card.graph.data.labels || !card.graph.data.datasets) {
            card.graph = undefined
          } else {
            // Ensure datasets is an array with at least one item
            if (!Array.isArray(card.graph.data.datasets) || card.graph.data.datasets.length === 0) {
              card.graph = undefined
            } else {
              // Ensure first dataset has data array
              if (!Array.isArray(card.graph.data.datasets[0].data)) {
                card.graph = undefined
              }
            }
          }
        }

        return card
      })

      return validatedFlashcards
    } catch (error) {
      console.error("Error processing Groq API response:", error)
      console.error("Raw response preview:", aiResponse.substring(0, 500) + "...")

      // Return fallback flashcards
      return FALLBACK_FLASHCARDS
    }
  } catch (error) {
    console.error("Error calling Groq API:", error)
    return FALLBACK_FLASHCARDS
  }
}

// Function to manually extract flashcards from text when JSON parsing fails
function extractFlashcardsManually(text: string): EnhancedFlashcard[] {
  const flashcards: EnhancedFlashcard[] = []

  try {
    // Look for patterns that might indicate flashcard titles and content
    const titleMatches = text.match(/["']title["']\s*:\s*["']([^"']+)["']/g) || []
    const contentMatches = text.match(/["']content["']\s*:\s*["']([^"']+)["']/g) || []

    // If we found some titles, try to extract them
    if (titleMatches.length > 0) {
      for (let i = 0; i < titleMatches.length; i++) {
        const titleMatch = titleMatches[i].match(/["']title["']\s*:\s*["']([^"']+)["']/)
        const title = titleMatch ? titleMatch[1] : `Flashcard ${i + 1}`

        // Try to find a corresponding content
        let content = "Content could not be extracted."
        if (i < contentMatches.length) {
          const contentMatch = contentMatches[i].match(/["']content["']\s*:\s*["']([^"']+)["']/)
          if (contentMatch) {
            content = contentMatch[1]
          }
        }

        flashcards.push({ title, content })
      }
    }

    // If we couldn't extract anything, create a generic fallback
    if (flashcards.length === 0) {
      // Split the text into chunks and create flashcards from them
      const chunks = text.split(/\n\n+/)
      for (let i = 0; i < Math.min(chunks.length, 5); i++) {
        const chunk = chunks[i].trim()
        if (chunk.length > 10) {
          flashcards.push({
            title: `Key Concept ${i + 1}`,
            content: chunk.substring(0, 500), // Limit content length
          })
        }
      }
    }

    return flashcards.length > 0 ? flashcards : FALLBACK_FLASHCARDS
  } catch (error) {
    console.error("Error in manual extraction:", error)
    return FALLBACK_FLASHCARDS
  }
}

// API route with improved error handling
export async function POST(request: NextRequest) {
  console.log("API: Starting flashcard generation process")

  try {
    // Step 1: Parse the request body
    let url = ""
    try {
      const body = await request.json()
      url = body.url || ""
      console.log("API: Received URL:", url)
    } catch (error) {
      console.error("API: Error parsing request JSON:", error)
      return NextResponse.json(
        {
          error: "Invalid request format",
          flashcards: FALLBACK_FLASHCARDS,
          fallbackUsed: true,
        },
        { status: 200 }, // Return 200 with fallback data instead of 400
      )
    }

    if (!url) {
      console.error("API: No URL provided in request")
      return NextResponse.json(
        {
          error: "No URL provided",
          flashcards: FALLBACK_FLASHCARDS,
          fallbackUsed: true,
        },
        { status: 200 }, // Return 200 with fallback data instead of 400
      )
    }

    // Step 2: Extract content from Wikipedia
    let wikiContent
    try {
      console.log("API: Extracting content from Wikipedia")
      wikiContent = await extractContentFromWikipedia(url)
      console.log("API: Successfully extracted Wikipedia content, length:", wikiContent.length)

      if (!wikiContent || wikiContent.length < 100) {
        console.warn("API: Insufficient content extracted from Wikipedia, using fallback")
        return NextResponse.json({
          message: "Using fallback content due to extraction issues",
          flashcards: FALLBACK_FLASHCARDS,
          fallbackUsed: true,
        })
      }

      // Log a preview of the content
      console.log("API: Content preview:", wikiContent.substring(0, 300) + "...")
    } catch (error) {
      console.error("API: Error extracting Wikipedia content:", error)
      return NextResponse.json({
        message: "Using fallback flashcards due to Wikipedia extraction error",
        flashcards: FALLBACK_FLASHCARDS,
        fallbackUsed: true,
      })
    }

    // Step 3: Generate flashcards using Groq API
    try {
      console.log("API: Generating flashcards with Groq API")
      const flashcards = await callGroqAPI(wikiContent)
      console.log("API: Successfully generated flashcards:", flashcards.length)

      return NextResponse.json({
        message: "Successfully generated flashcards",
        flashcards: flashcards,
        fallbackUsed: false,
      })
    } catch (error) {
      console.error("API: Error generating flashcards with Groq API:", error)
      return NextResponse.json({
        message: "Using fallback flashcards due to AI generation error",
        flashcards: FALLBACK_FLASHCARDS,
        fallbackUsed: true,
      })
    }
  } catch (error) {
    console.error("API: Unhandled error in API route:", error)
    return NextResponse.json({
      message: "Using fallback flashcards due to unexpected error",
      flashcards: FALLBACK_FLASHCARDS,
      fallbackUsed: true,
    })
  }
}
