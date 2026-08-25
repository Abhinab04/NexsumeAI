import express, { type Router } from "express";

import { generateQuestionRouter } from "./generateQuestionRouter.js";
import { Resume_ScoreRouter } from "./resume_Score.js";
import { pdfGeneratorRouter } from "./pdfGenerator.js";

export const featureRouter: Router = express.Router();

featureRouter.use(
  "/resume_Score",
  Resume_ScoreRouter,
);

featureRouter.use(
  "/interviewQuestion",
  generateQuestionRouter,
);

featureRouter.use(
  "/resume",
  pdfGeneratorRouter,
);
