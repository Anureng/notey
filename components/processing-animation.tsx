"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

export default function ProcessingAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="relative w-40 h-40 flex items-center justify-center">
      <motion.div
        className="brain text-purple-500"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
        </svg>
      </motion.div>

      {/* Pulsing circles with gradient */}
      <motion.div
        className="circle absolute inset-0 rounded-full"
        style={{
          background: "linear-gradient(120deg, rgba(168, 85, 247, 0.4), rgba(99, 102, 241, 0.4))",
          border: "2px solid rgba(168, 85, 247, 0.2)",
        }}
        animate={{
          scale: [0, 1],
          opacity: [0.7, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeOut",
          delay: 0,
        }}
      />

      <motion.div
        className="circle absolute inset-0 rounded-full"
        style={{
          background: "linear-gradient(120deg, rgba(99, 102, 241, 0.4), rgba(59, 130, 246, 0.4))",
          border: "2px solid rgba(99, 102, 241, 0.2)",
        }}
        animate={{
          scale: [0, 1],
          opacity: [0.7, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeOut",
          delay: 0.3,
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-purple-400"
          initial={{
            x: Math.random() * 80 - 40,
            y: Math.random() * 80 - 40,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Loading dots */}
      <div className="absolute -bottom-8 flex space-x-1">
        <motion.div
          className="dot w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
          animate={{ translateY: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0,
          }}
        />
        <motion.div
          className="dot w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
          animate={{ translateY: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.15,
          }}
        />
        <motion.div
          className="dot w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
          animate={{ translateY: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />
      </div>
    </div>
  )
}
