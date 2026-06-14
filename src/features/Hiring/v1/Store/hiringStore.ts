import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CompanyProfile,
  JobRole,
  Applicant,
  MailLog,
  AuditLog,
  ApplicantStatus,
  JobStatus,
  RecruiterNote,
} from "../Types/Hiring.types";

// ==========================================
// SEED DATA
// ==========================================

const initialCompanyProfile: CompanyProfile = {
  id: "comp-1",
  name: "NexGen Studios",
  slug: "nexgen-studios",
  logoUrl: "/logoWithoutText.png",
  bannerUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&h=400&q=80",
  about: "NexGen Studios is a product design and development collective crafting the future of web applications, developer interfaces, and enterprise tools. We value visual craft, systems thinking, and technical execution.",
  teamSize: "50-150 employees",
  industry: "Design & Technology",
  socialLinks: {
    github: "https://github.com/nexgen",
    discord: "https://discord.gg/nexgen",
    twitter: "https://twitter.com/nexgen",
    linkedin: "https://linkedin.com/company/nexgen",
  },
  benefits: [
    "Full health, dental, and vision insurance",
    "401(k) matching (4% fully vested)",
    "Remote-first culture with co-working stipends",
    "Annual learning & development allowance ($2,000)",
    "State-of-the-art hardware setup (M3 MacBook Pro, 4K monitors)",
    "30 days paid time off + national holidays",
  ],
  partnerships: ["React Foundation", "Design Leaders Coalition", "Vercel Enterprise"],
  media: [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&h=400&q=80",
    "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&h=400&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&h=400&q=80",
  ],
  hiringStatus: "active",
  seoTitle: "NexGen Studios | Careers & Open Positions",
  seoDescription: "Join NexGen Studios and design/develop the future of developer tooling and enterprise software systems.",
};

