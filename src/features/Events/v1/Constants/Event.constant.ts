export const EVENT_TYPE = [
  "Workshop",
  "Hands-on Workshop",
  "Seminar",
  "Conference",
  "Webinar",
  "Meetup",
  "Hackathon",
  "Code Lab",
  "Bootcamp",
  "Panel Discussion",
  "Tech Talk",
  "AMA Session",
  "Networking Event",
  "Startup Pitch",
  "Product Launch",
  "Demo Day",
  "Training Session",
  "Certification Program",
  "Competition",
  "Challenge",
  "Community Meetup",
  "Open Source Sprint",
  "Volunteer Event",
  "Charity Event",
  "Festival",
  "Concert",
  "Sports Event",
  "Trade Show",
];

export const EVENT_CATEGORY = [
  "Technology",
  "Artificial Intelligence",
  "Machine Learning",
  "Web Development",
  "Mobile Development",
  "Cloud Computing",
  "Cybersecurity",
  "Data Science",
  "Open Source",
  "DevOps",
  "Startup",
  "Entrepreneurship",
  "Business",
  "Product Management",
  "Education",
  "Career Development",
  "Leadership",
  "Design / UI-UX",
  "Marketing",
  "Finance",
  "Health",
  "Social Impact",
  "Community",
  "Entertainment",
  "Music",
  "Art",
  "Sports",
];

export type CategoryAccent = {
  badge: string;
  stripe: string;
  logoRing: string;
};

export const DEFAULT_ACCENT: CategoryAccent = {
  badge: "border-blue-200 bg-blue-50 text-blue-700",
  stripe: "from-blue-500 to-cyan-500",
  logoRing: "ring-blue-100",
};

export const PARTNERS_AND_SPONSORS_TIER = [
  "title",
  "presenting",
  "co-presenting",
  "diamond",
  "platinum",
  "premier",
  "elite",
  "gold",
  "silver",
  "bronze",
  "knowledge",
  "education",
  "learning",
  "media",
  "press",
  "broadcast",
  "support",
  "associate",
  "contributor",
  "community",
  "ecosystem",
  "partner",
  "official partner",
];

export const CATEGORY_ACCENT_RULES: Array<{ keywords: string[]; accent: CategoryAccent }> = [
  {
    keywords: ["title", "presenting", "co-presenting", "diamond"],
    accent: {
      badge: "border-rose-200 bg-rose-50 text-rose-700",
      stripe: "from-rose-500 to-pink-500",
      logoRing: "ring-rose-100",
    },
  },
  {
    keywords: ["platinum", "premier", "elite"],
    accent: {
      badge: "border-violet-200 bg-violet-50 text-violet-700",
      stripe: "from-violet-500 to-fuchsia-500",
      logoRing: "ring-violet-100",
    },
  },
  {
    keywords: ["gold"],
    accent: {
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      stripe: "from-amber-500 to-orange-500",
      logoRing: "ring-amber-100",
    },
  },
  {
    keywords: ["silver"],
    accent: {
      badge: "border-slate-200 bg-slate-50 text-slate-700",
      stripe: "from-slate-500 to-gray-500",
      logoRing: "ring-slate-100",
    },
  },
  {
    keywords: ["bronze"],
    accent: {
      badge: "border-orange-200 bg-orange-50 text-orange-700",
      stripe: "from-orange-500 to-amber-600",
      logoRing: "ring-orange-100",
    },
  },
  {
    keywords: ["knowledge", "education", "learning"],
    accent: {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      stripe: "from-emerald-500 to-teal-500",
      logoRing: "ring-emerald-100",
    },
  },
  {
    keywords: ["media", "press", "broadcast"],
    accent: {
      badge: "border-cyan-200 bg-cyan-50 text-cyan-700",
      stripe: "from-cyan-500 to-sky-500",
      logoRing: "ring-cyan-100",
    },
  },
  {
    keywords: ["support", "associate", "contributor"],
    accent: {
      badge: "border-indigo-200 bg-indigo-50 text-indigo-700",
      stripe: "from-indigo-500 to-blue-600",
      logoRing: "ring-indigo-100",
    },
  },
  {
    keywords: ["community", "ecosystem", "partner"],
    accent: {
      badge: "border-sky-200 bg-sky-50 text-sky-700",
      stripe: "from-sky-500 to-blue-500",
      logoRing: "ring-sky-100",
    },
  },
];
