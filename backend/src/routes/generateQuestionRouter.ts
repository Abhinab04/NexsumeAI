import express, {
  Router,
  type Express,
  type Response,
  type Request,
} from "express";

import { upload } from "../common/middleware/multerMiddleware.js";
import main from "../common/utils/geminiModel.js";
import { pdf_Parsing } from "../common/utils/pdfParser.js";

export const generateQuestionRouter: Router =
  express.Router();

generateQuestionRouter.post(
  "/interviewQuestion",

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

  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      // =========================================
      // Validate uploaded files
      // =========================================

      if (
        !files ||
        !files.resume ||
        !files.resume[0] ||
        !files.job_Description ||
        !files.job_Description[0]
      ) {
        return res.status(400).json({
          error:
            "Both resume and JD need to be uploaded!!",
          success: false,
        });
      }

      // =========================================
      // Get Resume and JD
      // =========================================

      const resumeFile =
        files.resume[0];

      const jdFile =
        files.job_Description[0];

      // =========================================
      // Parse Resume
      // =========================================

      const resumeText =
        await pdf_Parsing(
          resumeFile.path,
        );

      // =========================================
      // Parse Job Description
      // =========================================

      const jdText =
        await pdf_Parsing(
          jdFile.path,
        );

      // =========================================
      // Prompt
      // =========================================

      const prompts = `
You are a Professional Interview Coach AI.

Your task is to generate a realistic, high-quality interview practice session strictly tailored for a candidate based on their resume and a job description (JD).

### Strict Rules:

1. Use only the information provided in the resume and JD.
2. Do not invent or assume any skills, experiences, projects, achievements, or qualifications.
3. Do not hallucinate or add any information not explicitly mentioned.

### Resume Analysis:

- Extract all relevant skills, tools, technologies, experiences, projects, and achievements.
- Focus on strengths and areas that can be realistically assessed in an interview.

### JD Analysis:

- Identify required skills, responsibilities, keywords, and competencies.
- Align all questions strictly with what the employer expects.

### Question Generation:

- Create behavioral questions strictly based on the candidate's experiences and projects.
- Create technical questions strictly related to skills, tools, and technologies mentioned in the JD and resume.
- Create scenario-based or problem-solving questions relevant to the job responsibilities.
- Ensure questions are challenging, realistic, and professional.
- Do NOT provide hints, guidance, or answers.

### Output Format (Mandatory):

Provide the questions in the following structured format:

### Interview Practice Session

**Behavioral Questions:**

1. Question: ...
2. Question: ...

**Technical Questions:**

1. Question: ...
2. Question: ...

**Scenario-Based / Problem-Solving Questions:**

1. Question: ...
2. Question: ...

### Quantity & Quality:

- Provide at least 5–10 high-quality questions covering behavioral, technical, and scenario-based types.
- Questions should simulate a real professional interview for the role described in the JD.

### Job Description

"""
${jdText}
"""

### User's Resume

"""
${resumeText}
"""
`;

      // =========================================
      // Gemini
      // =========================================

      const result =
        await main(prompts);

      // =========================================
      // Response
      // =========================================

      return res.status(200).json({
        data: result,
        message:
          "Resume processed successfully",
        success: true,
      });

    } catch (error) {

      console.error(
        "Interview question generation error:",
        error,
      );

      return res.status(500).json({
        message:
          "Internal Server Error",
        success: false,
      });
    }
  },
);
