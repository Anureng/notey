"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import EnhancedFlashcard, { type EnhancedFlashcard as EnhancedFlashcardType } from "./enhanced-flashcard"

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
    border: "border-teal-200",
    bgLight: "bg-teal-50",
    bgHover: "hover:bg-teal-100",
    text: "text-teal-700",
    shadow: "shadow-teal-100",
  },
]

// Example flashcards with rich content
const exampleFlashcards: EnhancedFlashcardType[] = [
  {
    title: "Rocket Propulsion Equation",
    content:
      "The rocket equation relates the change in velocity (ΔV) to the exhaust velocity (Vₑ) and the initial and final mass of the rocket. This fundamental equation in astronautics shows why staging is so important for rockets.",
    formula: "ΔV = Vₑ × ln(m₀/m₁)",
    graph: {
      type: "line",
      data: {
        labels: ["0", "0.2", "0.4", "0.6", "0.8", "1.0"],
        datasets: [
          {
            label: "Δv vs. Mass Ratio (m₀/m₁)",
            data: [0, 0.6, 1.2, 1.8, 2.4, 3.0],
          },
        ],
      },
    },
  },
  {
    title: "Quantum Superposition",
    content:
      "Quantum superposition is a fundamental principle of quantum mechanics that describes a physical system existing in multiple states simultaneously. This is represented mathematically as a sum of basis states with complex coefficients.",
    formula: "|ψ⟩ = α|0⟩ + β|1⟩",
    image: "/quantum-superposition.png",
  },
  {
    title: "Neural Network Activation",
    content:
      "The sigmoid function is a common activation function in neural networks. It maps any input value to a value between 0 and 1, creating an S-shaped curve. It's useful for models where we need to predict probability as an output.",
    formula: "σ(x) = 1/(1 + e^(-x))",
    graph: {
      type: "line",
      data: {
        labels: ["-6", "-4", "-2", "0", "2", "4", "6"],
        datasets: [
          {
            label: "Sigmoid Function",
            data: [0.002, 0.018, 0.119, 0.5, 0.881, 0.982, 0.998],
          },
        ],
      },
    },
  },
  {
    title: "Mortgage Amortization",
    content:
      "Mortgage amortization is the process of paying off a mortgage loan through regular payments. The formula calculates the monthly payment amount needed to fully repay the loan with interest over a specified term.",
    formula: "M = P × r(1+r)^n / ((1+r)^n-1)",
    graph: {
      type: "line",
      data: {
        labels: ["Year 1", "Year 5", "Year 10", "Year 15", "Year 20", "Year 25", "Year 30"],
        datasets: [
          {
            label: "Principal vs. Interest Over Time",
            data: [10, 25, 40, 55, 70, 85, 100],
          },
        ],
      },
    },
  },
]

export default function ExampleEnhancedFlashcards() {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800">Rich Interactive Flashcards</h2>
          <p className="mt-4 text-xl text-gray-600">
            Navigate between text, formulas, images, and graphs with our enhanced flashcards. Click to flip!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          {exampleFlashcards.map((card, index) => {
            const colorScheme = colorSchemes[index % colorSchemes.length]

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="h-64 relative"
              >
                <EnhancedFlashcard
                  card={card}
                  colorScheme={colorScheme}
                  isFlipped={!!flippedCards[index]}
                  onFlip={() => toggleFlip(index)}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
