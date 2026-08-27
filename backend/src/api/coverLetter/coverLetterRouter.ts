import express, { type Router } from "express";
import { requireAuth } from "@clerk/express";
import { coverLetterController } from "./coverLetterController";

export const coverLetterRouter: Router = express.Router();

coverLetterRouter.use(requireAuth());

coverLetterRouter.post("/generate", coverLetterController.generate);
coverLetterRouter.get("/", coverLetterController.getCoverLetters);
coverLetterRouter.get("/:id", coverLetterController.getCoverLetter);
coverLetterRouter.put("/:id", coverLetterController.updateCoverLetter);
coverLetterRouter.delete("/:id", coverLetterController.deleteCoverLetter);
