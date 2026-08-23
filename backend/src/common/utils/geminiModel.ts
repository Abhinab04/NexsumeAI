import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY as string,
});

async function main(
    prompts: string,
    useJson: boolean = false
): Promise<string> {

    try {
        console.log("========== GEMINI REQUEST ==========");
        console.log("Model: gemini-3.6-flash");
        console.log("JSON:", useJson);

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompts,

            config: {
                ...(useJson && {
                    responseMimeType: "application/json",
                }),
            },
        });

        console.log("Gemini response received");

        console.log(
            "Response length:",
            response.text?.length
        );

        console.log("====================================");

        return response.text ?? "";

    } catch (error) {

        console.error(
            "========== GEMINI ERROR =========="
        );

        console.error(error);

        console.error(
            "================================="
        );

        throw error;
    }
}

export default main;