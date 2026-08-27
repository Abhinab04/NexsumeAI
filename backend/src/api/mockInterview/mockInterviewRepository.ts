import { IInterviewSession, IInterviewQuestion, InterviewSessionModel, InterviewQuestionModel } from "./mockInterviewModel";

export class MockInterviewRepository {
  async createSession(data: Partial<IInterviewSession>): Promise<IInterviewSession> {
    return InterviewSessionModel.create(data);
  }

  async findSessionById(sessionId: string, userId: string): Promise<IInterviewSession | null> {
    return InterviewSessionModel.findOne({ _id: sessionId, userId });
  }

  async updateSession(sessionId: string, data: Partial<IInterviewSession>): Promise<IInterviewSession | null> {
    return InterviewSessionModel.findByIdAndUpdate(sessionId, data, { new: true });
  }

  async findAllSessionsByUser(userId: string): Promise<IInterviewSession[]> {
    return InterviewSessionModel.find({ userId }).sort({ createdAt: -1 });
  }

  async createQuestion(data: Partial<IInterviewQuestion>): Promise<IInterviewQuestion> {
    return InterviewQuestionModel.create(data);
  }

  async findQuestionsBySession(sessionId: string): Promise<IInterviewQuestion[]> {
    return InterviewQuestionModel.find({ sessionId }).sort({ questionNumber: 1 });
  }

  async updateQuestion(questionId: string, data: Partial<IInterviewQuestion>): Promise<IInterviewQuestion | null> {
    return InterviewQuestionModel.findByIdAndUpdate(questionId, data, { new: true });
  }
}

export const mockInterviewRepository = new MockInterviewRepository();
