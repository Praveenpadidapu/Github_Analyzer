const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRepoReport = async (repoData, commitData) => {
  try {
    // 1. Switch to 'gemini-1.5-flash' for faster and more reliable structured output
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            healthScore: {
              type: SchemaType.INTEGER,
              description: "A score from 0 to 100 representing the repository's health based on stars, forks, and activity."
            },
            procrastinationLevel: {
              type: SchemaType.STRING,
              description: "A string indicating procrastination level: 'Low', 'Medium', or 'High' based on commit consistency."
            },
            summary: {
              type: SchemaType.STRING,
              description: "A two-sentence executive summary of the repository status."
            },
            suggestions: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "An array of 3 actionable suggestions to improve the repository."
            }
          },
          required: ["healthScore", "procrastinationLevel", "summary", "suggestions"]
        }
      }
    });

    const prompt = `
      You are an expert GitHub Auditor. Analyze this repository data.
      
      REPOSITORY: ${repoData.name}
      LANGUAGE: ${repoData.language || 'Unknown'}
      STATS: Stars: ${repoData.stars}, Forks: ${repoData.forks}
      RECENT COMMITS: ${JSON.stringify(commitData.slice(0, 10))}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    
    // Graceful fallback
    return {
      healthScore: 50,
      procrastinationLevel: "Unknown",
      summary: "AI Analysis is currently unavailable due to an API error. Please check backend logs.",
      suggestions: ["Ensure GEMINI_API_KEY is valid", "Try again later"]
    };
  }
};

module.exports = { generateRepoReport };