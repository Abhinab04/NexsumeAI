import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "../../common/models/serviceResponse.js";
import { CoverLetterRepository, coverLetterRepository } from "./coverLetterRepository.js";
import { ICoverLetter } from "./coverLetterModel.js";
import { GoogleGenAI } from "@google/genai";
import { env } from "../../common/utils/env.js";

export class CoverLetterService {
  private coverLetterRepository: CoverLetterRepository;
  private ai: GoogleGenAI;

  constructor(repository: CoverLetterRepository) {
    this.coverLetterRepository = repository;
    this.ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }

  async generate(data: {
    userId: string;
    resumeContent: string;
    jobTitle: string;
    companyName: string;
    jobDescription: string;
    tone: string;
  }): Promise<ServiceResponse<ICoverLetter | null>> {
    try {
      const prompt = `
You are an expert career coach and cover letter writer. 
Write a personalized cover letter based ONLY on the following details. 
Do NOT hallucinate skills or experiences not present in the user's resume.

User's Resume:
${data.resumeContent}

Target Job Title: ${data.jobTitle}
Target Company: ${data.companyName}
Job Description:
${data.jobDescription}

Tone: ${data.tone}

Output ONLY the text of the cover letter, nothing else. Make it professional and compelling.
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const generatedText = response.text;
      if (!generatedText) {
         return ServiceResponse.failure("Gemini returned empty text", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      const coverLetter = await this.coverLetterRepository.create({
        userId: data.userId,
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        jobDescription: data.jobDescription,
        content: generatedText,
        tone: data.tone,
      });

      return ServiceResponse.success<ICoverLetter>("Cover letter generated", coverLetter, StatusCodes.CREATED);
    } catch (ex) {
      console.error(ex);
      return ServiceResponse.failure("Error generating cover letter", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllByUserId(userId: string): Promise<ServiceResponse<ICoverLetter[] | null>> {
    try {
      const letters = await this.coverLetterRepository.findAllByUserId(userId);
      return ServiceResponse.success<ICoverLetter[]>("Cover letters found", letters);
    } catch (ex) {
      return ServiceResponse.failure("Error finding cover letters", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findByIdAndUserId(id: string, userId: string): Promise<ServiceResponse<ICoverLetter | null>> {
    try {
      const letter = await this.coverLetterRepository.findByIdAndUserId(id, userId);
      if (!letter) {
        return ServiceResponse.failure("Cover letter not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<ICoverLetter>("Cover letter found", letter);
    } catch (ex) {
      return ServiceResponse.failure("Error finding cover letter", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, userId: string, data: Partial<ICoverLetter>): Promise<ServiceResponse<ICoverLetter | null>> {
    try {
      const updated = await this.coverLetterRepository.update(id, userId, data);
      if (!updated) {
        return ServiceResponse.failure("Cover letter not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<ICoverLetter>("Cover letter updated", updated);
    } catch (ex) {
      return ServiceResponse.failure("Error updating cover letter", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string, userId: string): Promise<ServiceResponse<ICoverLetter | null>> {
    try {
      const deleted = await this.coverLetterRepository.delete(id, userId);
      if (!deleted) {
        return ServiceResponse.failure("Cover letter not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<ICoverLetter>("Cover letter deleted", deleted);
    } catch (ex) {
      return ServiceResponse.failure("Error deleting cover letter", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const coverLetterService = new CoverLetterService(coverLetterRepository);
