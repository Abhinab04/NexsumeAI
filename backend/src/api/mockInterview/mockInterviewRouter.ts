import express, { type Router } from "express";
import { requireAuth } from "../../common/middleware/requireAuth.js";
import { mockInterviewController } from "./mockInterviewController.js";

export const mockInterviewRouter: Router = express.Router();

mockInterviewRouter.use(requireAuth);

mockInterviewRouter.post("/start", mockInterviewController.startSession);
mockInterviewRouter.get("/history", mockInterviewController.getHistory);
mockInterviewRouter.get("/:sessionId/next-question", mockInterviewController.generateNextQuestion);
mockInterviewRouter.post("/:sessionId/answer", mockInterviewController.evaluateAnswer);
mockInterviewRouter.post("/:sessionId/complete", mockInterviewController.completeSession);
mockInterviewRouter.get("/:sessionId/result", mockInterviewController.getSessionResult);
