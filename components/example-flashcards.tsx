"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

const exampleFlashcards = [
  {
    title: "Rocket Propulsion Basics",
    content:
      "Rocket propulsion works on Newton's Third Law: for every action, there is an equal and opposite reaction. As high-pressure gases are expelled from the combustion chamber through the nozzle, they create thrust in the opposite direction. The rocket equation (Tsiolkovsky equation) relates the change in velocity to the exhaust velocity and mass ratio: ΔV = Vₑ × ln(m₀/m₁).",
  },
  {
    title: "Mortgage Lending Process",
    content:
      "The mortgage lending process involves several key stages: pre-approval (credit check, income verification), property appraisal (determining fair market value), underwriting (risk assessment), and closing (final document signing, fund transfer). Lenders evaluate borrowers using the 'Five Cs': Credit history, Capacity to repay, Capital (down payment), Collateral, and Conditions (loan terms, market factors).",
  },
  {
    title: "Quantum Computing Qubits",
    content:
      "Unlike classical bits (0 or 1), quantum bits or 'qubits' can exist in superposition, representing both 0 and 1 simultaneously. Qubits can also be entangled, where the state of one qubit is dependent on another, regardless of distance. These properties enable quantum computers to solve certain problems exponentially faster than classical computers, particularly in cryptography, optimization, and simulation of quantum systems.",
  },
  {
    title: "Neural Network Architecture",
    content:
      "Neural networks consist of interconnected layers of nodes (neurons): input layer (receives data), hidden layers (process information), and output layer (produces results). Each connection has a weight that adjusts during training through backpropagation. Deep neural networks contain multiple hidden layers, enabling them to learn hierarchical features. Common architectures include CNNs (for images), RNNs (for sequences), and Transformers (for language).",
  },
  {
    title: "Blockchain Consensus Mechanisms",
    content:
      "Consensus mechanisms ensure all nodes in a blockchain network agree on the valid state of the distributed ledger. Proof of Work (PoW) requires solving complex puzzles, consuming significant energy. Proof of Stake (PoS) selects validators based on their cryptocurrency holdings, reducing energy usage. Other mechanisms include Delegated Proof of Stake (DPoS), Practical Byzantine Fault Tolerance (PBFT), and Proof of Authority (PoA).",
  },
  {
    title: "CRISPR Gene Editing",
    content:
      "CRISPR-Cas9 is a revolutionary gene editing technology that functions like molecular scissors. The system uses guide RNA (gRNA) to locate specific DNA sequences, and the Cas9 enzyme cuts the DNA at that location. The cell's natural repair mechanisms then fix the break, either by joining the cut ends (NHEJ) or using a template to insert new genetic material (HDR). This allows precise modification of genes for research, medicine, and agriculture.",
  },
]

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

export default function ExampleFlashcards() {
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
          <h2 className="text-3xl font-bold text-gray-800">See Notey in Action</h2>
          <p className="mt-4 text-xl text-gray-600">
            Transform complex topics into easy-to-understand flashcards. Click on a card to flip it!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {exampleFlashcards.map((card, index) => {
            const colorScheme = colorSchemes[index % colorSchemes.length]

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
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
                        <p className="text-gray-700 text-sm">{card.content}</p>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
