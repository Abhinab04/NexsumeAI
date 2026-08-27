import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { JobTrackerRepository } from "./jobTrackerRepository";
import { IJobApplication } from "./jobTrackerModel";

export class JobTrackerService {
  private jobTrackerRepository: JobTrackerRepository;

  constructor(repository: JobTrackerRepository) {
    this.jobTrackerRepository = repository;
  }

  async findAllByUserId(userId: string): Promise<ServiceResponse<IJobApplication[] | null>> {
    try {
      const apps = await this.jobTrackerRepository.findAllByUserId(userId);
      return ServiceResponse.success<IJobApplication[]>("Job applications found", apps);
    } catch (ex) {
      return ServiceResponse.failure("Error finding job applications", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findByIdAndUserId(id: string, userId: string): Promise<ServiceResponse<IJobApplication | null>> {
    try {
      const app = await this.jobTrackerRepository.findByIdAndUserId(id, userId);
      if (!app) {
        return ServiceResponse.failure("Job application not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<IJobApplication>("Job application found", app);
    } catch (ex) {
      return ServiceResponse.failure("Error finding job application", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async create(data: Partial<IJobApplication>): Promise<ServiceResponse<IJobApplication | null>> {
    try {
      const newApp = await this.jobTrackerRepository.create(data);
      return ServiceResponse.success<IJobApplication>("Job application created", newApp, StatusCodes.CREATED);
    } catch (ex) {
      return ServiceResponse.failure("Error creating job application", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, userId: string, data: Partial<IJobApplication>): Promise<ServiceResponse<IJobApplication | null>> {
    try {
      const updatedApp = await this.jobTrackerRepository.update(id, userId, data);
      if (!updatedApp) {
        return ServiceResponse.failure("Job application not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<IJobApplication>("Job application updated", updatedApp);
    } catch (ex) {
      return ServiceResponse.failure("Error updating job application", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string, userId: string): Promise<ServiceResponse<IJobApplication | null>> {
    try {
      const deletedApp = await this.jobTrackerRepository.delete(id, userId);
      if (!deletedApp) {
        return ServiceResponse.failure("Job application not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<IJobApplication>("Job application deleted", deletedApp);
    } catch (ex) {
      return ServiceResponse.failure("Error deleting job application", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const jobTrackerService = new JobTrackerService(require("./jobTrackerRepository").jobTrackerRepository);
