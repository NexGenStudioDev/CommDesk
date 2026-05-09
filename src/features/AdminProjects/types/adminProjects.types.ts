export type ProjectStatus = 'Pending' | 'Approved' | 'Rejected' | 'Suspended' | 'Draft';

export interface ProjectJudge {
  id: string;
  name: string;
  avatar?: string;
  expertise: string[];
  matchPercentage?: number;
  role: string;
}

export interface ProjectAnalytics {
  totalProjects: number;
  submittedProjects: number;
  approvedProjects: number;
  rejectedProjects: number;
  pendingReviews: number;
  averageScore: number;
  flaggedProjects: number;
  trends: {
    total: number[];
    submitted: number[];
    approved: number[];
    pending: number[];
    rejected: number[];
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  teamName: string;
  eventName: string;
  track: string;
  status: ProjectStatus;
  avgScore: number;
  assignedJudges: ProjectJudge[];
  submissionDate: string;
  lastUpdated: string;
  isFlagged: boolean;
  techStack: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
}

export interface ProjectFilters {
  search: string;
  status: ProjectStatus | 'All';
  event: string | 'All';
  track: string | 'All';
  scoreRange: [number, number];
  judgeAssignment: 'All' | 'Assigned' | 'Unassigned';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface AdminProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  analytics: ProjectAnalytics | null;
}
