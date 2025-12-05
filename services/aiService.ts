import { GoogleGenAI } from "@google/genai";
import { VEHICLES } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateVehicleImage = async (prompt: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Professional automotive photography, studio lighting, high resolution, 4k. ${prompt}`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }

    throw new Error("No image data returned from the model.");
  } catch (error) {
    console.error("Error generating vehicle image:", error);
    throw error;
  }
};

// AI Concierge Chat Logic
export const sendMessageToAI = async (message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]): Promise<string> => {
    if (!apiKey) return "I'm sorry, my connection to the server is currently unavailable (Missing API Key).";

    try {
        // Construct fleet context
        const fleetContext = VEHICLES.map(v => 
            `- ${v.name} (${v.type}): $${v.pricePerDay}/day. Location: ${v.location}. Seats: ${v.specs.seats}. Features: ${v.features.join(', ')}.`
        ).join('\n');

        const systemInstruction = `You are the "Prestige AI Concierge", a sophisticated digital assistant for a luxury vehicle rental platform. 
        
        Your goals:
        1. Assist wealthy clients in selecting vehicles from our Elite Fleet.
        2. Be polite, concise, and sophisticated in your tone.
        3. Use the provided fleet data to make recommendations.
        4. If a user asks to book, guide them to the specific vehicle page (you can't perform the booking action yourself).
        
        Current Fleet Data:
        ${fleetContext}
        
        If asked about vehicles not in this list, politely inform them we specialize in our curated collection.`;

        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
            history: history,
        });

        const result = await chat.sendMessage({ message });
        return result.text || "I apologize, I didn't catch that. Could you rephrase?";
    } catch (error) {
        console.error("Error in AI chat:", error);
        return "I am currently experiencing high traffic. Please try again in a moment.";
    }
};