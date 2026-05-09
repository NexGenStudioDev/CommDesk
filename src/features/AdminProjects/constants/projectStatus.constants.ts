import { ProjectStatus } from "../types/adminProjects.types";

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string; border: string; glow: string }> = {
  Pending: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    border: 'border-amber-500/20',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.1)]',
  },
  Approved: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    border: 'border-emerald-500/20',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]',
  },
  Rejected: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-500',
    border: 'border-rose-500/20',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.1)]',
  },
  Suspended: {
    bg: 'bg-slate-500/10',
    text: 'text-slate-500',
    border: 'border-slate-500/20',
    glow: 'shadow-[0_0_15px_rgba(100,116,139,0.1)]',
  },
  Draft: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500/20',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.1)]',
  },
};

export const TRACKS = [
  'AI & ML',
  'Web3',
  'Sustainability',
  'FinTech',
  'HealthTech',
  'Cybersecurity',
  'Open Innovation',
];

export const EVENTS = [
  'Global Hackathon 2026',
  'Nexus AI Summit',
  'Code for Change',
  'DeFi Builders 2025',
];
