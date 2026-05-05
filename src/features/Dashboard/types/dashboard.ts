export type TaskStatus = "todo" | "in-progress" | "completed";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  deadline: string; 
}

export interface Summary {
  total: number;
  completed: number;
  upcoming: number;
  urgent: number;
  inProgress: number;
}

export interface User {
  name: string;
  role: "Admin" | "Member";
}

export type ActivityType = "completed" | "comment" | "assigned";

export interface ActivityItem {
  id: number;
  text: string;
  time: string;
  type: ActivityType; 
}
export interface Performance {
  completionRate: number;
  avgTime: string;
  streak: number;
  weeklyCompleted: number;
}

export interface Certificate {
  title: string;
  issuer: string;
}

export interface Achievement {
  title: string;
  icon: "trophy" | "flame" | "star" | "award";
}

export interface AchievementsData {
  badges: Achievement[];
  certificates: Certificate[];
}

export interface Issues {
  open: number;
  resolved: number;
}

export interface Rewards {
  points: number;
  nextReward: number;

  stipend?: number;  
  rewardsEarned?: number; 
  history?: { title: string; points: number }[]; 
}

export interface CommunityStats {
  totalMembers: number;
  activeMembers: number;
  rank?: number;
}

export interface CalendarEvent {
  date: string; 
  time: string;
  title: string;
  type?: "task" | "event";
}

export interface CalendarData {
  events: CalendarEvent[];
}

export interface DashboardData {
   user: User;
  summary: Summary;
  tasks: Task[];
  activity: ActivityItem[];
  performance: Performance;
  achievements: AchievementsData;
  issues: Issues;
  community: CommunityStats;
  calendar: CalendarData;
  rewards: Rewards;
}