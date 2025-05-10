"use client"

import type React from "react"

import { useState } from "react"
import { Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

interface WikipediaInputProps {
  onSubmit: (url: string) => void
}

export default function WikipediaInput({ onSubmit }: WikipediaInputProps) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!url.trim()) {
      setError("Please enter a Wikipedia URL")
      return
    }

    // Check if it's a Wikipedia URL
    if (!url.includes("wikipedia.org")) {
      setError("Please enter a valid Wikipedia URL")
      return
    }

    setError("")
    onSubmit(url)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="relative">
            <motion.div
              animate={isFocused ? { scale: 1.03 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`absolute inset-0 rounded-md bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 opacity-20 blur-md transition-all duration-300 ${
                isFocused ? "opacity-50" : "opacity-20"
              }`}
            ></motion.div>
            <Input
              type="url"
              placeholder="Enter Wikipedia URL (e.g., https://en.wikipedia.org/wiki/Rocket)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full relative z-10 border-2 border-purple-200 focus:border-purple-400 transition-all duration-300"
            />
          </div>
          {error && (
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-500">
              {error}
            </motion.p>
          )}
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button type="submit" className="w-full fancy-button text-white py-6">
            <Search className="w-5 h-5 mr-2" />
            <span>Generate from Wikipedia</span>
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </form>
    </div>
  )
}
