import mongoose, { Schema, Document } from "mongoose";

export interface IResumeVersion extends Document {
  userId: string;
  versionName: string;
  resumeContent: string;
  atsScore?: number;
  targetRole?: string;
  jobDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeVersionSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    versionName: { type: String, required: true },
    resumeContent: { type: String, required: true },
    atsScore: { type: Number },
    targetRole: { type: String },
    jobDescription: { type: String },
  },
  {
    timestamps: true,
  }
);

export const ResumeVersionModel = mongoose.model<IResumeVersion>(
  "ResumeVersion",
  ResumeVersionSchema
);
