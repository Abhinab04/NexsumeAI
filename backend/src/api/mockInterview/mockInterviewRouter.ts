import express, { type Router } from "express";
import { requireAuth } from "@clerk/express";
import { mockInterviewController } from "./mockInterviewController";

export const mockInterviewRouter: Router = express.Router();

mockInterviewRouter.use(requireAuth());

mockInterviewRouter.post("/start", mockInterviewController.startSession);
mockInterviewRouter.get("/history", mockInterviewController.getHistory);
mockInterviewRouter.get("/:sessionId/next-question", mockInterviewController.generateNextQuestion);
mockInterviewRouter.post("/:sessionId/answer", mockInterviewController.evaluateAnswer);
mockInterviewRouter.post("/:sessionId/complete", mockInterviewController.completeSession);
mockInterviewRouter.get("/:sessionId/result", mockInterviewController.getSessionResult);
