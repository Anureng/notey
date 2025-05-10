import { jsPDF } from "jspdf"

// Simple function to convert basic Markdown to plain text
function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
    .replace(/\*(.*?)\*/g, "$1") // Italic
    .replace(/`(.*?)`/g, "$1") // Code
    .replace(/~~(.*?)~~/g, "$1") // Strikethrough
    .replace(/\[(.*?)\]$$.*?$$/g, "$1") // Links
    .replace(/^\s*[*+-]\s+/gm, "• ") // Bullet points
    .replace(/^\s*\d+\.\s+/gm, "• ") // Numbered lists
    .replace(/^\s*>\s+/gm, "") // Blockquotes
    .replace(/^\s*#{1,6}\s+/gm, "") // Headers
}

export async function exportToPdf(
  flashcards: Array<{ title: string; content: string }>,
  filename: string,
): Promise<void> {
  // Create a new PDF document
  const doc = new jsPDF()

  // Set title
  doc.setFontSize(20)
  doc.setTextColor(128, 0, 128) // Purple
  doc.text("Notey Flashcards", 105, 20, { align: "center" })

  // Add generation info
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" })

  // Define card colors (RGB values)
  const cardColors = [
    { bg: [248, 240, 252], border: [216, 180, 254], title: [126, 34, 206] }, // Purple
    { bg: [239, 246, 255], border: [191, 219, 254], title: [37, 99, 235] }, // Blue
    { bg: [240, 249, 255], border: [186, 230, 253], title: [2, 132, 199] }, // Sky
  ]

  let y = 50
  let pageCount = 1

  // Add each flashcard
  flashcards.forEach((card, index) => {
    // Check if we need a new page
    if (y > 240) {
      doc.addPage()
      y = 20
      pageCount++
    }

    // Get color scheme for this card
    const colorScheme = cardColors[index % cardColors.length]

    // Draw card background
    doc.setFillColor(...colorScheme.bg)
    doc.setDrawColor(...colorScheme.border)
    doc.setLineWidth(0.5)
    doc.roundedRect(20, y, 170, 60, 3, 3, "FD") // Filled with border

    // Card title
    doc.setFontSize(14)
    doc.setTextColor(...colorScheme.title)
    doc.setFont(undefined, "bold")
    doc.text(card.title, 25, y + 10)

    // Divider line
    doc.setDrawColor(...colorScheme.border)
    doc.setLineWidth(0.3)
    doc.line(25, y + 15, 185, y + 15)

    // Card content - convert Markdown to plain text
    doc.setFontSize(12)
    doc.setFont(undefined, "normal")
    doc.setTextColor(50, 50, 50)

    // Convert Markdown to plain text
    const plainTextContent = markdownToPlainText(card.content)

    // Split long content into multiple lines
    const contentLines = doc.splitTextToSize(plainTextContent, 160)

    // Limit number of lines to fit in card
    const maxLines = 3
    const displayLines = contentLines.slice(0, maxLines)

    doc.text(displayLines, 25, y + 25)

    // If content was truncated, add ellipsis
    if (contentLines.length > maxLines) {
      doc.text("...", 25, y + 25 + maxLines * 7)
    }

    // Update y position for next card
    y += 70
  })

  // Add page numbers
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" })
  }

  // Save the PDF
  doc.save(`${filename.replace(/\.[^/.]+$/, "")}-flashcards.pdf`)
}
