import express, { type Router } from "express";

import { generateQuestionRouter } from "./generateQuestionRouter.js";
import { Resume_ScoreRouter } from "./resume_Score.js";
import { pdfGeneratorRouter } from "./pdfGenerator.js";
import { contactRouter } from "./contactRouter.js";
import { coverLetterRouter } from "../api/coverLetter/coverLetterRouter.js";
import { mockInterviewRouter } from "../api/mockInterview/mockInterviewRouter.js";
import { skillRoadmapRouter } from "../api/skillRoadmap/skillRoadmapRouter.js";

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

featureRouter.use(
  "/",
  contactRouter,
);

featureRouter.use("/cover-letter", coverLetterRouter);
featureRouter.use("/mock-interview", mockInterviewRouter);
featureRouter.use("/skill-roadmap", skillRoadmapRouter);
