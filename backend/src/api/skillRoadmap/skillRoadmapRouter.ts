import express, { type Router } from "express";
import { requireAuth } from "../../common/middleware/requireAuth.js";
import { skillRoadmapController } from "./skillRoadmapController.js";

export const skillRoadmapRouter: Router = express.Router();

skillRoadmapRouter.use(requireAuth());

skillRoadmapRouter.post("/generate", skillRoadmapController.generate);
skillRoadmapRouter.get("/", skillRoadmapController.getRoadmaps);
skillRoadmapRouter.get("/:id", skillRoadmapController.getRoadmapById);
skillRoadmapRouter.put("/:id/status", skillRoadmapController.updateSkillStatus);
skillRoadmapRouter.delete("/:id", skillRoadmapController.deleteRoadmap);
