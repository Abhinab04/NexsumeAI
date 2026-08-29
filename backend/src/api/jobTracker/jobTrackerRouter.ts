import express, { type Router } from "express";
import { requireAuth } from "../../common/middleware/requireAuth.js";
import { jobTrackerController } from "./jobTrackerController.js";

export const jobTrackerRouter: Router = express.Router();

jobTrackerRouter.use(requireAuth);

jobTrackerRouter.get("/", jobTrackerController.getJobApplications);
jobTrackerRouter.post("/", jobTrackerController.createJobApplication);
jobTrackerRouter.get("/:id", jobTrackerController.getJobApplication);
jobTrackerRouter.put("/:id", jobTrackerController.updateJobApplication);
jobTrackerRouter.delete("/:id", jobTrackerController.deleteJobApplication);
