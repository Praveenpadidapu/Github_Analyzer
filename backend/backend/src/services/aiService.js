const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRepoReport = async (repoData, commitData) => {
  try {
    // 1. Switch to 'gemini-pro' which is widely supported in all regions/versions
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are an expert GitHub Auditor. Analyze this repository data and provide a JSON response.
      
      REPOSITORY: ${repoData.name}
      LANGUAGE: ${repoData.language || 'Unknown'}
      STATS: Stars: ${repoData.stars}, Forks: ${repoData.forks}
      RECENT COMMITS: ${JSON.stringify(commitData.slice(0, 5))}

      Return ONLY a JSON object with this exact structure:
      {
        "healthScore": 85,
        "procrastinationLevel": "Low",
        "summary": "Two sentence executive summary here.",
        "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 2. Robust JSON Cleaning
    // Removes markdown backticks if the AI includes them
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini AI Error Detail:", error);
    
    // If 'gemini-pro' also fails, we'll return a safe mock object 
    // so your UI doesn't break while you troubleshoot billing/keys
    return {
      healthScore: 0,
      procrastinationLevel: "Unknown",
      summary: "AI Analysis is currently unavailable. Please check API key permissions.",
      suggestions: ["Verify GEMINI_API_KEY in .env", "Ensure @google/generative-ai is updated"]
    };
  }
};

module.exports = { generateRepoReport };