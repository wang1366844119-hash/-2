import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateAndSave(prompt: string, filename: string) {
  console.log(`Generating ${filename}...`);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, 'base64');
        const filepath = path.join(process.cwd(), 'public', filename);
        fs.writeFileSync(filepath, buffer);
        console.log(`Saved ${filename}`);
        return;
      }
    }
    console.log(`Failed to find image data for ${filename}`);
  } catch (error) {
    console.error(`Error generating ${filename}:`, error);
  }
}

async function main() {
  await generateAndSave("A cute cartoon squirrel looking at a hard walnut, thinking with a thought bubble about how to crack it open. Comic book style, vibrant colors, clear outlines, no text.", "panel1.png");
  await generateAndSave("A cute cartoon squirrel placing a walnut in the hinge gap of an open wooden door to crack it. Comic book style, vibrant colors, clear outlines, no text.", "panel2.png");
  await generateAndSave("A cute cartoon squirrel happily eating a cracked open walnut. Comic book style, vibrant colors, clear outlines, no text.", "panel3.png");
}

main().catch(console.error);