const initialJobs: JobRole[] = [
  {
    id: "JD-1029",
    title: "Senior Product Designer",
    department: "Product",
    hiringManager: "David Chen",
    community: "Global Design Excellence",
    slug: "senior-product-designer",
    description: "We are looking for a Senior Product Designer to lead the design of our enterprise-grade developer platforms and visual workspace tools. You will own the design lifecycle from initial research and system definitions through execution.",
    responsibilities: [
      "Design complex user flows, layout systems, and visual telemetry dashboards.",
      "Work closely with engineering to build reusable component design tokens.",
      "Gather user feedback and translate usage metrics into visual improvements.",
      "Drive alignment across engineering, product, and leadership groups."
    ],
    requirements: [
      "5+ years of experience in product design for enterprise or dev tools.",
      "Expert level in Figma design system organization.",
      "Strong portfolio demonstrating systems design and layout craft.",
      "Basic understanding of frontend engineering (React, Tailwind, HTML/CSS) is a big plus."
    ],
    benefits: [
      "Top-tier salary + equity package",
      "Flexible remote working options",
      "Comprehensive medical plan"
    ],
    skills: ["Figma", "Design Systems", "UI Design", "UX Research", "React", "Data Visualization"],
    tags: ["Product", "Design System", "Remote", "Senior"],
    employmentType: "full-time",
    workplaceType: "remote",
    salaryRange: "$140,000 - $185,000",
    openings: 1,
    timeline: "Immediate",
    expirationDate: "2026-08-30",
    visibility: "public",
    isFeatured: true,
    isSponsored: false,
    status: "active",
    postedDate: "2023-10-12",
    views: 1204,
    applicantsCount: 142,
  },
  {
    id: "JD-1104",
    title: "Lead Backend Engineer",
    department: "Engineering",
    hiringManager: "Sarah Jenkins",
    community: "Developer Communities",
    slug: "lead-backend-engineer",
    description: "Looking for a seasoned backend engineer to lead our database architecture, distributed queues, and server orchestration layers. You will scale our microservices to handle millions of real-time transactions.",
    responsibilities: [
      "Architect and build robust web socket connections and streaming pipelines.",
      "Develop low-latency APIs and integrate with third-party service gateways.",
      "Oversee Postgres indexing and Redis query caching architectures."
    ],
    requirements: [
      "8+ years experience in Node.js, Go, or Rust backend development.",
      "Expertise in PostgreSQL and database performance optimization.",
      "Experience deploying workloads on AWS or GCP using Kubernetes."
    ],
    benefits: [
      "Full premium health insurance",
      "Remote work stipend",
      "Equity shares"
    ],
    skills: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker", "Go"],
    tags: ["Engineering", "Backend", "Lead", "Go"],
    employmentType: "full-time",
    workplaceType: "hybrid",
    salaryRange: "$180,000 - $220,000",
    openings: 1,
    timeline: "2-4 Weeks",
    expirationDate: "2026-09-15",
    visibility: "public",
    isFeatured: false,
    isSponsored: false,
    status: "draft",
    postedDate: "Pending",
    views: 0,
    applicantsCount: 0,
  },
  {
    id: "JD-1085",
    title: "Account Executive",
    department: "Sales",
    hiringManager: "Alex Rivera",
    community: "Tech Partnerships Group",
    slug: "account-executive",
    description: "Join us to scale our developer platform sales. You will work with enterprise accounts, developer tool startups, and engineering groups to introduce NexGen workflow solutions.",
    responsibilities: [
      "Manage end-to-end sales cycle from prospecting to closing.",
      "Run technical platform demos for engineering managers and CTOs.",
      "Negotiate enterprise contracts and service SLA structures."
    ],
    requirements: [
      "3+ years experience selling SaaS or developer products to enterprise.",
      "Track record of hitting and exceeding quota targets.",
      "Excellent communication and presentation capabilities."
    ],
    benefits: [
      "Competitive base + uncapped commission structure",
      "Health & wellness allowance",
      "Annual team retreats"
    ],
    skills: ["SaaS Sales", "Lead Generation", "Contract Negotiation", "Enterprise Demos"],
    tags: ["Sales", "Business", "On-site"],
    employmentType: "full-time",
    workplaceType: "on-site",
    salaryRange: "$90,000 base + commission",
    openings: 2,
    timeline: "Immediate",
    expirationDate: "2026-07-20",
    visibility: "public",
    isFeatured: false,
    isSponsored: false,
    status: "paused",
    postedDate: "2023-11-02",
    views: 450,
    applicantsCount: 31,
  },
  {
    id: "JD-1122",
    title: "Data Scientist",
    department: "Engineering",
    hiringManager: "Sarah Jenkins",
    community: "Data Infrastructure Circle",
    slug: "data-scientist",
    description: "Seeking a Data Scientist to build predictive analytics models, hiring recommendation scores, and search indices for the CommDesk platform.",
    responsibilities: [
      "Design machine learning engines to score resumes against job requirement listings.",
      "Conduct behavior analysis on applicant pipelines to optimize recruitment velocity.",
      "Deploy recommendation systems for community hiring partnerships."
    ],
    requirements: [
      "MS or PhD in computer science, mathematics, statistics, or related field.",
      "3+ years experience writing production-ready Python or R pipelines.",
      "Proficient in SQL, Pandas, Scikit-Learn, PyTorch, or TensorFlow."
    ],
    benefits: [
      "Stock option grants",
      "Flexible working hours",
      "L&D budget"
    ],
    skills: ["Python", "Machine Learning", "PyTorch", "SQL", "Pandas", "NLP"],
    tags: ["Engineering", "Data Science", "Python"],
    employmentType: "full-time",
    workplaceType: "remote",
    salaryRange: "$130,000 - $170,000",
    openings: 1,
    timeline: "Immediate",
    expirationDate: "2026-10-10",
    visibility: "public",
    isFeatured: true,
    isSponsored: true,
    status: "active",
    postedDate: "2023-12-15",
    views: 2109,
    applicantsCount: 89,
  },
  {
    id: "JD-1001",
    title: "Senior UX Architect",
    department: "Product",
    hiringManager: "David Chen",
    community: "Global Design Excellence",
    slug: "senior-ux-architect",
    description: "Lead user research, structural workflows, information architecture frameworks, and accessibility compliance specifications across all platform features.",
    responsibilities: [
      "Draft comprehensive user journey blueprints, navigation maps, and taxonomy grids.",
      "Conduct usability tests with developer community profiles.",
      "Create high-fidelity wireframes and structural prototypes."
    ],
    requirements: [
      "6+ years experience in UX architecture, interaction design, or related.",
      "Deep understanding of WCAG accessibility standards.",
      "Strong skills in wireframing tools (Figma, Miro, Axure)."
    ],
    benefits: [
      "Competitive salary",
      "Home office setup stipend",
      "Unlimited PTO"
    ],
    skills: ["Information Architecture", "User Research", "Wireframing", "WCAG Accessibility", "Figma"],
    tags: ["Product", "UX", "Architecture", "Senior"],
    employmentType: "full-time",
    workplaceType: "remote",
    salaryRange: "$150,000 - $190,000",
    openings: 1,
    timeline: "Immediate",
    expirationDate: "2026-11-30",
    visibility: "public",
    isFeatured: true,
    isSponsored: true,
    status: "active",
    postedDate: "2023-10-10",
    views: 8402,
    applicantsCount: 1248,
  },
];

