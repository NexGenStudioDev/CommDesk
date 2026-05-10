import React from "react";
import type { ReactNode } from "react";

// ─── Inline SVG illustrations ─────────────────────────────────────────────────
function NoEventIllustration() {
  return (
    <svg width="96" height="80" viewBox="0 0 96 80" fill="none" className="mb-1">
      <rect x="8" y="12" width="80" height="56" rx="8" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5"/>
      <rect x="8" y="12" width="80" height="16" rx="8" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5"/>
      <rect x="20" y="8" width="8" height="12" rx="4" fill="#94A3B8"/>
      <rect x="68" y="8" width="8" height="12" rx="4" fill="#94A3B8"/>
      <rect x="20" y="38" width="20" height="8" rx="3" fill="#CBD5E1"/>
      <rect x="48" y="38" width="28" height="8" rx="3" fill="#E2E8F0"/>
      <rect x="20" y="52" width="28" height="8" rx="3" fill="#E2E8F0"/>
      <rect x="56" y="52" width="20" height="8" rx="3" fill="#CBD5E1"/>
      <circle cx="76" cy="60" r="14" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.5"/>
      <path d="M76 54v6l3 3" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function NoTasksIllustration() {
  return (
    <svg width="96" height="80" viewBox="0 0 96 80" fill="none" className="mb-1">
      <rect x="16" y="8" width="64" height="64" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5"/>
      <rect x="28" y="24" width="40" height="6" rx="3" fill="#E2E8F0"/>
      <rect x="28" y="36" width="28" height="6" rx="3" fill="#EEF2FF"/>
      <rect x="28" y="48" width="34" height="6" rx="3" fill="#E2E8F0"/>
      <circle cx="24" cy="27" r="4" fill="#C7D2FE" stroke="#818CF8" strokeWidth="1"/>
      <circle cx="24" cy="39" r="4" fill="#C7D2FE" stroke="#818CF8" strokeWidth="1"/>
      <circle cx="24" cy="51" r="4" fill="#C7D2FE" stroke="#818CF8" strokeWidth="1"/>
      <circle cx="70" cy="58" r="14" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1.5"/>
      <path d="M65 58l3 3 6-6" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ErrorIllustration() {
  return (
    <svg width="96" height="80" viewBox="0 0 96 80" fill="none" className="mb-1">
      <rect x="12" y="16" width="72" height="48" rx="8" fill="#FFF1F2" stroke="#FECDD3" strokeWidth="1.5"/>
      <path d="M48 30v14" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="48" cy="50" r="2" fill="#F43F5E"/>
      <path d="M28 16L20 8M68 16l8-8" stroke="#FECDD3" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function NoResultsIllustration() {
  return (
    <svg width="96" height="80" viewBox="0 0 96 80" fill="none" className="mb-1">
      <circle cx="44" cy="36" r="24" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5"/>
      <circle cx="44" cy="36" r="14" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1"/>
      <path d="M36 36h16M44 28v16" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M62 54l12 12" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round"/>
      <rect x="28" y="28" width="32" height="3" rx="1.5" fill="#BFDBFE" transform="rotate(45 28 28)"/>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
interface EmptyStateProps {
  variant?: "no-event" | "no-tasks" | "no-results" | "error";
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

const illustrations: Record<string, () => React.JSX.Element> = {
  "no-event":   NoEventIllustration,
  "no-tasks":   NoTasksIllustration,
  "no-results": NoResultsIllustration,
  "error":      ErrorIllustration,
};

export default function EmptyState({
  variant = "no-tasks",
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  const Illustration = illustrations[variant];

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-12 max-w-sm mx-auto">
      {icon ? (
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: "var(--cd-surface-2)", color: "var(--cd-text-muted)" }}
        >
          {icon}
        </div>
      ) : (
        <Illustration />
      )}
      <p className="text-sm font-semibold mt-3" style={{ color: "var(--cd-text)" }}>
        {title}
      </p>
      {description && (
        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--cd-text-muted)" }}>
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}