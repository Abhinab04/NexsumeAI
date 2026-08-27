import mongoose, { Schema, Document } from "mongoose";

export interface ISkillRoadmap extends Document {
  userId: string;
  targetRole: string;
  jobReadinessScore: number;
  skillMatchPercentage: number;
  missingSkillsCount: number;
  strongestSkills: string[];
  roadmapPhases: {
    phaseName: string;
    skills: {
      skillName: string;
      importance: string;
      priority: "High" | "Medium" | "Low";
      difficulty: "Beginner" | "Intermediate" | "Advanced";
      status: "Not Started" | "Learning" | "Completed";
      suggestedProject?: string;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const SkillRoadmapSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    targetRole: { type: String, required: true },
    jobReadinessScore: { type: Number, required: true },
    skillMatchPercentage: { type: Number, required: true },
    missingSkillsCount: { type: Number, required: true },
    strongestSkills: [{ type: String }],
    roadmapPhases: [
      {
        phaseName: { type: String, required: true },
        skills: [
          {
            skillName: { type: String, required: true },
            importance: { type: String },
            priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
            difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
            status: { type: String, enum: ["Not Started", "Learning", "Completed"], default: "Not Started" },
            suggestedProject: { type: String },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const SkillRoadmapModel = mongoose.model<ISkillRoadmap>(
  "SkillRoadmap",
  SkillRoadmapSchema
);
