"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Download, X, LinkIcon, Zap, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ThreeBackground from "@/components/three-background"
import ProcessingAnimation from "@/components/processing-animation"
import { exportToPdf } from "@/lib/export-to-pdf"
import WorkflowSection from "@/components/workflow-section"
import BenefitsSection from "@/components/benefits-section"
import ExampleEnhancedFlashcards from "@/components/example-enhanced-flashcards"
import EnhancedFlashcardGrid from "@/components/enhanced-flashcard-grid"
import type { EnhancedFlashcard } from "@/components/enhanced-flashcard"
import WikipediaInput from "@/components/wikipedia-input"

export default function Home() {
  const [wikipediaUrl, setWikipediaUrl] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [enhancedFlashcards, setEnhancedFlashcards] = useState<EnhancedFlashcard[]>([])
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const handleWikipediaSubmit = (url: string) => {
    setWikipediaUrl(url)
    setError(null)
    setStatusMessage(null)
    setUsingFallback(false)
  }

  // Process Wikipedia URL to generate flashcards
  const handleProcess = async () => {
    if (!wikipediaUrl) return

    setIsProcessing(true)
    setError(null)
    setStatusMessage(null)
    setUsingFallback(false)

    try {
      await processWikipedia()
    } catch (error) {
      console.error("Error processing:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  // Process Wikipedia URL to generate flashcards
  const processWikipedia = async () => {
    if (!wikipediaUrl) return

    try {
      console.log("Processing Wikipedia URL:", wikipediaUrl)

      // Use the API to generate flashcards from Wikipedia
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: wikipediaUrl }),
      })

      // Safely parse JSON
      let data
      try {
        data = await response.json()
      } catch (error) {
        console.error("Error parsing JSON response:", error)
        throw new Error("Invalid response from server. Please try again.")
      }

      // Check if fallback was used
      if (data.fallbackUsed) {
        setUsingFallback(true)
        setStatusMessage(data.message || "Using fallback content due to extraction issues")
      }

      // Check for error message from API
      if (data.error) {
        console.error("API returned error:", data.error)
        setError(data.error)
        // If we have fallback flashcards, still display them
        if (data.flashcards && data.flashcards.length > 0) {
          setEnhancedFlashcards(data.flashcards)
        }
        return
      }

      // Check for status message from API
      if (data.message) {
        console.log("API status message:", data.message)
        setStatusMessage(data.message)
      }

      if (Array.isArray(data.flashcards) && data.flashcards.length > 0) {
        // Process and validate flashcards
        const processedFlashcards = data.flashcards.map((card: any) => {
          // Ensure all required fields exist
          return {
            title: card.title || "Untitled Flashcard",
            content: card.content || "No content available",
            formula: card.formula || undefined,
            image: card.image || undefined,
            graph: card.graph || undefined,
          }
        })

        setEnhancedFlashcards(processedFlashcards)
      } else {
        throw new Error("No flashcards returned from API")
      }
    } catch (error) {
      console.error("Error processing Wikipedia:", error)
      throw error
    }
  }

  const handleExport = async () => {
    if (enhancedFlashcards.length === 0) return

    try {
      // Convert enhanced flashcards to basic format for PDF export
      const basicCards = enhancedFlashcards.map((card) => ({
        title: card.title,
        content: card.content,
      }))

      const filename = wikipediaUrl.split("/wiki/")[1]?.split("#")[0] || "wikipedia-flashcards"
      await exportToPdf(basicCards, filename)
    } catch (error) {
      console.error("Error exporting flashcards:", error)
      alert("Something went wrong while exporting your flashcards. Please try again.")
    }
  }

  const resetApp = () => {
    setWikipediaUrl("")
    setEnhancedFlashcards([])
    setError(null)
    setStatusMessage(null)
    setUsingFallback(false)
  }

  const hasFlashcards = enhancedFlashcards.length > 0
  const hasInput = !!wikipediaUrl

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-50 via-indigo-50 to-blue-50">
      <ThreeBackground />

      <div className="container relative z-10 px-4 py-12 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block relative">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -top-10 -right-10 text-purple-500"
            >
              <Sparkles className="w-8 h-8 floating" />
            </motion.div>
            <h1 className="text-6xl font-bold gradient-text neon-purple">Notey</h1>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-6 -left-8 text-indigo-500"
            >
              <Zap className="w-6 h-6 floating" style={{ animationDelay: "0.5s" }} />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 text-xl text-gray-600"
          >
            Transform Wikipedia articles into brilliant flashcards
          </motion.p>
        </motion.div>

        {!hasInput && !hasFlashcards ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="fancy-card p-12 border-2 border-purple-200">
              <div className="flex flex-col items-center justify-center text-center">
                <motion.div
                  className="w-32 h-32 flex items-center justify-center"
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" }}
                >
                  <LinkIcon className="w-16 h-16 text-purple-500" />
                </motion.div>

                <h2 className="mt-6 text-2xl font-semibold gradient-text">Enter a Wikipedia URL</h2>
                <p className="mt-2 text-gray-600 mb-6">We'll extract the content and create flashcards for you</p>

                <WikipediaInput onSubmit={handleWikipediaSubmit} />
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            {hasInput && !isProcessing && !hasFlashcards && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="flex items-center mb-4 fancy-card px-4 py-2">
                  <LinkIcon className="w-6 h-6 mr-2 text-purple-600" />
                  <span className="text-lg font-medium text-gray-800 max-w-md truncate">{wikipediaUrl}</span>
                  <Button variant="ghost" size="icon" onClick={resetApp} className="ml-2">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-start">
                    <p>{error}</p>
                  </div>
                )}

                <div className="flex flex-col items-center space-y-4">
                  <Button onClick={handleProcess} className="fancy-button px-6 py-3 text-white" disabled={isProcessing}>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Transform into Flashcards
                  </Button>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <ProcessingAnimation />
                <h2 className="mt-6 text-2xl font-semibold gradient-text neon-purple">Brewing your flashcards...</h2>
                <p className="mt-2 text-gray-600">
                  Our AI is analyzing your Wikipedia article and creating personalized flashcards
                </p>
              </div>
            )}

            {hasFlashcards && (
              <div className="space-y-8">
                <div className="flex items-center justify-between fancy-card p-4">
                  <div>
                    <h2 className="text-2xl font-semibold gradient-text">Your Flashcards</h2>
                    {usingFallback && (
                      <div className="flex items-center mt-1 text-amber-600">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        <p className="text-sm">Using demo content due to extraction issues</p>
                      </div>
                    )}
                    {statusMessage && !usingFallback && <p className="text-sm text-green-600 mt-1">{statusMessage}</p>}
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={resetApp} className="border-purple-200 hover:border-purple-300">
                      Start Over
                    </Button>
                    <Button onClick={handleExport} className="fancy-button text-white">
                      <Download className="w-5 h-5 mr-2" />
                      Export as PDF
                    </Button>
                  </div>
                </div>

                <EnhancedFlashcardGrid flashcards={enhancedFlashcards} />
              </div>
            )}
          </motion.div>
        )}
      </div>

      {!hasInput && !hasFlashcards && (
        <>
          <WorkflowSection />
          <BenefitsSection />
          <ExampleEnhancedFlashcards />
        </>
      )}
    </main>
  )
}
