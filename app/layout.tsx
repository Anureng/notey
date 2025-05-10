import type React from "react"
import type { Metadata } from "next"
import { outfit, spaceGrotesk } from "./fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "Notey - Transform Wikipedia into Flashcards",
  description: "Generate flashcards from Wikipedia articles using AI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable}`}>
      <body className={outfit.className}>{children}</body>
    </html>
  )
}
