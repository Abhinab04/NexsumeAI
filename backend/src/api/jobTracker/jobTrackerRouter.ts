import express, { type Router } from "express";
import { requireAuth } from "@clerk/express";
import { jobTrackerController } from "./jobTrackerController";

export const jobTrackerRouter: Router = express.Router();

jobTrackerRouter.use(requireAuth());

jobTrackerRouter.get("/", jobTrackerController.getJobApplications);
jobTrackerRouter.post("/", jobTrackerController.createJobApplication);
jobTrackerRouter.get("/:id", jobTrackerController.getJobApplication);
jobTrackerRouter.put("/:id", jobTrackerController.updateJobApplication);
jobTrackerRouter.delete("/:id", jobTrackerController.deleteJobApplication);
