import { Request, RequestHandler, Response } from "express";
import { handleServiceResponse } from "../../common/utils/httpHandlers.js";
import { skillRoadmapService } from "./skillRoadmapService.js";

class SkillRoadmapController {
  public generate: RequestHandler = async (req: Request, res: Response) => {
    console.log("[SkillRoadmapController] generate called");
    const userId = (req as any).auth?.userId;
    console.log("[SkillRoadmapController] userId:", userId);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const serviceResponse = await skillRoadmapService.generateRoadmap(userId, req.body);
    console.log("[SkillRoadmapController] generate response status:", serviceResponse.statusCode);
    return handleServiceResponse(serviceResponse, res);
  };

  public getRoadmaps: RequestHandler = async (req: Request, res: Response) => {
    console.log("[SkillRoadmapController] getRoadmaps called");
    const userId = (req as any).auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const serviceResponse = await skillRoadmapService.getRoadmaps(userId);
    return handleServiceResponse(serviceResponse, res);
  };

  public getRoadmapById: RequestHandler = async (req: Request, res: Response) => {
    console.log("[SkillRoadmapController] getRoadmapById called with id:", req.params.id);
    const userId = (req as any).auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params;
    const serviceResponse = await skillRoadmapService.getRoadmapById(id, userId);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateSkillStatus: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params;
    const { phaseIndex, skillIndex, status } = req.body;
    const serviceResponse = await skillRoadmapService.updateSkillStatus(id, userId, phaseIndex, skillIndex, status);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteRoadmap: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params;
    const serviceResponse = await skillRoadmapService.deleteRoadmap(id, userId);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const skillRoadmapController = new SkillRoadmapController();
