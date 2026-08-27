import { ICoverLetter, CoverLetterModel } from "./coverLetterModel";

export class CoverLetterRepository {
  async findAllByUserId(userId: string): Promise<ICoverLetter[]> {
    return CoverLetterModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<ICoverLetter | null> {
    return CoverLetterModel.findOne({ _id: id, userId });
  }

  async create(data: Partial<ICoverLetter>): Promise<ICoverLetter> {
    return CoverLetterModel.create(data);
  }

  async update(id: string, userId: string, data: Partial<ICoverLetter>): Promise<ICoverLetter | null> {
    return CoverLetterModel.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
    });
  }

  async delete(id: string, userId: string): Promise<ICoverLetter | null> {
    return CoverLetterModel.findOneAndDelete({ _id: id, userId });
  }
}

export const coverLetterRepository = new CoverLetterRepository();
