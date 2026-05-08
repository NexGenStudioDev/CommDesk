import { mockAdminProjectsApi } from "../mock/mockAdminProjectsApi";
import { PaginationParams, ProjectFilters, ProjectStatus } from "../types/adminProjects.types";

export const adminProjectsService = {
  fetchProjects: async (filters: ProjectFilters, pagination: PaginationParams) => {
    return await mockAdminProjectsApi.getProjects(filters, pagination);
  },

  fetchAnalytics: async () => {
    return await mockAdminProjectsApi.getAnalytics();
  },

  fetchJudges: async () => {
    return await mockAdminProjectsApi.getJudges();
  },

  updateProjectStatus: async (projectId: string, status: ProjectStatus) => {
    return await mockAdminProjectsApi.bulkUpdateStatus([projectId], status);
  },

  bulkUpdateStatus: async (projectIds: string[], status: ProjectStatus) => {
    return await mockAdminProjectsApi.bulkUpdateStatus(projectIds, status);
  },

  assignJudges: async (projectIds: string[], judgeIds: string[]) => {
    return await mockAdminProjectsApi.assignJudges(projectIds, judgeIds);
  }
};
