import { Request, RequestHandler, Response } from "express";
import { handleServiceResponse } from "../../common/utils/httpHandlers.js";
import { mockInterviewService } from "./mockInterviewService.js";

class MockInterviewController {
  public startSession: RequestHandler = async (req: Request, res: Response) => {
    console.log("[MockInterviewController] startSession called");
    const userId = (req as any).auth?.userId;
    console.log("[MockInterviewController] userId:", userId);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const serviceResponse = await mockInterviewService.startSession(userId, req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public generateNextQuestion: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { sessionId } = req.params;
    const serviceResponse = await mockInterviewService.generateNextQuestion(sessionId, userId);
    return handleServiceResponse(serviceResponse, res);
  };

  public evaluateAnswer: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { sessionId } = req.params;
    const { questionId, answer } = req.body;
    const serviceResponse = await mockInterviewService.evaluateAnswer(sessionId, questionId, userId, answer);
    return handleServiceResponse(serviceResponse, res);
  };

  public completeSession: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { sessionId } = req.params;
    const serviceResponse = await mockInterviewService.completeSession(sessionId, userId);
    return handleServiceResponse(serviceResponse, res);
  };

  public getHistory: RequestHandler = async (req: Request, res: Response) => {
    console.log("[MockInterviewController] getHistory called");
    const userId = (req as any).auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const serviceResponse = await mockInterviewService.getSessionHistory(userId);
    return handleServiceResponse(serviceResponse, res);
  };
  
  public getSessionResult: RequestHandler = async (req: Request, res: Response) => {
      const userId = (req as any).auth?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const { sessionId } = req.params;
      const serviceResponse = await mockInterviewService.getSessionResult(sessionId, userId);
      return handleServiceResponse(serviceResponse, res);
  }
}

export const mockInterviewController = new MockInterviewController();