const initialApplicants: Applicant[] = [
  // Senior Product Designer applicants
  {
    id: "app-1",
    jobId: "JD-1029",
    name: "Marcus Holloway",
    email: "marcus.holloway@stripe-redesign.com",
    experience: "12 Years • Lead Designer",
    skills: ["React", "TypeScript", "Figma", "WebGL", "Strategy", "Systems"],
    resumeUrl: "/resumes/marcus_holloway.pdf",
    matchScore: 94,
    reviewer: "Sarah Jenkins",
    status: "technical",
    appliedDate: "2023-10-08",
    rating: {
      technical: 9,
      culture: 8,
      communication: 10,
      rating: "A+",
    },
    notes: [
      {
        id: "note-1",
        author: "Sarah Jenkins",
        avatar: "/avatars/sarah.jpg",
        content: "Extremely strong system design skills. His portfolio work on the Stripe redesign shows a deep understanding of complex data visualization. Might need some onboarding with WebGL, but very capable.",
        date: "2023-10-10",
        recommendation: "strong_hire",
      },
      {
        id: "note-2",
        author: "Alex Chen",
        avatar: "/avatars/alex.jpg",
        content: "Technical screening was solid. Answered React architectural questions with ease. Just concerned about his salary expectations being slightly above our current band for this role.",
        date: "2023-10-11",
        recommendation: "neutral",
      },
    ],
    history: [
      {
        id: "hist-1",
        action: "Applied",
        user: "Marcus Holloway",
        timestamp: "2023-10-08T09:30:00Z",
        details: "Candidate submitted application via Careers Page.",
      },
      {
        id: "hist-2",
        action: "Screening Passed",
        user: "Sarah Jenkins",
        timestamp: "2023-10-10T14:15:00Z",
        details: "Resume reviewed. Moved from Applied to Screening stage.",
      },
      {
        id: "hist-3",
        action: "Moved to Technical Round",
        user: "Sarah Jenkins",
        timestamp: "2023-10-11T16:00:00Z",
        details: "Scheduled initial technical interview for Oct 14.",
      },
    ],
  },
  // Senior UX Architect applicants
  {
    id: "app-2",
    jobId: "JD-1001",
    name: "Marcus Chen",
    email: "marcus.c@design.co",
    experience: "8 Years • Senior Designer",
    skills: ["Information Architecture", "Figma", "User Research", "Wireframing"],
    resumeUrl: "/resumes/marcus_chen.pdf",
    matchScore: 94,
    reviewer: "David Chen",
    status: "interview",
    appliedDate: "2023-10-12",
    rating: {
      technical: 9,
      culture: 9,
      communication: 9,
      rating: "A",
    },
    notes: [
      {
        id: "note-3",
        author: "David Chen",
        avatar: "/avatars/david.jpg",
        content: "Excellent UX thinker. Understood our navigation structure issues instantly. Very strong candidate.",
        date: "2023-10-13",
        recommendation: "strong_hire",
      },
    ],
    history: [
      {
        id: "hist-4",
        action: "Applied",
        user: "Marcus Chen",
        timestamp: "2023-10-12T10:00:00Z",
        details: "Candidate submitted application.",
      },
    ],
  },
  {
    id: "app-3",
    jobId: "JD-1001",
    name: "Elena Rodriguez",
    email: "e.rod@techcorp.io",
    experience: "5 Years • Mid-Senior",
    skills: ["Figma", "Interaction Design", "Usability Testing"],
    resumeUrl: "/resumes/elena_rodriguez.pdf",
    matchScore: 88,
    reviewer: "David Chen",
    status: "screening",
    appliedDate: "2023-10-13",
    rating: {
      technical: 8,
      culture: 8,
      communication: 8,
      rating: "B+",
    },
    notes: [],
    history: [],
  },
  {
    id: "app-4",
    jobId: "JD-1001",
    name: "James Wilson",
    email: "j.wilson@portfolio.me",
    experience: "10+ Years • Staff Designer",
    skills: ["Design Systems", "Figma", "Product Strategy", "Management"],
    resumeUrl: "/resumes/james_wilson.pdf",
    matchScore: 62,
    reviewer: "Alex Rivera",
    status: "applied",
    appliedDate: "2023-10-14",
    rating: {
      technical: 7,
      culture: 6,
      communication: 7,
      rating: "B-",
    },
    notes: [],
    history: [],
  },
  {
    id: "app-5",
    jobId: "JD-1001",
    name: "Sarah Jenkins",
    email: "sarah.j@consulting.com",
    experience: "3 Years • Junior Designer",
    skills: ["Figma", "Wireframing", "UI Design"],
    resumeUrl: "/resumes/sarah_jenkins.pdf",
    matchScore: 79,
    reviewer: "Alex Rivera",
    status: "rejected",
    appliedDate: "2023-10-15",
    rating: {
      technical: 6,
      culture: 8,
      communication: 8,
      rating: "C",
    },
    notes: [
      {
        id: "note-4",
        author: "Alex Rivera",
        avatar: "/avatars/alexr.jpg",
        content: "A bit too junior for what we are looking for right now. Very bright, would recommend for a junior associate role in the future.",
        date: "2023-10-16",
        recommendation: "no_hire",
      },
    ],
    history: [],
  },
];

