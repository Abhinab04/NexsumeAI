import { IResumeVersion, ResumeVersionModel } from "./resumeVersionModel.js";

export class ResumeVersionRepository {
  async findAllByUserId(userId: string): Promise<IResumeVersion[]> {
    return ResumeVersionModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<IResumeVersion | null> {
    return ResumeVersionModel.findOne({ _id: id, userId });
  }

  async create(data: Partial<IResumeVersion>): Promise<IResumeVersion> {
    return ResumeVersionModel.create(data);
  }

  async update(id: string, userId: string, data: Partial<IResumeVersion>): Promise<IResumeVersion | null> {
    return ResumeVersionModel.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
    });
  }

  async delete(id: string, userId: string): Promise<IResumeVersion | null> {
    return ResumeVersionModel.findOneAndDelete({ _id: id, userId });
  }
}

export const resumeVersionRepository = new ResumeVersionRepository();
