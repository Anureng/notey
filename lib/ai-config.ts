// AI service configuration
export const aiConfig = {
  // Use environment variables directly
  apiKey: process.env.GROQ_API_KEY,
  modelName: process.env.GROQ_MODEL || "llama3-8b-8192", // Use a smaller model as fallback
  apiEndpoint: "https://api.groq.com/openai/v1/chat/completions",
}

// Make sure the API key is available
export function validateAIConfig() {
  if (!aiConfig.apiKey) {
    console.warn("Missing GROQ_API_KEY environment variable")
    return false
  }

  console.log("Using Groq model:", aiConfig.modelName)
  return true
}
