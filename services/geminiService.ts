
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { WebSearchResult, ImageSearchResult, Source } from '../types';

export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function dataUrlToGeminiPart(dataUrl: string) {
  const [header, data] = dataUrl.split(',');
  const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
  return {
    inlineData: {
      mimeType,
      data,
    },
  };
}

export async function determineModelForQuery(prompt: string): Promise<string> {
  // As per guidelines, 'gemini-2.5-flash' is the preferred model for general text tasks.
  // Simplifying this function to always return it.
  return 'gemini-2.5-flash';
}

export async function runWebSearch(prompt: string, model: string): Promise<WebSearchResult> {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an AI search agent. Provide a concise, well-structured summary that directly answers the user's question based on the provided search results. Use Markdown for formatting, including headings, bold text, and lists where appropriate. Also, find and embed 3 relevant, high-quality images from the search results within the summary using Markdown image syntax (e.g., ![alt text](image_url)). Ensure the images are directly viewable. Keep the summary easy to read.",
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text;
    const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract image URLs using regex
    const imageUrlRegex = /!\[.*?\]\((.*?)\)/g;
    const images: string[] = [];
    let match;
    while ((match = imageUrlRegex.exec(text)) !== null) {
      images.push(match[1]);
    }

    // Optional: remove image markdown from the main text to avoid broken images in text view
    text = text.replace(imageUrlRegex, '').trim();

    const sources: Source[] = rawSources
      .map((chunk: any) => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || 'Untitled',
      }))
      .filter((source: Source) => source.uri)
      .filter((source: Source, index: number, self: Source[]) =>
        index === self.findIndex((s: Source) => s.uri === source.uri)
      );

    return { type: 'web', text, sources, images };
  } catch (error) {
    console.error("Error calling Gemini API for web search:", error);
    throw new Error("Failed to get search results from AI.");
  }
}

export async function runCreativeTask(prompt: string, model: string): Promise<WebSearchResult> {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are a creative AI assistant. Generate high-quality, well-structured content based on the user's request. This could be code, documents, presentation slides, forms, CVs, or other creative formats. Use Markdown for formatting where appropriate to ensure the output is clean and readable.",
      },
    });

    const text = response.text;

    // Creative tasks don't have external sources or generated images in this step
    return { type: 'web', text, sources: [], images: [] };
  } catch (error) {
    console.error("Error calling Gemini API for creative task:", error);
    throw new Error("Failed to get creative result from AI.");
  }
}


export async function runImageAnalysis(prompt: string, imageDataUrl: string, model: string): Promise<ImageSearchResult> {
  try {
    const fullPrompt = `Analyze this image. First, provide exactly 5 single-word keywords that describe it. Then, based on the user's query "${prompt}", provide a concise, single-paragraph answer.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: fullPrompt },
          dataUrlToGeminiPart(imageDataUrl)
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Exactly 5 single-word keywords describing the image.'
            },
            text: {
              type: Type.STRING,
              description: "A concise, single-paragraph answer to the user's query about the image."
            }
          },
          required: ["keywords", "text"]
        }
      }
    });

    const parsedResponse = JSON.parse(response.text);
    return { type: 'image', ...parsedResponse };

  } catch (error) {
    console.error("Error calling Gemini API for image analysis:", error);
    throw new Error("Failed to analyze the image with AI.");
  }
}
