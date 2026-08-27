import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "../../common/models/serviceResponse.js";
import { ResumeVersionRepository, resumeVersionRepository } from "./resumeVersionRepository.js";
import { IResumeVersion } from "./resumeVersionModel.js";

export class ResumeVersionService {
  private resumeVersionRepository: ResumeVersionRepository;

  constructor(repository: ResumeVersionRepository) {
    this.resumeVersionRepository = repository;
  }

  async findAllByUserId(userId: string): Promise<ServiceResponse<IResumeVersion[] | null>> {
    try {
      const versions = await this.resumeVersionRepository.findAllByUserId(userId);
      return ServiceResponse.success<IResumeVersion[]>("Resume versions found", versions);
    } catch (ex) {
      const errorMessage = `Error finding resume versions: ${(ex as Error).message}`;
      return ServiceResponse.failure("Error finding resume versions", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findByIdAndUserId(id: string, userId: string): Promise<ServiceResponse<IResumeVersion | null>> {
    try {
      const version = await this.resumeVersionRepository.findByIdAndUserId(id, userId);
      if (!version) {
        return ServiceResponse.failure("Resume version not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<IResumeVersion>("Resume version found", version);
    } catch (ex) {
      const errorMessage = `Error finding resume version: ${(ex as Error).message}`;
      return ServiceResponse.failure("Error finding resume version", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async create(data: Partial<IResumeVersion>): Promise<ServiceResponse<IResumeVersion | null>> {
    try {
      const newVersion = await this.resumeVersionRepository.create(data);
      return ServiceResponse.success<IResumeVersion>("Resume version created", newVersion, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating resume version: ${(ex as Error).message}`;
      return ServiceResponse.failure("Error creating resume version", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, userId: string, data: Partial<IResumeVersion>): Promise<ServiceResponse<IResumeVersion | null>> {
    try {
      const updatedVersion = await this.resumeVersionRepository.update(id, userId, data);
      if (!updatedVersion) {
        return ServiceResponse.failure("Resume version not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<IResumeVersion>("Resume version updated", updatedVersion);
    } catch (ex) {
      const errorMessage = `Error updating resume version: ${(ex as Error).message}`;
      return ServiceResponse.failure("Error updating resume version", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string, userId: string): Promise<ServiceResponse<IResumeVersion | null>> {
    try {
      const deletedVersion = await this.resumeVersionRepository.delete(id, userId);
      if (!deletedVersion) {
        return ServiceResponse.failure("Resume version not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<IResumeVersion>("Resume version deleted", deletedVersion);
    } catch (ex) {
      const errorMessage = `Error deleting resume version: ${(ex as Error).message}`;
      return ServiceResponse.failure("Error deleting resume version", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const resumeVersionService = new ResumeVersionService(resumeVersionRepository);
