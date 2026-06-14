export interface SocialLinks {
  github?: string;
  discord?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  instagram?: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  logoUrl: string;
  bannerUrl: string;
  about: string;
  socialLinks: SocialLinks;
  teamSize: string;
  industry: string;
  benefits: string[];
  partnerships: string[];
  media: string[];
  hiringStatus: "active" | "paused" | "closed";
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
}

export type JobStatus = "active" | "draft" | "paused" | "closed" | "archived";
export type WorkplaceType = "remote" | "hybrid" | "on-site";
export type EmploymentType = "full-time" | "part-time" | "contract" | "internship";
export type JobVisibility = "public" | "private" | "community-only";

export interface JobRole {
  id: string;
  title: string;
  department: string;
  hiringManager: string;
  community: string;
  slug: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  tags: string[];
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  salaryRange: string;
  openings: number;
  timeline: string;
  expirationDate: string;
  visibility: JobVisibility;
  isFeatured: boolean;
  isSponsored: boolean;
  status: JobStatus;
  postedDate: string;
  views: number;
  applicantsCount: number;
}

export type ApplicantStatus =
  | "applied"
  | "screening"
  | "technical"
  | "interview"
  | "hr"
  | "offer"
  | "hired"
  | "rejected";

export interface RecruiterNote {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  recommendation: "strong_hire" | "hire" | "neutral" | "no_hire";
}

export interface EvaluationMatrix {
  technical: number;
  culture: number;
  communication: number;
  rating: string; // "A+", "A", "B", etc.
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

export interface Applicant {
  id: string;
  jobId: string;
  name: string;
  email: string;
  experience: string;
  skills: string[];
  resumeUrl: string;
  matchScore: number;
  reviewer: string;
  status: ApplicantStatus;
  appliedDate: string;
  notes: RecruiterNote[];
  rating: EvaluationMatrix;
  history: ActivityLog[];
}

export interface MailLog {
  id: string;
  applicantId: string;
  subject: string;
  body: string;
  sender: string;
  sentAt: string;
  status: "sent" | "scheduled" | "draft";
  scheduledFor?: string;
}

export interface AuditLog {
  id: string;
  jobId: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}
