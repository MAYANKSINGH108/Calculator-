import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const solveMathProblem = async (prompt: string): Promise<AIResponse> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are a helpful and precise math assistant. 
        Your goal is to solve the user's math problem, whether it is a simple calculation or a word problem.
        Provide the final answer clearly and a brief step-by-step explanation.
        If the user asks in Hindi or Hinglish, reply in English but understand the intent.
        
        Return the response in JSON format with 'answer' and 'explanation' fields.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING, description: "The final numerical or short text answer" },
            explanation: { type: Type.STRING, description: "A concise explanation of how the result was derived" }
          },
          required: ["answer", "explanation"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText) as AIResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      answer: "Error",
      explanation: "Failed to connect to Gemini AI. Please check your API key."
    };
  }
};
