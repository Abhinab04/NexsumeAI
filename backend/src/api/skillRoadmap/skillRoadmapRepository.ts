import { ISkillRoadmap, SkillRoadmapModel } from "./skillRoadmapModel";

export class SkillRoadmapRepository {
  async create(data: Partial<ISkillRoadmap>): Promise<ISkillRoadmap> {
    return SkillRoadmapModel.create(data);
  }

  async findByUserId(userId: string): Promise<ISkillRoadmap[]> {
    return SkillRoadmapModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<ISkillRoadmap | null> {
    return SkillRoadmapModel.findOne({ _id: id, userId });
  }

  async updateSkillStatus(
    roadmapId: string,
    userId: string,
    phaseIndex: number,
    skillIndex: number,
    status: string
  ): Promise<ISkillRoadmap | null> {
    const updatePath = `roadmapPhases.${phaseIndex}.skills.${skillIndex}.status`;
    return SkillRoadmapModel.findOneAndUpdate(
      { _id: roadmapId, userId },
      { $set: { [updatePath]: status } },
      { new: true }
    );
  }

  async delete(id: string, userId: string): Promise<ISkillRoadmap | null> {
    return SkillRoadmapModel.findOneAndDelete({ _id: id, userId });
  }
}

export const skillRoadmapRepository = new SkillRoadmapRepository();
