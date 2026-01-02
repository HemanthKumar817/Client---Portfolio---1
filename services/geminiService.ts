
import { GoogleGenAI, Type } from "@google/genai";
import { BrandProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProfessionalProfile = async (targetRole: string, description: string): Promise<BrandProfile> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a professional portfolio brand identity for a job seeker targeting the role of "${targetRole}". 
      Context provided: "${description}".
      
      Generate a comprehensive profile including:
      - A high-impact professional name (if not provided)
      - A technical tagline
      - A 2-sentence summary
      - Key technical skills (as array)
      - 3 realistic project ideas that demonstrate expertise in this field.
      - A hueShift value (0-360) that represents the "mood" of this professional brand (e.g., cool blues for stability, vibrant purples for creativity).
      
      Return as JSON matching the BrandProfile interface.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            role: { type: Type.STRING },
            tagline: { type: Type.STRING },
            summary: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            hueShift: { type: Type.NUMBER }
          },
          required: ["name", "role", "tagline", "summary", "skills", "projects", "hueShift"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
