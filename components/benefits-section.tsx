"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Clock, Brain, Lightbulb, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"

interface BenefitCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

function BenefitCard({ icon, title, description, delay }: BenefitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card className="p-6 h-full border-2 border-transparent hover:border-purple-200 transition-all">
        <div className="flex items-center mb-4">
          <div className="p-2 mr-4 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100">
            <div className="text-purple-600">{icon}</div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </Card>
    </motion.div>
  )
}

export default function BenefitsSection() {
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800">Why Choose Notey</h2>
          <p className="mt-4 text-xl text-gray-600">Transform your study materials into effective learning tools</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <BenefitCard
            icon={<Clock size={24} />}
            title="Save Time"
            description="Automatically generate flashcards in seconds instead of spending hours creating them manually."
            delay={0.1}
          />
          <BenefitCard
            icon={<Brain size={24} />}
            title="Enhance Retention"
            description="Flashcards are scientifically proven to improve memory and knowledge retention through active recall."
            delay={0.2}
          />
          <BenefitCard
            icon={<Lightbulb size={24} />}
            title="Focus on What Matters"
            description="Our AI identifies key concepts and important details, so you don't miss critical information."
            delay={0.3}
          />
          <BenefitCard
            icon={<Sparkles size={24} />}
            title="Study Smarter"
            description="Concise, well-formatted flashcards make studying more efficient and effective."
            delay={0.4}
          />
        </div>
      </div>
    </section>
  )
}
