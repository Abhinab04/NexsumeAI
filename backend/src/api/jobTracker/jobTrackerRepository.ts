import { IJobApplication, JobApplicationModel } from "./jobTrackerModel.js";

export class JobTrackerRepository {
  async findAllByUserId(userId: string): Promise<IJobApplication[]> {
    return JobApplicationModel.find({ userId }).sort({ applicationDate: -1 });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<IJobApplication | null> {
    return JobApplicationModel.findOne({ _id: id, userId });
  }

  async create(data: Partial<IJobApplication>): Promise<IJobApplication> {
    return JobApplicationModel.create(data);
  }

  async update(id: string, userId: string, data: Partial<IJobApplication>): Promise<IJobApplication | null> {
    return JobApplicationModel.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
    });
  }

  async delete(id: string, userId: string): Promise<IJobApplication | null> {
    return JobApplicationModel.findOneAndDelete({ _id: id, userId });
  }
}

export const jobTrackerRepository = new JobTrackerRepository();
