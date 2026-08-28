import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "../../common/models/serviceResponse.js";
import { MockInterviewRepository, mockInterviewRepository } from "./mockInterviewRepository.js";
import { IInterviewSession, IInterviewQuestion } from "./mockInterviewModel.js";
import { GoogleGenAI } from "@google/genai";
import { env } from "../../common/utils/env.js";

export class MockInterviewService {
  private repository: MockInterviewRepository;
  private ai: GoogleGenAI;

  constructor(repository: MockInterviewRepository) {
    this.repository = repository;
    this.ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }

  async startSession(userId: string, data: { resumeContent: string; jobDescription: string; targetRole: string; interviewType: string; difficulty: string }): Promise<ServiceResponse<IInterviewSession | null>> {
    try {
      const session = await this.repository.createSession({ userId, ...data, status: "InProgress" });
      return ServiceResponse.success("Interview session started", session, StatusCodes.CREATED);
    } catch (ex) {
      return ServiceResponse.failure("Failed to start session", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async generateNextQuestion(sessionId: string, userId: string): Promise<ServiceResponse<IInterviewQuestion | null>> {
    try {
      const session = await this.repository.findSessionById(sessionId, userId);
      if (!session) return ServiceResponse.failure("Session not found", null, StatusCodes.NOT_FOUND);
      
      const previousQuestions = await this.repository.findQuestionsBySession(sessionId);
      const questionNumber = previousQuestions.length + 1;

      const previousQA = previousQuestions.map(q => `Q: ${q.questionText}\nA: ${q.userAnswer || 'No answer'}`).join('\n\n');

      const prompt = `
You are an expert technical interviewer.
Target Role: ${session.targetRole}
Interview Type: ${session.interviewType}
Difficulty: ${session.difficulty}
User Resume: ${session.resumeContent}
Job Description: ${session.jobDescription}

Previous Questions and Answers:
${previousQA}

Based on the above, generate the NEXT interview question. 
It should be ONE concise question. 
Do not provide any preamble, just output the question text.
`;
      const response = await this.ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const questionText = response.text || "Could you tell me more about your experience?";
      
      const newQuestion = await this.repository.createQuestion({
        sessionId,
        questionText: questionText.trim(),
        questionNumber
      });

      return ServiceResponse.success("Next question generated", newQuestion);
    } catch (ex) {
      return ServiceResponse.failure("Failed to generate question", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async evaluateAnswer(sessionId: string, questionId: string, userId: string, answer: string): Promise<ServiceResponse<IInterviewQuestion | null>> {
    try {
      const session = await this.repository.findSessionById(sessionId, userId);
      if (!session) return ServiceResponse.failure("Session not found", null, StatusCodes.NOT_FOUND);

      const questions = await this.repository.findQuestionsBySession(sessionId);
      const targetQuestion = questions.find((q: any) => q._id.toString() === questionId);
      if (!targetQuestion) return ServiceResponse.failure("Question not found", null, StatusCodes.NOT_FOUND);

      const prompt = `
You are evaluating a candidate's answer to an interview question.
Target Role: ${session.targetRole}
Difficulty: ${session.difficulty}

Question: ${targetQuestion.questionText}
Candidate Answer: ${answer}

Evaluate the answer and return ONLY a valid JSON object (no markdown tags, no markdown code block formatting like \`\`\`json) with the following structure:
{
  "score": <number out of 10>,
  "technicalAccuracy": "<brief evaluation>",
  "communicationQuality": "<brief evaluation>",
  "relevance": "<brief evaluation>",
  "strengths": "<brief comment>",
  "areasForImprovement": "<brief comment>",
  "suggestedAnswer": "<an example of a great answer>"
}
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      let evaluationStr = response.text || "{}";
      evaluationStr = evaluationStr.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
      let evaluation;
      try {
        evaluation = JSON.parse(evaluationStr);
      } catch (e) {
        return ServiceResponse.failure("Failed to parse evaluation JSON", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      const updatedQuestion = await this.repository.updateQuestion(questionId, {
        userAnswer: answer,
        score: evaluation.score || 0,
        technicalAccuracy: evaluation.technicalAccuracy || "N/A",
        communicationQuality: evaluation.communicationQuality || "N/A",
        relevance: evaluation.relevance || "N/A",
        strengths: evaluation.strengths || "N/A",
        areasForImprovement: evaluation.areasForImprovement || "N/A",
        suggestedAnswer: evaluation.suggestedAnswer || "N/A",
      });

      return ServiceResponse.success("Answer evaluated", updatedQuestion);
    } catch (ex) {
      return ServiceResponse.failure("Failed to evaluate answer", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async completeSession(sessionId: string, userId: string): Promise<ServiceResponse<IInterviewSession | null>> {
    try {
      const session = await this.repository.findSessionById(sessionId, userId);
      if (!session) return ServiceResponse.failure("Session not found", null, StatusCodes.NOT_FOUND);
      
      const questions = await this.repository.findQuestionsBySession(sessionId);
      const totalScore = questions.reduce((acc, q) => acc + (q.score || 0), 0);
      const avgScore = questions.length > 0 ? totalScore / questions.length : 0;

      const evaluationsSummary = questions.map(q => `Q: ${q.questionText}\nA: ${q.userAnswer}\nScore: ${q.score}`).join('\n\n');

      const prompt = `
Based on the following interview session performance, provide a final summary.
Target Role: ${session.targetRole}
Average Score: ${avgScore}/10

Questions & Answers:
${evaluationsSummary}

Return ONLY a valid JSON object (no markdown tags like \`\`\`json) with the following structure:
{
  "strengths": ["<strength1>", "<strength2>"],
  "weaknesses": ["<weakness1>", "<weakness2>"],
  "improvementRecommendations": ["<rec1>", "<rec2>"],
  "suggestedPracticeTopics": ["<topic1>", "<topic2>"]
}
`;
      const response = await this.ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      let summaryStr = response.text || "{}";
      summaryStr = summaryStr.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
      let summary;
      try {
        summary = JSON.parse(summaryStr);
      } catch (e) {
        return ServiceResponse.failure("Failed to parse summary JSON", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      const updatedSession = await this.repository.updateSession(sessionId, {
        status: "Completed",
        overallScore: avgScore,
        strengths: summary.strengths || [],
        weaknesses: summary.weaknesses || [],
        improvementRecommendations: summary.improvementRecommendations || [],
        suggestedPracticeTopics: summary.suggestedPracticeTopics || []
      });

      return ServiceResponse.success("Session completed", updatedSession);
    } catch (ex) {
      return ServiceResponse.failure("Failed to complete session", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getSessionHistory(userId: string): Promise<ServiceResponse<IInterviewSession[] | null>> {
    try {
      const sessions = await this.repository.findAllSessionsByUser(userId);
      return ServiceResponse.success("Sessions retrieved", sessions);
    } catch (ex) {
      return ServiceResponse.failure("Failed to retrieve sessions", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  
  async getSessionResult(sessionId: string, userId: string): Promise<ServiceResponse<any | null>> {
      try {
        const session = await this.repository.findSessionById(sessionId, userId);
        if(!session) return ServiceResponse.failure("Not found", null, 404);
        const questions = await this.repository.findQuestionsBySession(sessionId);
        return ServiceResponse.success("Retrieved", { session, questions });
      } catch(ex) {
          return ServiceResponse.failure("Failed", null, 500);
      }
  }
}

export const mockInterviewService = new MockInterviewService(mockInterviewRepository);
