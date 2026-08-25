import express, {
  type Express,
  type Response,
  type Request,
  type Router,
} from "express";

import { upload } from "../common/middleware/multerMiddleware.js";
import main from "../common/utils/geminiModel.js";
import { pdf_Parsing } from "../common/utils/pdfParser.js";

export const Resume_ScoreRouter: Router =
  express.Router();

Resume_ScoreRouter.post(
  "/resume_score",

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
    // keep the rest of your existing code here
  },
);
