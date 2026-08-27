import { Request, RequestHandler, Response } from "express";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { jobTrackerService } from "./jobTrackerService";

class JobTrackerController {
  public getJobApplications: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const serviceResponse = await jobTrackerService.findAllByUserId(userId);
    return handleServiceResponse(serviceResponse, res);
  };

  public getJobApplication: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params;
    const serviceResponse = await jobTrackerService.findByIdAndUserId(id, userId);
    return handleServiceResponse(serviceResponse, res);
  };

  public createJobApplication: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const data = { ...req.body, userId };
    const serviceResponse = await jobTrackerService.create(data);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateJobApplication: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params;
    const data = req.body;
    const serviceResponse = await jobTrackerService.update(id, userId, data);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteJobApplication: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params;
    const serviceResponse = await jobTrackerService.delete(id, userId);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const jobTrackerController = new JobTrackerController();
