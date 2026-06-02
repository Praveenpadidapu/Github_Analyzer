import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateRepoReport = async (repoData: any, commitData: any[], languageData: any = {}) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            healthScore: {
              type: SchemaType.INTEGER,
              description: "A score from 0 to 100 representing the repository's health based on stars, forks, language usage, and commit activity."
            },
            procrastinationLevel: {
              type: SchemaType.STRING,
              description: "A string indicating procrastination level: 'Low', 'Medium', or 'High' based on commit consistency."
            },
            summary: {
              type: SchemaType.STRING,
              description: "A two-sentence executive summary of the repository status, specifically referencing the tech stack used."
            },
            suggestions: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "An array of 3 highly actionable suggestions to improve the repository, directly related to its tech stack and commit patterns."
            }
          },
          required: ["healthScore", "procrastinationLevel", "summary", "suggestions"]
        }
      }
    });

    const prompt = `
      You are an expert Software Engineer and GitHub Auditor. Analyze this repository data.
      Provide highly accurate, completely unique insights based strictly on the provided language statistics and commit history.
      Do not give generic advice. Tailor your 3 suggestions to the dominant languages and the recent commit messages.
      
      REPOSITORY: ${repoData.name}
      PRIMARY LANGUAGE: ${repoData.language || 'Unknown'}
      FULL LANGUAGE DISTRIBUTION (Bytes): ${JSON.stringify(languageData)}
      STATS: Stars: ${repoData.stars}, Forks: ${repoData.forks}
      RECENT COMMITS: ${JSON.stringify(commitData.slice(0, 15))}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Safely parse JSON even if Gemini hallucinates markdown wrappers
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    
    // Graceful fallback
    return {
      healthScore: 50,
      procrastinationLevel: "Unknown",
      summary: "AI Analysis is currently unavailable due to an API error. Please ensure GEMINI_API_KEY is set in Vercel.",
      suggestions: ["Ensure GEMINI_API_KEY is valid", "Try again later"]
    };
  }
};
