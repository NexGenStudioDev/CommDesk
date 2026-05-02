export type Achievement = {
  id: number;
  title: string;
  type: "badge" | "certificate";
  description: string;
  issuedBy?: string;
  date?: string;
};

export const mockAchievements: Achievement[] = [
  {
    id: 1,
    title: "Top Performer",
    type: "badge",
    description: "Completed most tasks this month",
  },
  {
    id: 2,
    title: "Active Member",
    type: "badge",
    description: "Logged in daily for 7 days",
  },
  {
    id: 3,
    title: "Hackathon 2026",
    type: "certificate",
    description: "Participated in annual hackathon",
    issuedBy: "CommDesk",
    date: "2026-05-01",
  },
];