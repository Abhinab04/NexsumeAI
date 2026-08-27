import express, { type Router } from "express";
import { requireAuth } from "@clerk/express";
import { resumeVersionController } from "./resumeVersionController";

export const resumeVersionRouter: Router = express.Router();

resumeVersionRouter.use(requireAuth());

resumeVersionRouter.get("/", resumeVersionController.getResumeVersions);
resumeVersionRouter.post("/", resumeVersionController.createResumeVersion);
resumeVersionRouter.get("/:id", resumeVersionController.getResumeVersion);
resumeVersionRouter.put("/:id", resumeVersionController.updateResumeVersion);
resumeVersionRouter.delete("/:id", resumeVersionController.deleteResumeVersion);
resumeVersionRouter.post("/:id/restore", resumeVersionController.restoreResumeVersion);
