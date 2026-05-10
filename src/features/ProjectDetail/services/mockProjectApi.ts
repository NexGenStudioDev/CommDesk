import { Project, ProjectStatus, Score } from "../types";

// In-memory store for simulation
let mockProjects: Record<string, Project> = {
  "proj-123": {
    id: "proj-123",
    title: "EcoTrack AI",
    status: "Draft",
    eventName: "Global Sustainability Hackathon 2026",
    eventType: "Virtual",
    description: "An AI-powered application that tracks personal carbon footprint by analyzing daily receipts and travel logs. It uses machine learning to suggest eco-friendly alternatives and gamifies the experience with a community leaderboard.",
    techStack: ["React", "TypeScript", "Node.js", "Python", "TensorFlow", "PostgreSQL"],
    githubUrl: "https://github.com/example/ecotrack",
    liveDemoUrl: "https://ecotrack-demo.vercel.app",
    teamName: "Green Innovators",
    isSolo: false,
    members: [
      { id: "user-1", name: "Alice Smith", role: "Frontend Lead", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
      { id: "user-2", name: "Bob Jones", role: "AI Engineer", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d" }
    ],
    submittedAt: undefined,
    lastUpdatedAt: new Date().toISOString(),
    version: 1,
    attachments: [
      { id: "att-1", name: "Architecture Diagram", url: "#", type: "image" },
      { id: "att-2", name: "Pitch Deck", url: "#", type: "document" }
    ],
    scores: [],
    timeline: [
      {
        id: "ev-1",
        type: "created",
        title: "Project Created",
        description: "Initial draft of the project was created.",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        actorName: "Alice Smith"
      }
    ],
    participantId: "user-1", // mock user ID representing a participant
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const projectApi = {
  getProject: async (id: string): Promise<Project> => {
    await delay(800);
    const project = mockProjects[id];
    if (!project) throw new Error("Project not found");
    return { ...project };
  },

  submitProject: async (id: string, actorName: string): Promise<Project> => {
    await delay(1000);
    const project = mockProjects[id];
    if (!project) throw new Error("Project not found");
    if (project.status !== "Draft") throw new Error("Project is already submitted");

    project.status = "Submitted";
    project.submittedAt = new Date().toISOString();
    project.lastUpdatedAt = new Date().toISOString();
    project.timeline.push({
      id: `ev-${Date.now()}`,
      type: "submitted",
      title: "Project Submitted",
      description: "Project was officially submitted for review.",
      timestamp: new Date().toISOString(),
      actorName
    });

    mockProjects[id] = { ...project };
    return { ...project };
  },

  scoreProject: async (
    id: string, 
    scoreData: Omit<Score, "id" | "projectId" | "totalScore" | "submittedAt">
  ): Promise<Project> => {
    await delay(1000);
    const project = mockProjects[id];
    if (!project) throw new Error("Project not found");
    
    // Auto calculate total score
    const totalScore = scoreData.innovation + scoreData.technical + scoreData.design + scoreData.impact;
    
    const newScore: Score = {
      ...scoreData,
      id: `score-${Date.now()}`,
      projectId: id,
      totalScore,
      submittedAt: new Date().toISOString()
    };

    project.scores.push(newScore);
    // If we transition state based on scoring, we could do it here
    if (project.status === "Submitted") {
      project.status = "Under Review";
    }

    project.timeline.push({
      id: `ev-${Date.now()}`,
      type: "scored",
      title: "Project Scored",
      description: `A judge has evaluated this project. Score: ${totalScore}/40`,
      timestamp: new Date().toISOString(),
      actorName: scoreData.judgeName
    });

    mockProjects[id] = { ...project };
    return { ...project };
  },

  moderateProject: async (id: string, action: "approve" | "reject", actorName: string): Promise<Project> => {
    await delay(1000);
    const project = mockProjects[id];
    if (!project) throw new Error("Project not found");

    project.status = action === "approve" ? "Approved" : "Rejected";
    project.timeline.push({
      id: `ev-${Date.now()}`,
      type: action === "approve" ? "approved" : "rejected",
      title: `Project ${action === "approve" ? "Approved" : "Rejected"}`,
      description: `Moderator decision applied.`,
      timestamp: new Date().toISOString(),
      actorName
    });

    mockProjects[id] = { ...project };
    return { ...project };
  },

  deleteProject: async (id: string): Promise<void> => {
    await delay(1000);
    if (!mockProjects[id]) throw new Error("Project not found");
    delete mockProjects[id];
  }
};
