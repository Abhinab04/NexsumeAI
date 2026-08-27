import mongoose, { Schema, Document } from "mongoose";

export interface IInterviewSession extends Document {
  userId: string;
  resumeContent: string;
  jobDescription: string;
  targetRole: string;
  interviewType: string;
  difficulty: string;
  status: "InProgress" | "Completed";
  overallScore?: number;
  strengths?: string[];
  weaknesses?: string[];
  improvementRecommendations?: string[];
  suggestedPracticeTopics?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSessionSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    resumeContent: { type: String, required: true },
    jobDescription: { type: String, required: true },
    targetRole: { type: String, required: true },
    interviewType: { type: String, required: true },
    difficulty: { type: String, required: true },
    status: { type: String, enum: ["InProgress", "Completed"], default: "InProgress" },
    overallScore: { type: Number },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    improvementRecommendations: [{ type: String }],
    suggestedPracticeTopics: [{ type: String }],
  },
  { timestamps: true }
);

export const InterviewSessionModel = mongoose.model<IInterviewSession>(
  "InterviewSession",
  InterviewSessionSchema
);

export interface IInterviewQuestion extends Document {
  sessionId: string;
  questionText: string;
  questionNumber: number;
  userAnswer?: string;
  score?: number;
  technicalAccuracy?: string;
  communicationQuality?: string;
  relevance?: string;
  strengths?: string;
  areasForImprovement?: string;
  suggestedAnswer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewQuestionSchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true },
    questionText: { type: String, required: true },
    questionNumber: { type: Number, required: true },
    userAnswer: { type: String },
    score: { type: Number },
    technicalAccuracy: { type: String },
    communicationQuality: { type: String },
    relevance: { type: String },
    strengths: { type: String },
    areasForImprovement: { type: String },
    suggestedAnswer: { type: String },
  },
  { timestamps: true }
);

export const InterviewQuestionModel = mongoose.model<IInterviewQuestion>(
  "InterviewQuestion",
  InterviewQuestionSchema
);
