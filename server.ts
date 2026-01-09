
/**
 * EXAMPLE BACKEND IMPLEMENTATION (EXPRESS.JS)
 * This file serves as documentation for how to move the logic to a secure server.
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// AI Generation Endpoint
app.post('/api/generate', async (req: Request, res: Response) => {
  const { title, category, style, userPrompt } = req.body;

  try {
    const prompt = `
      Generate a professional YouTube thumbnail.
      Title: ${title}
      Style: ${style}
      Additional: ${userPrompt}
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: '16:9' } }
    });

    const imageData = result.candidates?.[0].content.parts.find(p => p.inlineData)?.inlineData?.data;
    
    if (!imageData) {
      return res.status(500).json({ error: 'No image generated' });
    }

    res.json({ imageUrl: `data:image/png;base64,${imageData}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Generation failed' });
  }
});

// Example DB CRUD would go here (MongoDB/PostgreSQL)
// POST /api/thumbnails
// GET /api/thumbnails
// DELETE /api/thumbnails/:id

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
