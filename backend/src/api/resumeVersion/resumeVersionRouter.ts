import express, { type Router } from "express";
import { requireAuth } from "../../common/middleware/requireAuth.js";
import { resumeVersionController } from "./resumeVersionController.js";

export const resumeVersionRouter: Router = express.Router();

resumeVersionRouter.use(requireAuth());

resumeVersionRouter.get("/", resumeVersionController.getResumeVersions);
resumeVersionRouter.post("/", resumeVersionController.createResumeVersion);
resumeVersionRouter.get("/:id", resumeVersionController.getResumeVersion);
resumeVersionRouter.put("/:id", resumeVersionController.updateResumeVersion);
resumeVersionRouter.delete("/:id", resumeVersionController.deleteResumeVersion);
resumeVersionRouter.post("/:id/restore", resumeVersionController.restoreResumeVersion);
