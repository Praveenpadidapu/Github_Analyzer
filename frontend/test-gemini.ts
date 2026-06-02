import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
console.log("API Key length:", apiKey.length);

const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent("Hello!");
    console.log("Response:", result.response.text());
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

test();
