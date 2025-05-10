"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import EnhancedFlashcard, { type EnhancedFlashcard as EnhancedFlashcardType } from "./enhanced-flashcard"

interface EnhancedFlashcardGridProps {
  flashcards: EnhancedFlashcardType[]
}

// Define color schemes for cards
const colorSchemes = [
  {
    border: "border-purple-200",
    bgLight: "bg-purple-50",
    bgHover: "hover:bg-purple-100",
    text: "text-purple-700",
    shadow: "shadow-purple-100",
  },
  {
    border: "border-blue-200",
    bgLight: "bg-blue-50",
    bgHover: "hover:bg-blue-100",
    text: "text-blue-700",
    shadow: "shadow-blue-100",
  },
  {
    border: "border-sky-200",
    bgLight: "bg-sky-50",
    bgHover: "hover:bg-sky-100",
    text: "text-sky-700",
    shadow: "shadow-sky-100",
  },
  {
    border: "border-indigo-200",
    bgLight: "bg-indigo-50",
    bgHover: "hover:bg-indigo-100",
    text: "text-indigo-700",
    shadow: "shadow-indigo-100",
  },
  {
    border: "border-violet-200",
    bgLight: "bg-violet-50",
    bgHover: "hover:bg-violet-100",
    text: "text-violet-700",
    shadow: "shadow-violet-100",
  },
  {
    border: "border-teal-200",
    bgLight: "bg-teal-50",
    bgHover: "hover:bg-teal-100",
    text: "text-teal-700",
    shadow: "shadow-teal-100",
  },
]

export default function EnhancedFlashcardGrid({ flashcards }: EnhancedFlashcardGridProps) {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
    >
      {flashcards.map((card, index) => {
        const colorScheme = colorSchemes[index % colorSchemes.length]

        return (
          <motion.div key={index} variants={item} className="h-64 relative">
            <EnhancedFlashcard
              card={card}
              colorScheme={colorScheme}
              isFlipped={!!flippedCards[index]}
              onFlip={() => toggleFlip(index)}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
