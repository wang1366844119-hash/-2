import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateImage(prompt: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: prompt,
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return null;
}

async function main() {
  try {
    console.log("Generating image 1...");
    const img1 = await generateImage("A cute comic style illustration of a squirrel looking at a hard walnut on the ground, thinking about how to open it. Colorful, expressive, 2D art.");
    console.log("Generating image 2...");
    const img2 = await generateImage("A cute comic style illustration of a squirrel placing a walnut in the gap of an open wooden door to crack it. Colorful, expressive, 2D art.");
    console.log("Generating image 3...");
    const img3 = await generateImage("A cute comic style illustration of a happy squirrel eating a cracked open walnut. Colorful, expressive, 2D art.");
    
    const content = `export const comicImages = {
  img1: "${img1}",
  img2: "${img2}",
  img3: "${img3}"
};`;
    
    fs.writeFileSync("src/comicImages.ts", content);
    console.log("Images saved to src/comicImages.ts");
  } catch (error) {
    console.error("Error generating images:", error);
  }
}

main();
