import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Make sure to set GEMINI_API_KEY in .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { repoName, description, language, topics, readmeContent } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured.' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      You are an expert Senior Software Engineer and Architect.
      Please analyze the following GitHub repository and provide a detailed, highly professional technical analysis.

      Repository Name: ${repoName}
      Language: ${language}
      Description: ${description}
      Topics: ${topics?.join(', ')}

      README Content Snippet:
      ${readmeContent ? readmeContent.substring(0, 3000) : 'No README provided'}

      Please structure your response in markdown format with exactly these three sections:
      
      ### 📖 What It Is About
      Provide a comprehensive summary of what this repository is built for, its target audience, and its core value proposition.

      ### ⚙️ How It Works
      Explain the architectural flow, how the components likely interact based on the language and framework, and the main logic or mechanics behind the codebase.

      ### 🛠️ Detailed Tech Stack
      List the expected primary and secondary technologies, frameworks, and libraries used. Explain *why* they were likely chosen for this specific project.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({ analysis: text });
    } catch (aiError: any) {
      console.error('AI Generation Error:', aiError);
      return NextResponse.json(
        { error: aiError.message || 'Gemini model failed to generate response. Check quota or limits.' },
        { status: 502 } // Bad Gateway
      );
    }

  } catch (error: any) {
    console.error('AI Analysis Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request.' },
      { status: 500 }
    );
  }
}
