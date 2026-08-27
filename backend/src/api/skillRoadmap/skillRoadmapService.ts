import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { SkillRoadmapRepository } from "./skillRoadmapRepository";
import { ISkillRoadmap } from "./skillRoadmapModel";
import { GoogleGenAI } from "@google/genai";
import { env } from "@/common/utils/env";

export class SkillRoadmapService {
  private repository: SkillRoadmapRepository;
  private ai: GoogleGenAI;

  constructor(repository: SkillRoadmapRepository) {
    this.repository = repository;
    this.ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }

  async generateRoadmap(userId: string, data: { resumeContent: string; jobDescription: string; targetRole: string }): Promise<ServiceResponse<ISkillRoadmap | null>> {
    try {
      const prompt = `
Analyze the candidate's resume against the provided Job Description for the target role: ${data.targetRole}.
1. Extract current skills from resume.
2. Extract required skills from Job Description.
3. Identify matching skills and missing/weak skills.
4. Generate a personalized learning roadmap.

Output ONLY a valid JSON object (no markdown tags, no markdown code block formatting) with the following structure exactly:
{
  "targetRole": "${data.targetRole}",
  "jobReadinessScore": <number 0-100>,
  "skillMatchPercentage": <number 0-100>,
  "missingSkillsCount": <number>,
  "strongestSkills": ["skill1", "skill2"],
  "roadmapPhases": [
    {
      "phaseName": "Phase 1: Immediate Skills",
      "skills": [
        {
          "skillName": "<name>",
          "importance": "<short reason why it is important>",
          "priority": "High" | "Medium" | "Low",
          "difficulty": "Beginner" | "Intermediate" | "Advanced",
          "status": "Not Started",
          "suggestedProject": "<brief project idea>"
        }
      ]
    }
  ]
}
Ensure there are at least 2 phases if there are missing skills (e.g. Immediate, Core, Advanced, Projects).
Resume: ${data.resumeContent}
JD: ${data.jobDescription}
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let jsonStr = response.text || "{}";
      jsonStr = jsonStr.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
      let parsedData;
      try {
        parsedData = JSON.parse(jsonStr);
      } catch (e) {
        return ServiceResponse.failure("Failed to parse Gemini output", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      parsedData.userId = userId;
      
      const roadmap = await this.repository.create(parsedData);
      return ServiceResponse.success("Roadmap generated", roadmap, StatusCodes.CREATED);
    } catch (ex) {
      return ServiceResponse.failure("Error generating roadmap", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getRoadmaps(userId: string): Promise<ServiceResponse<ISkillRoadmap[] | null>> {
    try {
      const roadmaps = await this.repository.findByUserId(userId);
      return ServiceResponse.success("Roadmaps retrieved", roadmaps);
    } catch (ex) {
      return ServiceResponse.failure("Error retrieving roadmaps", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getRoadmapById(id: string, userId: string): Promise<ServiceResponse<ISkillRoadmap | null>> {
    try {
      const roadmap = await this.repository.findByIdAndUserId(id, userId);
      if (!roadmap) return ServiceResponse.failure("Roadmap not found", null, StatusCodes.NOT_FOUND);
      return ServiceResponse.success("Roadmap found", roadmap);
    } catch (ex) {
      return ServiceResponse.failure("Error finding roadmap", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async updateSkillStatus(roadmapId: string, userId: string, phaseIndex: number, skillIndex: number, status: string): Promise<ServiceResponse<ISkillRoadmap | null>> {
    try {
      const updated = await this.repository.updateSkillStatus(roadmapId, userId, phaseIndex, skillIndex, status);
      if (!updated) return ServiceResponse.failure("Roadmap not found", null, StatusCodes.NOT_FOUND);
      return ServiceResponse.success("Skill status updated", updated);
    } catch (ex) {
      return ServiceResponse.failure("Error updating status", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  
  async deleteRoadmap(id: string, userId: string): Promise<ServiceResponse<ISkillRoadmap | null>> {
      try {
          const deleted = await this.repository.delete(id, userId);
          if(!deleted) return ServiceResponse.failure("Not found", null, 404);
          return ServiceResponse.success("Deleted", deleted);
      } catch(ex) {
          return ServiceResponse.failure("Error", null, 500);
      }
  }
}

export const skillRoadmapService = new SkillRoadmapService(require("./skillRoadmapRepository").skillRoadmapRepository);
