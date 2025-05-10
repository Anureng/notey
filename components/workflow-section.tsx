"use client"

import type React from "react"

import { motion } from "framer-motion"
import { LinkIcon, Brain, Sparkles, Download } from "lucide-react"

interface WorkflowStepProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

function WorkflowStep({ icon, title, description, delay }: WorkflowStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
      className="flex flex-col items-center text-center"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-purple-100 to-blue-100"
      >
        <div className="text-purple-600">{icon}</div>
      </motion.div>
      <h3 className="mb-2 text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 max-w-xs">{description}</p>
    </motion.div>
  )
}

export default function WorkflowSection() {
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
          <h2 className="text-3xl font-bold text-gray-800">How Notey Works</h2>
          <p className="mt-4 text-xl text-gray-600">Transform your learning in four simple steps</p>
        </motion.div>

        <div className="relative">

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            <WorkflowStep
              icon={<LinkIcon size={28} />}
              title="Enter Wikipedia URL"
              description="Simply paste the URL of any Wikipedia article you want to study and learn from."
              delay={0.1}
            />
            <WorkflowStep
              icon={<Brain size={28} />}
              title="AI Processing"
              description="Our advanced AI analyzes the Wikipedia content, identifying key concepts and important information."
              delay={0.2}
            />
            <WorkflowStep
              icon={<Sparkles size={28} />}
              title="Flashcards Generated"
              description="The AI creates concise, effective flashcards that capture the essential knowledge from the article."
              delay={0.3}
            />
            <WorkflowStep
              icon={<Download size={28} />}
              title="Export & Study"
              description="Download your flashcards as a PDF to study anywhere, anytime, on any device."
              delay={0.4}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 p-6 bg-white rounded-xl shadow-md max-w-3xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex items-center justify-center w-20 h-20 mb-4 md:mb-0 md:mr-6 rounded-full bg-purple-100">
              <Brain size={32} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Why Notey Makes Learning Better</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">✓</span>
                  <span>Save hours of manual note-taking and flashcard creation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">✓</span>
                  <span>Focus on understanding concepts rather than organizing information</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">✓</span>
                  <span>Retain information better with AI-optimized learning materials</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">✓</span>
                  <span>Study more efficiently with concise, focused flashcards</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
