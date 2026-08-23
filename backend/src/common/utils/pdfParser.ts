import pdf from "pdf-parse";
import mammoth from "mammoth";
import fs from "fs";
import path from "path";

export async function pdf_Parsing(filePath: string): Promise<string> {
    try {
        console.log("========== DOCUMENT PARSER ==========");
        console.log("File path:", filePath);

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const dataBuffer = fs.readFileSync(filePath);

        if (dataBuffer.length === 0) {
            throw new Error("Uploaded file is empty");
        }

        const extension = path
            .extname(filePath)
            .toLowerCase();

        console.log("File extension:", extension);
        console.log("File size:", dataBuffer.length);

        // -----------------------------------------
        // PDF
        // -----------------------------------------

        if (extension === ".pdf") {
            console.log("Parsing as PDF...");

            const data = await pdf(dataBuffer);

            console.log("PDF parsed successfully");
            console.log("Pages:", data.numpages);
            console.log(
                "Text length:",
                data.text?.length
            );

            return data.text || "";
        }

        // -----------------------------------------
        // DOCX
        // -----------------------------------------

        if (extension === ".docx") {
            console.log("Parsing as DOCX...");

            const result =
                await mammoth.extractRawText({
                    buffer: dataBuffer,
                });

            console.log("DOCX parsed successfully");
            console.log(
                "Text length:",
                result.value?.length
            );

            if (result.messages?.length) {
                console.log(
                    "DOCX parser messages:",
                    result.messages
                );
            }

            return result.value || "";
        }

        // -----------------------------------------
        // Unsupported format
        // -----------------------------------------

        throw new Error(
            `Unsupported file format: ${extension}. Please upload a PDF or DOCX file.`
        );

    } catch (error) {
        console.error(
            "========== DOCUMENT PARSER ERROR =========="
        );

        console.error(error);

        console.error(
            "==========================================="
        );

        throw error;
    }
}