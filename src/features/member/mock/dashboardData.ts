import { DashboardData } from "../../Dashboard/Member/dashboard";

export const dashboardData: DashboardData = {
  user: {
    name: "Arjun Mehta",
    role: "Member",
  },

  summary: {
    total: 32,
    completed: 18,
    upcoming: 6,
    urgent: 3,
    inProgress: 5,
  },

  tasks: [
    { id: 1, title: "Build Landing Page", status: "in-progress", deadline: "2026-05-07" },
    { id: 2, title: "Fix Auth Bug", status: "todo", deadline: "2026-05-05" },
    { id: 3, title: "Design System", status: "completed", deadline: "2026-05-01" },
  ],

  activity: [
    {
      id: 1,
      text: "Task completed: API Integration",
      time: "2h ago",
      type: "completed",
    },
    {
      id: 2,
      text: "Rahul commented on your task",
      time: "4h ago",
      type: "comment",
    },
    {
      id: 3,
      text: "New task assigned: UI Revamp",
      time: "6h ago",
      type: "assigned",
    },
  ],

  performance: {
    completionRate: 82,
    avgTime: "3.2h",
    streak: 7,
    weeklyCompleted: 12,
  },

  achievements: {
    badges: [
      { title: "Top Performer", icon: "trophy" },
      { title: "Star Member", icon: "star" },
    ],

    certificates: [
      { title: "React Workshop", issuer: "CommDesk" },
      { title: "Hackathon Finalist", issuer: "DevFest 2026" },
    ],
  },

  issues: {
    open: 2,
    resolved: 5,
  },

  community: {
    totalMembers: 240,
    activeMembers: 88,
    rank: 12,
  },

  calendar: {
    events: [
      {
        date: "2026-05-03",
        time: "10:00 AM",
        title: "Team Standup",
        type: "event",
      },
      {
        date: "2026-05-04",
        time: "02:00 PM",
        title: "Design Review",
        type: "event",
      },
      {
        date: "2026-05-05",
        time: "06:00 PM",
        title: "Submit Project Task",
        type: "task",
      },
    ],
  },

  rewards: {
    points: 2450,
    nextReward: 3000,
    stipend: 5000,
    rewardsEarned: 3,
    history: [
      { title: "Amazon Voucher", points: 500 },
      { title: "Coffee Coupon", points: 250 },
    ],
  },
};
