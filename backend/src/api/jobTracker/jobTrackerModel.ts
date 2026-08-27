import mongoose, { Schema, Document } from "mongoose";

export interface IJobApplication extends Document {
  userId: string;
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
  jobLocation?: string;
  applicationUrl?: string;
  salaryRange?: string;
  applicationDate: Date;
  resumeVersionId?: string;
  coverLetterId?: string;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String },
    jobLocation: { type: String },
    applicationUrl: { type: String },
    salaryRange: { type: String },
    applicationDate: { type: Date, default: Date.now },
    resumeVersionId: { type: String },
    coverLetterId: { type: String },
    status: {
      type: String,
      enum: [
        "Wishlist",
        "Applied",
        "Screening",
        "Interview",
        "Technical Round",
        "HR Round",
        "Offer",
        "Rejected"
      ],
      default: "Wishlist"
    },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export const JobApplicationModel = mongoose.model<IJobApplication>(
  "JobApplication",
  JobApplicationSchema
);
