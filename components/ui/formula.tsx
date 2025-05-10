import type { LightbulbIcon as LucideProps } from "lucide-react"

export const Formula = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 12h16" />
    <path d="M4 6h16" />
    <path d="M7 18h7" />
    <path d="M19 18h1" />
  </svg>
)
