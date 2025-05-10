"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface FlashcardProps {
  flashcards: Array<{ title: string; content: string }>
}

export default function FlashcardGrid({ flashcards }: FlashcardProps) {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
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
  ]

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
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {flashcards.map((card, index) => {
        const colorScheme = colorSchemes[index % colorSchemes.length]

        return (
          <motion.div key={index} variants={item}>
            <div className="relative h-64 cursor-pointer perspective-1000" onClick={() => toggleFlip(index)}>
              <motion.div
                animate={{
                  rotateY: flippedCards[index] ? 180 : 0,
                }}
                transition={{ duration: 0.6, type: "spring" }}
                className="relative w-full h-full preserve-3d"
              >
                {/* Front of card */}
                <Card
                  className={`absolute w-full h-full p-6 backface-hidden border-2 ${colorScheme.border} ${
                    colorScheme.bgHover
                  } shadow-md transition-all`}
                >
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <h3 className={`text-xl font-semibold ${colorScheme.text}`}>{card.title}</h3>
                    <p className="mt-2 text-sm text-gray-500">(Click to flip)</p>
                  </div>
                </Card>

                {/* Back of card */}
                <Card
                  className={`absolute w-full h-full p-6 backface-hidden rotate-y-180 border-2 ${
                    colorScheme.border
                  } ${colorScheme.bgLight} shadow-md`}
                >
                  <div className="h-full overflow-y-auto">
                    <h4 className={`text-lg font-medium mb-2 ${colorScheme.text}`}>{card.title}</h4>
                    <div className={`w-full h-0.5 ${colorScheme.border} mb-3`}></div>
                    <p className="text-gray-700">{card.content}</p>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
