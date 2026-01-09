
import { GoogleGenAI } from "@google/genai";
import { BASE_SYSTEM_PROMPT, CATEGORY_PROMPTS } from '../constants';
import { ThumbnailCategory, ThumbnailStyle } from '../types';

export const generateThumbnailImage = async (
  title: string,
  category: ThumbnailCategory,
  style: ThumbnailStyle,
  userPrompt?: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const finalPrompt = `
    ${BASE_SYSTEM_PROMPT}
    Video Topic: ${title}
    Category Context: ${CATEGORY_PROMPTS[category]}
    Visual Style: ${style.promptModifier}
    Additional Details: ${userPrompt || 'Focus on the core theme of the video.'}
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: finalPrompt }
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from AI");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
