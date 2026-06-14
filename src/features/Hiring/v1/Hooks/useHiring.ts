import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useHiringStore } from "../Store/hiringStore";
import { ApplicantStatus } from "../Types/Hiring.types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// COMPANY PROFILE HOOKS
// ==========================================

export function useCompanyProfile() {
  const profile = useHiringStore((state) => state.companyProfile);
  return useQuery({
    queryKey: ["hiring-company-profile"],
    queryFn: async () => {
      await delay(300);
      return profile;
    },
  });
}

export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient();
  const updateProfile = useHiringStore((state) => state.updateCompanyProfile);

  return useMutation({
    mutationFn: async (patch: Parameters<typeof updateProfile>[0]) => {
      await delay(500);
      updateProfile(patch);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hiring-company-profile"] });
    },
  });
}

// ==========================================
// JOBS HOOKS
// ==========================================

export function useJobs(filters?: { search?: string; department?: string; status?: string }) {
  const jobs = useHiringStore((state) => state.jobs);

  return useQuery({
    queryKey: ["hiring-jobs", filters],
    queryFn: async () => {
      await delay(400);

      return jobs.filter((job) => {
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchDept = job.department.toLowerCase().includes(q);
          const matchManager = job.hiringManager.toLowerCase().includes(q);
          const matchId = job.id.toLowerCase().includes(q);
          if (!matchTitle && !matchDept && !matchManager && !matchId) return false;
        }

        if (filters?.department && filters.department !== "all") {
          if (job.department.toLowerCase() !== filters.department.toLowerCase()) return false;
        }

        if (filters?.status && filters.status !== "all") {
          if (job.status.toLowerCase() !== filters.status.toLowerCase()) return false;
        }

        return true;
      });
    },
  });
}

export function useJobDetail(id: string | undefined) {
  const jobs = useHiringStore((state) => state.jobs);

  return useQuery({
    queryKey: ["hiring-job", id],
    queryFn: async () => {
      await delay(300);
      const job = jobs.find((j) => j.id === id);
      if (!job) throw new Error("Job not found");
      return job;
    },
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  const addJob = useHiringStore((state) => state.addJob);

  return useMutation({
    mutationFn: async (payload: Parameters<typeof addJob>[0]) => {
      await delay(500);
      return addJob(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hiring-jobs"] });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  const updateJob = useHiringStore((state) => state.updateJob);

  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Parameters<typeof updateJob>[1] }) => {
      await delay(400);
      updateJob(id, patch);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["hiring-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["hiring-job", variables.id] });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  const deleteJob = useHiringStore((state) => state.deleteJob);

  return useMutation({
    mutationFn: async (id: string) => {
      await delay(400);
      deleteJob(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hiring-jobs"] });
    },
  });
}

// ==========================================
// APPLICANTS HOOKS
// ==========================================

export function useApplicants(jobId: string | undefined) {
  const applicants = useHiringStore((state) => state.applicants);

  return useQuery({
    queryKey: ["hiring-applicants", jobId],
    queryFn: async () => {
      await delay(400);
      return applicants.filter((a) => a.jobId === jobId);
    },
    enabled: !!jobId,
  });
}

export function useApplicantDetail(id: string | undefined) {
  const applicants = useHiringStore((state) => state.applicants);

  return useQuery({
    queryKey: ["hiring-applicant", id],
    queryFn: async () => {
      await delay(300);
      const app = applicants.find((a) => a.id === id);
      if (!app) throw new Error("Applicant not found");
      return app;
    },
    enabled: !!id,
  });
}

export function useApplyToJob() {
  const queryClient = useQueryClient();
  const applyToJob = useHiringStore((state) => state.applyToJob);

  return useMutation({
    mutationFn: async ({ jobId, payload }: { jobId: string; payload: Parameters<typeof applyToJob>[1] }) => {
      await delay(600);
      return applyToJob(jobId, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["hiring-applicants", variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ["hiring-jobs"] });
    },
  });
}

export function useUpdateApplicantStatus() {
  const queryClient = useQueryClient();
  const updateStatus = useHiringStore((state) => state.updateApplicantStatus);

  return useMutation({
    mutationFn: async ({ id, status, user }: { id: string; status: ApplicantStatus; user: string }) => {
      await delay(400);
      updateStatus(id, status, user);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["hiring-applicant", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["hiring-applicants"] });
    },
  });
}

export function useAddRecruiterNote() {
  const queryClient = useQueryClient();
  const addNote = useHiringStore((state) => state.addRecruiterNote);

  return useMutation({
    mutationFn: async ({ applicantId, note }: { applicantId: string; note: Parameters<typeof addNote>[1] }) => {
      await delay(300);
      addNote(applicantId, note);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["hiring-applicant", variables.applicantId] });
    },
  });
}

// ==========================================
// MAIL HOOKS
// ==========================================

export function useMailLogs(applicantId: string | undefined) {
  const mailLogs = useHiringStore((state) => state.mailLogs);

  return useQuery({
    queryKey: ["hiring-mail-logs", applicantId],
    queryFn: async () => {
      await delay(300);
      return mailLogs.filter((m) => m.applicantId === applicantId);
    },
    enabled: !!applicantId,
  });
}

export function useSendMail() {
  const queryClient = useQueryClient();
  const sendMail = useHiringStore((state) => state.sendMail);

  return useMutation({
    mutationFn: async ({ applicantId, mail }: { applicantId: string; mail: Parameters<typeof sendMail>[1] }) => {
      await delay(500);
      sendMail(applicantId, mail);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["hiring-mail-logs", variables.applicantId] });
      queryClient.invalidateQueries({ queryKey: ["hiring-applicant", variables.applicantId] });
    },
  });
}

// ==========================================
// AUDIT LOGS HOOKS
// ==========================================

export function useAuditLogs(jobId: string | undefined) {
  const auditLogs = useHiringStore((state) => state.auditLogs);

  return useQuery({
    queryKey: ["hiring-audit-logs", jobId],
    queryFn: async () => {
      await delay(300);
      return auditLogs.filter((a) => a.jobId === jobId);
    },
    enabled: !!jobId,
  });
}

// ==========================================
// MODERATION HOOKS
// ==========================================

export function useModerationJobs() {
  const jobs = useHiringStore((state) => state.jobs);

  return useQuery({
    queryKey: ["hiring-moderation-jobs"],
    queryFn: async () => {
      await delay(400);
      // Moderation queue has pending status jobs (e.g. draft, paused, or we can seed a specific pending job, or just filter jobs with 'draft' or 'paused')
      return jobs;
    },
  });
}

export function useModerateJob() {
  const queryClient = useQueryClient();
  const moderateJob = useHiringStore((state) => state.moderateJob);

  return useMutation({
    mutationFn: async ({ jobId, action, user }: { jobId: string; action: "approve" | "reject"; user: string }) => {
      await delay(500);
      moderateJob(jobId, action, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hiring-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["hiring-moderation-jobs"] });
    },
  });
}
