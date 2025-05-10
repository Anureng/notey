"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, FileText, ImageIcon, LineChart, RatioIcon as Formula } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"

// Define the content types a flashcard can have
export type ContentType = "text" | "formula" | "image" | "graph"

// Define the structure for chart data
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
  }[]
}

// Define the enhanced flashcard structure
export interface EnhancedFlashcard {
  title: string
  content: string
  formula?: string
  image?: string
  graph?: {
    type: "line" | "bar" | "pie"
    data: ChartData
  }
}

interface EnhancedFlashcardProps {
  card: EnhancedFlashcard
  colorScheme: {
    border: string
    bgLight: string
    bgHover: string
    text: string
    shadow: string
  }
  isFlipped: boolean
  onFlip: () => void
}

export default function EnhancedFlashcard({ card, colorScheme, isFlipped, onFlip }: EnhancedFlashcardProps) {
  // Track which content type is currently being viewed
  const [activeContent, setActiveContent] = useState<ContentType>("text")

  // Determine which content types are available for this card
  const availableContentTypes: ContentType[] = ["text"]
  if (card.formula) availableContentTypes.push("formula")
  if (card.image) availableContentTypes.push("image")
  if (card.graph) availableContentTypes.push("graph")

  // Navigate to the next or previous content type
  const navigate = (direction: "next" | "prev") => {
    const currentIndex = availableContentTypes.indexOf(activeContent)
    let newIndex

    if (direction === "next") {
      newIndex = (currentIndex + 1) % availableContentTypes.length
    } else {
      newIndex = (currentIndex - 1 + availableContentTypes.length) % availableContentTypes.length
    }

    setActiveContent(availableContentTypes[newIndex])
  }

  // Render formula using simple styling
  const renderFormula = () => {
    if (!card.formula) return null

    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-4 font-serif text-lg">
          {/* Simple formula display without KaTeX */}
          <pre className="whitespace-pre-wrap overflow-x-auto font-mono text-base">{card.formula}</pre>
        </div>
      </div>
    )
  }

  // Render image
  const renderImage = () => {
    if (!card.image) return null

    return (
      <div className="flex items-center justify-center h-full p-2">
        <img
          src={card.image || "/placeholder.svg"}
          alt={`Illustration for ${card.title}`}
          className="max-h-full max-w-full object-contain rounded-md"
        />
      </div>
    )
  }

  // Render graph
  const renderGraph = () => {
    if (!card.graph) return null

    // Simple canvas-based graph rendering
    return (
      <div className="flex items-center justify-center h-full p-2">
        <div className="w-full h-full max-h-32 relative">
          {card.graph.type === "line" && (
            <svg viewBox="0 0 100 50" className="w-full h-full">
              {/* X and Y axes */}
              <line x1="10" y1="45" x2="90" y2="45" stroke="gray" strokeWidth="0.5" />
              <line x1="10" y1="5" x2="10" y2="45" stroke="gray" strokeWidth="0.5" />

              {/* Plot line */}
              <polyline
                points={card.graph.data.datasets[0].data
                  .map((value, index) => {
                    const x = 10 + (index * 80) / (card.graph.data.labels.length - 1)
                    const y = 45 - (value * 40) / Math.max(...card.graph.data.datasets[0].data)
                    return `${x},${y}`
                  })
                  .join(" ")}
                fill="none"
                stroke={colorScheme.text.replace("text-", "var(--")}
                strokeWidth="1"
              />

              {/* Data points */}
              {card.graph.data.datasets[0].data.map((value, index) => {
                const x = 10 + (index * 80) / (card.graph.data.labels.length - 1)
                const y = 45 - (value * 40) / Math.max(...card.graph.data.datasets[0].data)
                return <circle key={index} cx={x} cy={y} r="1" fill={colorScheme.text.replace("text-", "var(--")} />
              })}

              {/* X-axis labels */}
              {card.graph.data.labels.map((label, index) => {
                const x = 10 + (index * 80) / (card.graph.data.labels.length - 1)
                return (
                  <text key={index} x={x} y="49" fontSize="3" textAnchor="middle" fill="currentColor">
                    {label}
                  </text>
                )
              })}
            </svg>
          )}
          <div className="text-xs text-center mt-2">{card.graph.data.datasets[0].label}</div>
        </div>
      </div>
    )
  }

  // Content type indicator icons
  const contentTypeIcons = () => {
    return (
      <div className="absolute top-2 right-2 flex space-x-1 z-10">
        {availableContentTypes.map((type) => {
          let Icon
          switch (type) {
            case "text":
              Icon = FileText
              break
            case "formula":
              Icon = Formula
              break
            case "image":
              Icon = ImageIcon
              break
            case "graph":
              Icon = LineChart
              break
          }

          return (
            <div
              key={type}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeContent === type
                  ? `${colorScheme.text} bg-white bg-opacity-80 shadow-md`
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={14} />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flashcard-container" onClick={onFlip}>
      <div className="flashcard-inner" style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
        {/* Front of card */}
        <div className="flashcard-face flashcard-front">
          <Card
            className={`w-full h-full p-6 border-2 ${colorScheme.border} ${colorScheme.bgHover} shadow-lg transition-all fancy-card`}
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h3 className={`text-xl font-semibold ${colorScheme.text}`}>{card.title}</h3>
              <p className="mt-2 text-sm text-gray-500">(Click to flip)</p>

              {/* Decorative elements */}
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-transparent opacity-50"></div>
              <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-blue-200 to-transparent opacity-50"></div>
            </div>
          </Card>
        </div>

        {/* Back of card */}
        <div className="flashcard-face flashcard-back">
          <Card
            className={`w-full h-full p-6 border-2 ${colorScheme.border} ${colorScheme.bgLight} shadow-lg fancy-card`}
          >
            {/* Content type indicators */}
            {contentTypeIcons()}

            {/* Card title */}
            <h4 className={`text-lg font-semibold mb-2 ${colorScheme.text} pr-20 gradient-text`}>{card.title}</h4>
            <div className={`w-full h-0.5 ${colorScheme.border} mb-3 shimmer`}></div>

            {/* Card content based on active type */}
            <div className="h-[calc(100%-3.5rem)] overflow-y-auto relative">
              {activeContent === "text" && (
                <div className="text-gray-700 text-sm prose prose-sm max-w-none">
                  <ReactMarkdown>{card.content}</ReactMarkdown>
                </div>
              )}
              {activeContent === "formula" && renderFormula()}
              {activeContent === "image" && renderImage()}
              {activeContent === "graph" && renderGraph()}

              {/* Navigation arrows (only show if there are multiple content types) */}
              {availableContentTypes.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-70 hover:opacity-100 bg-white bg-opacity-50 backdrop-blur-sm z-10"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate("prev")
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-70 hover:opacity-100 bg-white bg-opacity-50 backdrop-blur-sm z-10"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate("next")
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
