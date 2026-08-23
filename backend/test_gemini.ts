import * as dotenv from "dotenv";
dotenv.config();
import { pdf_Parsing } from "./src/common/utils/pdfParser";
import main from "./src/common/utils/geminiModel";
import path from "path";

async function test() {
    try {
        console.log("Testing Gemini API Key...");
        console.log("API Key:", process.env.GEMINI_API_KEY?.substring(0, 10) + "...");
        
        console.log("\nTesting Gemini response...");
        const result = await main("Return {\"hello\": \"world\"} as JSON", true);
        console.log("Gemini Response:", result);
    } catch (e) {
        console.error("Test failed:", e);
    }
}

test();