const initialMails: MailLog[] = [
  {
    id: "mail-1",
    applicantId: "app-1",
    subject: "Interview Schedule: Senior Product Designer at NexGen Studios",
    body: "Hi Marcus,\n\nWe would love to schedule a technical screening with you to discuss your experience and walk through some of your design architectures. Let us know your availability over the next few days.\n\nBest,\nSarah Jenkins\nLead Technical Recruiter",
    sender: "Sarah Jenkins",
    sentAt: "2023-10-10T15:00:00Z",
    status: "sent",
  },
];

const initialAudits: AuditLog[] = [
  {
    id: "audit-1",
    jobId: "JD-1029",
    action: "Job Created",
    user: "David Chen",
    timestamp: "2023-10-12T09:00:00Z",
    details: "Job 'Senior Product Designer' initialized in Draft mode.",
  },
  {
    id: "audit-2",
    jobId: "JD-1029",
    action: "Job Published",
    user: "David Chen",
    timestamp: "2023-10-12T09:15:00Z",
    details: "Job status updated from Draft to Active. Visibility set to Public.",
  },
];

// ==========================================
// STORE INTERFACE
// ==========================================

export interface HiringState {
  companyProfile: CompanyProfile;
  jobs: JobRole[];
  applicants: Applicant[];
  mailLogs: MailLog[];
  auditLogs: AuditLog[];

  // Actions
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  addJob: (job: Omit<JobRole, "id" | "postedDate" | "views" | "applicantsCount">) => JobRole;
  updateJob: (id: string, patch: Partial<JobRole>) => void;
  deleteJob: (id: string) => void;
  applyToJob: (
    jobId: string,
    payload: {
      name: string;
      email: string;
      experience: string;
      skills: string[];
      resumeUrl: string;
    }
  ) => Applicant;
  updateApplicantStatus: (id: string, status: ApplicantStatus, user: string) => void;
  addRecruiterNote: (applicantId: string, note: Omit<RecruiterNote, "id" | "date">) => void;
  sendMail: (applicantId: string, mail: Omit<MailLog, "id" | "sentAt" | "status" | "applicantId"> & { status?: "sent" | "scheduled" | "draft"; scheduledFor?: string }) => void;
  moderateJob: (jobId: string, action: "approve" | "reject", user: string) => void;
  resetStore: () => void;
}

