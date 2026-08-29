import express, { type Router } from "express";
import { requireAuth } from "../../common/middleware/requireAuth.js";
import { coverLetterController } from "./coverLetterController.js";

export const coverLetterRouter: Router = express.Router();

coverLetterRouter.use(requireAuth());

coverLetterRouter.post("/generate", coverLetterController.generate);
coverLetterRouter.get("/", coverLetterController.getCoverLetters);
coverLetterRouter.get("/:id", coverLetterController.getCoverLetter);
coverLetterRouter.put("/:id", coverLetterController.updateCoverLetter);
coverLetterRouter.delete("/:id", coverLetterController.deleteCoverLetter);
