import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);

// pdf-parse v1 internally has a test/debug section in its main entry.
// Loading the actual parser implementation avoids that issue.
const pdf = require("pdf-parse/lib/pdf-parse.js");

export async function pdf_Parsing(
  filePath: string,
): Promise<string> {
  try {
    console.log("========== DOCUMENT PARSER ==========");
    console.log("File path:", filePath);

    // -------------------------------------------------
    // Check file
    // -------------------------------------------------

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

    // -------------------------------------------------
    // PDF
    // -------------------------------------------------

    if (extension === ".pdf") {
      console.log("Parsing as PDF...");

      const data = await pdf(dataBuffer);

      console.log("PDF parsed successfully");
      console.log("Pages:", data.numpages);
      console.log(
        "Text length:",
        data.text?.length ?? 0,
      );

      return data.text || "";
    }

    // -------------------------------------------------
    // DOCX
    // -------------------------------------------------

    if (extension === ".docx") {
      console.log("Parsing as DOCX...");

      const result =
        await mammoth.extractRawText({
          buffer: dataBuffer,
        });

      console.log("DOCX parsed successfully");
      console.log(
        "Text length:",
        result.value?.length ?? 0,
      );

      if (result.messages?.length) {
        console.log(
          "DOCX parser messages:",
          result.messages,
        );
      }

      return result.value || "";
    }

    // -------------------------------------------------
    // Unsupported file
    // -------------------------------------------------

    throw new Error(
      `Unsupported file format: ${extension}. Please upload a PDF or DOCX file.`,
    );
  } catch (error) {
    console.error(
      "========== DOCUMENT PARSER ERROR ==========",
    );

    console.error(error);

    console.error(
      "===========================================",
    );

    throw error;
  }
}
