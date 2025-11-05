import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData, CurrencyRates, QuoteData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getWeather = async (lat: number, lon: number): Promise<WeatherData> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Provide the current weather for latitude ${lat} and longitude ${lon}. Also provide a suitable icon name from this list: ['SUN', 'CLOUD', 'RAIN', 'STORM', 'WIND', 'FOG']. Respond in JSON format with the schema provided.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        location: { type: Type.STRING, description: "City or area name" },
                        temperatureCelsius: { type: Type.NUMBER, description: "Temperature in Celsius" },
                        condition: { type: Type.STRING, description: "Brief weather condition, e.g., 'Partly Cloudy'" },
                        icon: { type: Type.STRING, description: "An icon name from the allowed list" },
                        humidity: { type: Type.NUMBER, description: "Humidity percentage" },
                        windSpeedKph: { type: Type.NUMBER, description: "Wind speed in kilometers per hour" }
                    },
                    required: ["location", "temperatureCelsius", "condition", "icon", "humidity", "windSpeedKph"]
                }
            }
        });
        
        const data = JSON.parse(response.text);
        return data as WeatherData;
    } catch (error) {
        console.error("Error fetching weather data from Gemini:", error);
        throw new Error("Failed to fetch weather data. Please try again.");
    }
};

export const getCurrencyRates = async (): Promise<CurrencyRates> => {
    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Provide the current conversion rates from 1 INR to USD and EUR. Respond in JSON format with the schema provided.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        rates: {
                            type: Type.OBJECT,
                            properties: {
                                USD: { type: Type.NUMBER },
                                EUR: { type: Type.NUMBER }
                            },
                            required: ["USD", "EUR"]
                        }
                    },
                    required: ["rates"]
                }
            }
        });
        
        const data = JSON.parse(response.text);
        return data.rates as CurrencyRates;
    } catch (error) {
        console.error("Error fetching currency rates from Gemini:", error);
        throw new Error("Failed to fetch currency rates. Please try again.");
    }
};

export const getQuote = async (): Promise<QuoteData> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a short, impactful motivational quote. Respond in JSON format with the schema provided.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        quote: { type: Type.STRING },
                        author: { type: Type.STRING }
                    },
                    required: ["quote", "author"]
                }
            }
        });
        
        const data = JSON.parse(response.text);
        return data as QuoteData;
    } catch (error) {
        console.error("Error fetching quote from Gemini:", error);
        throw new Error("Failed to fetch a quote. Please try again.");
    }
};
