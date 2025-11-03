import { GoogleGenAI, Type } from "@google/genai";
import type { NicheData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const nichePrompts: { [key: string]: string } = {
  'High-Paying': 'List 100 high-paying US niches. The response should be a JSON array of strings.',
  'Entertainment': 'List 100 popular entertainment niches in the US, like hobbies, movies, gaming, and celebrity culture. The response should be a JSON array of strings.',
  'Pinterest': 'List 100 popular and visually-driven niches found on Pinterest, like DIY crafts, home decor, recipes, and fashion trends. The response should be a JSON array of strings.',
  'TikTok': 'List 100 popular niches on TikTok, including trends, challenges, and content styles. The response should be a JSON array of strings.',
};

export const fetchNichesByCategory = async (category: string): Promise<string[]> => {
    const prompt = nichePrompts[category];
    if (!prompt) {
        throw new Error(`Invalid niche category provided: ${category}`);
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                        description: "A niche topic."
                    },
                },
            },
        });

        const jsonString = response.text.trim();
        const niches: string[] = JSON.parse(jsonString);
        return niches;
    } catch (error) {
        console.error(`Error fetching ${category} niches from Gemini API:`, error);
        throw new Error(`Failed to fetch ${category} niches from the API.`);
    }
};


export const generateNicheData = async (niche: string, category: string): Promise<NicheData> => {
    let contents = '';
    let responseSchema = {};

    if (category === 'TikTok') {
        contents = `For the niche "${niche}", generate a JSON object with two keys: "websites" and "popularChannels". "websites" should be an array of 10 relevant social media websites (like Instagram, Twitter, etc.). Each object should have a "name" and a "url". "popularChannels" should be an array of 15 popular channels related to this niche across Facebook, YouTube, and TikTok. Each object should have "platform" ("Facebook", "YouTube", or "TikTok"), "name", and "url".`;
        responseSchema = {
            type: Type.OBJECT,
            properties: {
                websites: {
                    type: Type.ARRAY,
                    description: "A list of 10 relevant social media websites.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "The name of the website." },
                            url: { type: Type.STRING, description: "The full URL of the website." }
                        },
                        required: ["name", "url"]
                    }
                },
                popularChannels: {
                    type: Type.ARRAY,
                    description: "A list of 15 popular channels across platforms.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            platform: { type: Type.STRING, enum: ["Facebook", "YouTube", "TikTok"] },
                            name: { type: Type.STRING, description: "The name of the channel." },
                            url: { type: Type.STRING, description: "The URL to the channel." }
                        },
                        required: ["platform", "name", "url"]
                    }
                }
            },
            required: ["websites", "popularChannels"]
        };
    } else {
        contents = `For the niche "${niche}", generate a JSON object with two keys: "websites" and "searchQueries". "websites" should be an array of 15 random, commonly used website links. Include a mix of social media, finance, news, and other relevant categories. Each object in the array should have a "name" and a "url" (starting with https://). "searchQueries" should be an array of 5 common Google search queries a person interested in this niche would use.`;
        responseSchema = {
            type: Type.OBJECT,
            properties: {
                websites: {
                    type: Type.ARRAY,
                    description: "A list of 15 relevant websites.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: {
                                type: Type.STRING,
                                description: "The name of the website."
                            },
                            url: {
                                type: Type.STRING,
                                description: "The full URL of the website."
                            }
                        },
                        required: ["name", "url"]
                    },
                },
                searchQueries: {
                    type: Type.ARRAY,
                    description: "A list of 5 common Google search queries.",
                    items: {
                        type: Type.STRING
                    }
                }
            },
            required: ["websites", "searchQueries"]
        };
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const data: NicheData = JSON.parse(jsonString);
        return data;
    } catch (error) {
        console.error(`Error generating data for niche "${niche}" in category "${category}":`, error);
        throw new Error(`Failed to generate data for the niche "${niche}".`);
    }
};
