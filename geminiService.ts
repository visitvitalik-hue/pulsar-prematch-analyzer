
import { GoogleGenAI, Type } from "@google/genai";
import { PULSAR_SYSTEM_PROMPT } from "./constants";
import { Match, ScanResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const scanMatch = async (match: Match): Promise<ScanResult> => {
  const prompt = `Analyze this match: ${match.homeTeam} vs ${match.awayTeam} in ${match.league}. 
  Kickoff: ${match.kickoff}. Generate a detailed Pulsar scan report following the system instructions.
  Ensure the 'postText' is under 280 characters for Telegram.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: PULSAR_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          firstHalf: { type: Type.STRING },
          secondHalf: { type: Type.STRING },
          prediction: {
            type: Type.OBJECT,
            properties: {
              p1: { type: Type.NUMBER },
              totalOver25: { type: Type.NUMBER },
              goal1T: { type: Type.BOOLEAN }
            }
          },
          betOfDay: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          postText: { type: Type.STRING }
        },
        required: ["firstHalf", "secondHalf", "prediction", "betOfDay", "confidence", "postText"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}") as ScanResult;
  
  // Generate Image Banner
  try {
    const imageResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: `High-quality cinematic poster for a football match: ${match.homeTeam} vs ${match.awayTeam}. Show both team logos or symbolic colors on the left and right, with a futuristic glowing stadium background and PULSAR Live Football Scanner text at the bottom. 512x512.`
    });

    for (const part of imageResponse.candidates?.[0]?.content.parts || []) {
      if (part.inlineData) {
        result.imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  } catch (e) {
    console.error("Image generation failed", e);
    result.imageUrl = `https://picsum.photos/seed/${match.id}/512/512`;
  }

  return result;
};
