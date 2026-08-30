import { Request, RequestHandler, Response } from "express";
import { getAuth } from "@clerk/express";
import { handleServiceResponse } from "../../common/utils/httpHandlers.js";
import { coverLetterService } from "./coverLetterService.js";

class CoverLetterController {
  public generate: RequestHandler = async (req: Request, res: Response) => {
    console.log("[CoverLetterController] generate called");
    const { userId } = getAuth(req);
    console.log("[CoverLetterController] userId:", userId);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { resumeContent, jobTitle, companyName, jobDescription, tone } = req.body;
    
    if (!resumeContent || !jobTitle || !companyName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const data = { userId, resumeContent, jobTitle, companyName, jobDescription, tone };
    const serviceResponse = await coverLetterService.generate(data);
    return handleServiceResponse(serviceResponse, res);
  };

  public getCoverLetters: RequestHandler = async (req: Request, res: Response) => {
    console.log("[CoverLetterController] getCoverLetters called");
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const serviceResponse = await coverLetterService.findAllByUserId(userId);
    return handleServiceResponse(serviceResponse, res);
  };

  public getCoverLetter: RequestHandler = async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    const serviceResponse = await coverLetterService.findByIdAndUserId(id, userId);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateCoverLetter: RequestHandler = async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    const data = req.body;
    const serviceResponse = await coverLetterService.update(id, userId, data);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteCoverLetter: RequestHandler = async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    const serviceResponse = await coverLetterService.delete(id, userId);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const coverLetterController = new CoverLetterController();
