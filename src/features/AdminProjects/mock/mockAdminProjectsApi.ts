import { Project, ProjectAnalytics, ProjectJudge } from "../types/adminProjects.types";

const MOCK_JUDGES: ProjectJudge[] = [
  { id: 'j1', name: 'Elena Soros', role: 'Senior AI Researcher @ NeuralLabs', expertise: ['AI/ML', 'Neural Nets'], matchPercentage: 98 },
  { id: 'j2', name: 'Marcus Kovic', role: 'Lead Data Architect @ Prism', expertise: ['AI/ML', 'Data Scale'], matchPercentage: 92 },
  { id: 'j3', name: 'Jane Chen', role: 'Principal Engineer @ FutureLogic', expertise: ['AI/ML', 'Logistics'], matchPercentage: 85 },
  { id: 'j4', name: 'Alex Rivera', role: 'System Architect @ CommDesk', expertise: ['Web3', 'Security'], matchPercentage: 75 },
];

const generateProjects = (count: number): Project[] => {
  const names = ['NeuroSense AI', 'DecentralCart', 'GreenGrid Ops', 'MindFlow App', 'CipherVault', 'EcoTrack', 'QuantumPay', 'BioSync'];
  const teams = ['Synapse Labs', 'EtherDevs', 'EcoCoders', 'Neural Knights', 'Security Squad', 'Earth Keepers', 'Qubit Team', 'Health Pioneers'];
  const statuses: Project['status'][] = ['Approved', 'Pending', 'Rejected', 'Suspended'];
  const tracks = ['AI & ML', 'Web3', 'Sustainability', 'FinTech', 'HealthTech'];

  return Array.from({ length: count }, (_, i) => ({
    id: `proj-${i + 1}`,
    name: names[i % names.length] + (i > 7 ? ` ${Math.floor(i / 8)}` : ''),
    description: 'A revolutionary project built during the Global Hackathon 2026 focusing on solving real-world problems using cutting-edge technology.',
    teamName: teams[i % teams.length],
    eventName: 'Global Hackathon 2026',
    track: tracks[i % tracks.length],
    status: statuses[i % statuses.length],
    avgScore: parseFloat((Math.random() * 4 + 6).toFixed(1)), // 6.0 to 10.0
    assignedJudges: [MOCK_JUDGES[i % MOCK_JUDGES.length]],
    submissionDate: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
    lastUpdated: new Date().toISOString(),
    isFlagged: Math.random() > 0.9,
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    thumbnail: `https://picsum.photos/seed/${i}/400/225`,
  }));
};

const MOCK_PROJECTS = generateProjects(50);

export const mockAdminProjectsApi = {
  getProjects: async (filters: any, pagination: { page: number, pageSize: number }) => {
    await new Promise(r => setTimeout(r, 800)); // Simulate network lag
    
    let filtered = [...MOCK_PROJECTS];
    
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(s) || 
        p.teamName.toLowerCase().includes(s) ||
        p.track.toLowerCase().includes(s)
      );
    }
    
    if (filters.status && filters.status !== 'All') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters.track && filters.track !== 'All') {
      filtered = filtered.filter(p => p.track === filters.track);
    }

    const start = (pagination.page - 1) * pagination.pageSize;
    return {
      projects: filtered.slice(start, start + pagination.pageSize),
      totalCount: filtered.length,
    };
  },

  getAnalytics: async (): Promise<ProjectAnalytics> => {
    return {
      totalProjects: 1248,
      submittedProjects: 842,
      approvedProjects: 312,
      rejectedProjects: 42,
      pendingReviews: 156,
      averageScore: 8.4,
      flaggedProjects: 12,
      trends: {
        total: [40, 45, 52, 58, 65, 72, 80],
        submitted: [30, 32, 38, 42, 48, 52, 60],
        approved: [10, 12, 15, 18, 22, 25, 30],
        pending: [20, 20, 23, 24, 26, 27, 30],
        rejected: [2, 3, 2, 4, 3, 5, 4],
      }
    };
  },

  getJudges: async (): Promise<ProjectJudge[]> => {
    return MOCK_JUDGES;
  },

  bulkUpdateStatus: async (projectIds: string[], status: Project['status']) => {
    await new Promise(r => setTimeout(r, 500));
    return { success: true };
  },

  assignJudges: async (projectIds: string[], judgeIds: string[]) => {
    await new Promise(r => setTimeout(r, 500));
    return { success: true };
  }
};
