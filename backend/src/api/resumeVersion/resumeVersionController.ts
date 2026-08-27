import { Request, RequestHandler, Response } from "express";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { resumeVersionService } from "./resumeVersionService";

class ResumeVersionController {
  public getResumeVersions: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const serviceResponse = await resumeVersionService.findAllByUserId(userId);
    return handleServiceResponse(serviceResponse, res);
  };

  public getResumeVersion: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    const serviceResponse = await resumeVersionService.findByIdAndUserId(id, userId);
    return handleServiceResponse(serviceResponse, res);
  };

  public createResumeVersion: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const data = { ...req.body, userId };
    const serviceResponse = await resumeVersionService.create(data);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateResumeVersion: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    const data = req.body;
    const serviceResponse = await resumeVersionService.update(id, userId, data);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteResumeVersion: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    const serviceResponse = await resumeVersionService.delete(id, userId);
    return handleServiceResponse(serviceResponse, res);
  };

  public restoreResumeVersion: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    // For restoration, we could either return it so the frontend can load it into the editor,
    // or we could save it as a new draft. Let's just return it for now.
    const serviceResponse = await resumeVersionService.findByIdAndUserId(id, userId);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const resumeVersionController = new ResumeVersionController();
