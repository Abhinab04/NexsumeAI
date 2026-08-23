import * as dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

async function test() {
    try {
        console.log("Raw API Key:", process.env.GEMINI_API_KEY);
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "hi",
        });
        console.log("Response:", response.text);
    } catch (e) {
        console.error("Test failed:", e);
    }
}

test();
