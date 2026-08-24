import express, { type Router } from "express";
import { generateQuestionRouter } from "./generateQuestionRouter";
import { Resume_ScoreRouter } from "./resume_Score";
import { pdfGeneratorRouter } from "./pdfGenerator";

export const featureRouter: Router = express.Router();

featureRouter.use("/resume_Score",Resume_ScoreRouter)
featureRouter.use("/interviewQuestion",generateQuestionRouter)
featureRouter.use("/resume", pdfGeneratorRouter)