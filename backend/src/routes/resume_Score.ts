import express, {
    type Express,
    type Response,
    type Request,
    type Router,
} from "express";

import { upload } from "../common/middleware/multerMiddleware.js";
import main from "../common/utils/geminiModel.js";
import { pdf_Parsing } from "../common/utils/pdfParser.js";

export const Resume_ScoreRouter: Router = express.Router();

Resume_ScoreRouter.post(
    "/resume_score",

    (req, res, next) => {
        console.log("\n========== REQUEST ARRIVED AT ROUTE (BEFORE MULTER) ==========");
        next();
    },

    upload.fields([
        {
            name: "resume",
            maxCount: 1,
        },
        {
            name: "job_Description",
            maxCount: 1,
        },
    ]),

    async (req: Request, res: Response) => {
        try {
            console.log("\n========== RESUME SCORE START ==========");

            // --------------------------------------------------
            // 1. Check uploaded files
            // --------------------------------------------------

            const files = req.files as {
                [fieldname: string]: Express.Multer.File[];
            };

            console.log("Files received:", Object.keys(files || {}));

            if (!files) {
                console.error("No files received");

                return res.status(400).json({
                    success: false,
                    message: "No files were uploaded",
                });
            }

            if (!files.resume || !files.job_Description) {
                console.error("Missing required files");
                console.error("Received fields:", Object.keys(files));

                return res.status(400).json({
                    success: false,
                    message:
                        "Resume and JD need to be uploaded properly!",
                });
            }

            const resumeFile = files.resume[0];
            const jdFile = files.job_Description[0];

            console.log("Resume file:", {
                originalname: resumeFile.originalname,
                mimetype: resumeFile.mimetype,
                size: resumeFile.size,
                path: resumeFile.path,
            });

            console.log("JD file:", {
                originalname: jdFile.originalname,
                mimetype: jdFile.mimetype,
                size: jdFile.size,
                path: jdFile.path,
            });

            // --------------------------------------------------
            // 2. Template
            // --------------------------------------------------

            const templateText = req.body.template || "default";

            console.log("Template:", templateText);

            // --------------------------------------------------
            // 3. Parse Resume PDF
            // --------------------------------------------------

            console.log("\nParsing resume PDF...");

            const resumeText = await pdf_Parsing(resumeFile.path);

            console.log(
                "Resume parsed successfully."
            );

            console.log(
                "Resume text length:",
                resumeText?.length
            );

            // --------------------------------------------------
            // 4. Parse Job Description PDF
            // --------------------------------------------------

            console.log("\nParsing JD PDF...");

            const jdText = await pdf_Parsing(jdFile.path);

            console.log(
                "JD parsed successfully."
            );

            console.log(
                "JD text length:",
                jdText?.length
            );

            // --------------------------------------------------
            // 5. Validate parsed text
            // --------------------------------------------------

            if (!resumeText || resumeText.trim().length === 0) {
                throw new Error(
                    "Resume PDF could not be parsed or is empty"
                );
            }

            if (!jdText || jdText.trim().length === 0) {
                throw new Error(
                    "Job Description PDF could not be parsed or is empty"
                );
            }

            // --------------------------------------------------
            // 6. Gemini Prompt
            // --------------------------------------------------

            const prompts = `
You are an **ATS Resume Optimization Expert**.

Your sole task is to optimize the provided resume strictly against
the given job description.

---

### CORE PRINCIPLE

The optimized resume MUST be a strict transformation of the
original resume based ONLY on the provided job description and
resume text.

Do NOT introduce, assume, or fabricate any skills, experiences,
metrics, or achievements not explicitly present in the resume.

This task is limited to resume analysis and rewriting only.

---

### STRICT RULES (ZERO HALLUCINATIONS)

1. No Invention or Exaggeration:

- If a keyword from the job description is missing in the resume,
  list it under Missing Keywords.

- Do NOT add missing keywords into the resume text.

- Rephrase only when the resume wording directly supports a
  synonymous keyword from the job description.

- Preserve every detail from the original resume.

---

2. ATS Match Score Justification:

Provide a realistic ATS Match Score strictly based on keyword
overlap.

Scoring Guide:

- 70–80% → Partial match, many missing keywords.
- 80–90% → Strong match with some gaps.
- 90%+ → Near-perfect match, very few missing terms.

Justify the score only by citing matched and missing keywords.

---

3. Action-Oriented Writing:

- Replace weak verbs with strong, action-oriented verbs.
- Use metrics only if already present in the resume.
- Do NOT create numbers.
- Any Buzzword Replacements and Key Improvements must be
  applied in the rewritten resume.

---

4. ATS-Friendly Formatting:

- Use plain text sections.
- Education
- Projects
- Skills
- Experience
- No emojis.
- No tables.
- No graphics.
- No commentary.

---

5. Structured Output:

Do NOT output LaTeX.

Do NOT output markdown.

Return ONLY a valid JSON object.

Parse names, contact information, experience entries,
education entries, projects, and skills accurately.

Ensure all arrays and objects are properly formatted.

---

### JOB DESCRIPTION

"""
${jdText}
"""

---

### USER'S RESUME

"""
${resumeText}
"""

---

### TEMPLATE

"""
${templateText}
"""

---

### OUTPUT FORMAT

Return ONLY a valid JSON object matching this structure:

{
    "atsScore": 0,
    "scoreJustification": "",
    "matchedKeywords": [],
    "missingKeywords": [],
    "buzzwordReplacements": {},
    "keyImprovements": [],
    "learningRoadmap": [],

    "structuredResume": {
        "personalInfo": {
            "fullName": "",
            "email": "",
            "phone": "",
            "linkedin": null,
            "github": null,
            "portfolio": null
        },

        "summary": "",

        "experience": [
            {
                "company": "",
                "role": "",
                "startDate": "",
                "endDate": "",
                "location": "",
                "description": []
            }
        ],

        "education": [
            {
                "institution": "",
                "degree": "",
                "startDate": "",
                "endDate": "",
                "location": "",
                "gpa": null
            }
        ],

        "skills": {
            "languages": [],
            "frameworks": [],
            "tools": []
        },

        "projects": [
            {
                "name": "",
                "technologies": [],
                "link": null,
                "description": []
            }
        ]
    }
}
`;

            // --------------------------------------------------
            // 7. Check Gemini API key
            // --------------------------------------------------

            console.log("\nChecking Gemini configuration...");

            console.log(
                "Gemini API key loaded:",
                !!process.env.GEMINI_API_KEY
            );

            if (!process.env.GEMINI_API_KEY) {
                throw new Error(
                    "GEMINI_API_KEY is not loaded"
                );
            }

            // --------------------------------------------------
            // 8. Call Gemini
            // --------------------------------------------------

            console.log("\nCalling Gemini...");

            const result = await main(prompts, true);

            console.log(
                "Gemini response received."
            );

            console.log(
                "Gemini response length:",
                result?.length
            );

            console.log(
                "Gemini response preview:",
                result?.substring(0, 500)
            );

            // --------------------------------------------------
            // 9. Parse Gemini JSON
            // --------------------------------------------------

            let parsedResult;

            try {
                parsedResult = JSON.parse(result);

                console.log(
                    "Gemini JSON parsed successfully."
                );

            } catch (error) {
                console.error(
                    "FAILED TO PARSE GEMINI JSON"
                );

                console.error(
                    "Raw Gemini response:",
                    result
                );

                console.error(
                    "JSON parse error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Gemini returned invalid JSON",
                    rawResponse: result,
                });
            }

            // --------------------------------------------------
            // 10. Validate Gemini response
            // --------------------------------------------------

            if (!parsedResult) {
                throw new Error(
                    "Gemini returned an empty result"
                );
            }

            console.log(
                "ATS Score:",
                parsedResult.atsScore
            );

            console.log(
                "Matched Keywords:",
                parsedResult.matchedKeywords
            );

            console.log(
                "Missing Keywords:",
                parsedResult.missingKeywords
            );

            // --------------------------------------------------
            // 11. Send response
            // --------------------------------------------------

            console.log(
                "========== RESUME SCORE SUCCESS ==========\n"
            );

            return res.status(200).json({
                data: parsedResult,
                message: "Resume processed successfully",
                success: true,
            });

        } catch (error) {

            // --------------------------------------------------
            // GLOBAL ERROR HANDLER
            // --------------------------------------------------

            console.error(
                "\n========== RESUME SCORE ERROR =========="
            );

            console.error("Error:", error);

            if (error instanceof Error) {
                console.error(
                    "Error message:",
                    error.message
                );

                console.error(
                    "Error stack:",
                    error.stack
                );
            }

            console.error(
                "========================================\n"
            );

            return res.status(500).json({
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal Server Error",

                success: false,
            });
        }
    }
);
