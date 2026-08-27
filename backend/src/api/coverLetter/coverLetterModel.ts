import mongoose, { Schema, Document } from "mongoose";

export interface ICoverLetter extends Document {
  userId: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  content: string;
  tone: string;
  createdAt: Date;
  updatedAt: Date;
}

const CoverLetterSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    jobDescription: { type: String },
    content: { type: String, required: true },
    tone: { type: String, default: "Professional" },
  },
  {
    timestamps: true,
  }
);

export const CoverLetterModel = mongoose.model<ICoverLetter>(
  "CoverLetter",
  CoverLetterSchema
);