export const useHiringStore = create<HiringState>()(
  persist(
    (set) => ({
      companyProfile: initialCompanyProfile,
      jobs: initialJobs,
      applicants: initialApplicants,
      mailLogs: initialMails,
      auditLogs: initialAudits,

      updateCompanyProfile: (profile) =>
        set((state) => ({
          companyProfile: { ...state.companyProfile, ...profile },
        })),

      addJob: (jobPayload) => {
        const id = `JD-${Math.floor(1000 + Math.random() * 9000)}`;
        const postedDate = jobPayload.status === "active" ? new Date().toISOString().split("T")[0] : "Pending";
        const newJob: JobRole = {
          ...jobPayload,
          id,
          postedDate,
          views: 0,
          applicantsCount: 0,
        };

        set((state) => {
          // Log audit
          const newAudit: AuditLog = {
            id: `audit-${Date.now()}`,
            jobId: id,
            action: "Job Created",
            user: jobPayload.hiringManager || "Hiring Admin",
            timestamp: new Date().toISOString(),
            details: `Job role '${newJob.title}' created in status '${newJob.status}'.`,
          };
          return {
            jobs: [newJob, ...state.jobs],
            auditLogs: [newAudit, ...state.auditLogs],
          };
        });

        return newJob;
      },

      updateJob: (id, patch) =>
        set((state) => {
          const oldJob = state.jobs.find((j) => j.id === id);
          const updatedJobs = state.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j));

          // Log audit
          const changes: string[] = [];
          if (patch.status && oldJob && oldJob.status !== patch.status) {
            changes.push(`status updated from '${oldJob.status}' to '${patch.status}'`);
          }
          if (patch.title && oldJob && oldJob.title !== patch.title) {
            changes.push(`title updated from '${oldJob.title}' to '${patch.title}'`);
          }

          let updatedAudits = state.auditLogs;
          if (changes.length > 0) {
            const newAudit: AuditLog = {
              id: `audit-${Date.now()}`,
              jobId: id,
              action: "Job Updated",
              user: oldJob?.hiringManager || "Hiring Admin",
              timestamp: new Date().toISOString(),
              details: `Updates applied: ${changes.join(", ")}.`,
            };
            updatedAudits = [newAudit, ...state.auditLogs];
          }

          return {
            jobs: updatedJobs,
            auditLogs: updatedAudits,
          };
        }),

      deleteJob: (id) =>
        set((state) => ({
          jobs: state.jobs.filter((j) => j.id !== id),
          applicants: state.applicants.filter((a) => a.jobId !== id),
          auditLogs: state.auditLogs.filter((a) => a.jobId !== id),
        })),

      applyToJob: (jobId, payload) => {
        const id = `app-${Date.now()}`;
        const newApplicant: Applicant = {
          id,
          jobId,
          name: payload.name,
          email: payload.email,
          experience: payload.experience,
          skills: payload.skills,
          resumeUrl: payload.resumeUrl || "/resumes/generic.pdf",
          matchScore: Math.floor(65 + Math.random() * 30), // Random simulated score between 65 and 95
          reviewer: "Unassigned",
          status: "applied",
          appliedDate: new Date().toISOString().split("T")[0],
          notes: [],
          rating: {
            technical: 0,
            culture: 0,
            communication: 0,
            rating: "Pending",
          },
          history: [
            {
              id: `hist-${Date.now()}`,
              action: "Applied",
              user: payload.name,
              timestamp: new Date().toISOString(),
              details: "Candidate submitted application via Career Portal.",
            },
          ],
        };

        set((state) => {
          // Update applicant count for job
          const updatedJobs = state.jobs.map((j) =>
            j.id === jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j
          );
          return {
            applicants: [newApplicant, ...state.applicants],
            jobs: updatedJobs,
          };
        });

        return newApplicant;
      },

      updateApplicantStatus: (id, status, user) =>
        set((state) => {
          const applicant = state.applicants.find((a) => a.id === id);
          if (!applicant) return {};

          const updatedApplicants = state.applicants.map((a) => {
            if (a.id === id) {
              const newHistoryItem = {
                id: `hist-${Date.now()}`,
                action: `Moved to ${status}`,
                user,
                timestamp: new Date().toISOString(),
                details: `Applicant status updated from '${a.status}' to '${status}'.`,
              };
              return {
                ...a,
                status,
                history: [newHistoryItem, ...a.history],
              };
            }
            return a;
          });

          return { applicants: updatedApplicants };
        }),

      addRecruiterNote: (applicantId, note) =>
        set((state) => {
          const noteId = `note-${Date.now()}`;
          const newNote: RecruiterNote = {
            id: noteId,
            author: note.author,
            avatar: note.avatar || "/defaultProfile.png",
            content: note.content,
            date: new Date().toISOString().split("T")[0],
            recommendation: note.recommendation,
          };

          const updatedApplicants = state.applicants.map((a) => {
            if (a.id === applicantId) {
              // Recalculate evaluation rating based on recommendation
              const ratingMap: Record<string, string> = {
                strong_hire: "A+",
                hire: "A",
                neutral: "B",
                no_hire: "D",
              };
              const newRating = {
                technical: note.recommendation === "strong_hire" ? 9 : note.recommendation === "hire" ? 8 : 6,
                culture: note.recommendation === "strong_hire" ? 9 : note.recommendation === "hire" ? 8 : 6,
                communication: note.recommendation === "strong_hire" ? 10 : note.recommendation === "hire" ? 8 : 7,
                rating: ratingMap[note.recommendation] || "Pending",
              };

              const newHistoryItem = {
                id: `hist-${Date.now()}`,
                action: "Note Added",
                user: note.author,
                timestamp: new Date().toISOString(),
                details: `Added reviewer feedback recommendation: '${note.recommendation}'.`,
              };

              return {
                ...a,
                notes: [...a.notes, newNote],
                rating: newRating,
                history: [newHistoryItem, ...a.history],
              };
            }
            return a;
          });

          return { applicants: updatedApplicants };
        }),

      sendMail: (applicantId, mail) =>
        set((state) => {
          const id = `mail-${Date.now()}`;
          const newMail: MailLog = {
            id,
            applicantId,
            subject: mail.subject,
            body: mail.body,
            sender: mail.sender,
            sentAt: new Date().toISOString(),
            status: mail.status || "sent",
            scheduledFor: mail.scheduledFor,
          };

          const updatedApplicants = state.applicants.map((a) => {
            if (a.id === applicantId) {
              const newHistoryItem = {
                id: `hist-${Date.now()}`,
                action: mail.status === "scheduled" ? "Email Scheduled" : "Email Sent",
                user: mail.sender,
                timestamp: new Date().toISOString(),
                details: `Sent email with subject: '${mail.subject}'.`,
              };
              return {
                ...a,
                history: [newHistoryItem, ...a.history],
              };
            }
            return a;
          });

          return {
            mailLogs: [newMail, ...state.mailLogs],
            applicants: updatedApplicants,
          };
        }),

      moderateJob: (jobId, action, user) =>
        set((state) => {
          const targetStatus: JobStatus = action === "approve" ? "active" : "archived";
          const updatedJobs = state.jobs.map((j) =>
            j.id === jobId ? { ...j, status: targetStatus, postedDate: targetStatus === "active" ? new Date().toISOString().split("T")[0] : "Pending" } : j
          );

          // Log audit
          const newAudit: AuditLog = {
            id: `audit-${Date.now()}`,
            jobId,
            action: `Moderation ${action === "approve" ? "Approved" : "Rejected"}`,
            user,
            timestamp: new Date().toISOString(),
            details: `Community moderator marked job as ${targetStatus === "active" ? "Approved (Active)" : "Rejected (Archived)"}.`,
          };

          return {
            jobs: updatedJobs,
            auditLogs: [newAudit, ...state.auditLogs],
          };
        }),

      resetStore: () =>
        set({
          companyProfile: initialCompanyProfile,
          jobs: initialJobs,
          applicants: initialApplicants,
          mailLogs: initialMails,
          auditLogs: initialAudits,
        }),
    }),
    {
      name: "commdesk-hiring-storage",
    }
  )
);
