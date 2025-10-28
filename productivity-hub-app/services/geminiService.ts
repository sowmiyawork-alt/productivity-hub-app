import { GoogleGenAI, Type } from "@google/genai";
import { WordOfTheDayType } from "../types";

// Fix: Aligned with @google/genai coding guidelines by using process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

export const getMotivationalMessage = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: "Give me a short, powerful motivational message for someone managing their daily tasks. It should be one sentence."
        });
        const text = response.text.trim();
        // Remove quotes if they exist
        return text.replace(/^"|"$/g, '');
    } catch (error) {
        console.error("Error fetching motivational message:", error);
        throw new Error("Could not connect to Gemini API.");
    }
};

export const getWordOfTheDay = async (): Promise<WordOfTheDayType> => {
    const prompt = "Teach me one new business lingo, rich vocabulary, or a powerful phrase. Provide its name, a simple definition, and an example of its use in a sentence.";
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        term: {
                            type: Type.STRING,
                            description: "The business lingo, vocabulary word, or phrase."
                        },
                        definition: {
                            type: Type.STRING,
                            description: "A clear and concise definition."
                        },
                        example: {
                            type: Type.STRING,
                            description: "An example sentence showing how to use it."
                        }
                    },
                    required: ["term", "definition", "example"]
                }
            }
        });

        const jsonStr = response.text.trim();
        if (!jsonStr) {
          throw new Error("Received empty response from Gemini API for word of the day.");
        }
        const parsedResponse = JSON.parse(jsonStr);
        return parsedResponse as WordOfTheDayType;
    } catch (error) {
        console.error("Error fetching word of the day:", error);
        throw new Error("Could not connect to Gemini API for the word of the day.");
    }
};
