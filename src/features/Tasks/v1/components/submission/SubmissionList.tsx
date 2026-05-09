import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, Inbox, ArrowUpDown } from "lucide-react";
import SubmissionCard from "./SubmissionCard";
import SkeletonLoader from "../common/SkeletonLoader";
import type { Submission } from "../../Task.types";

interface Props {
  submissions: Submission[];
  isLoading: boolean;
  onReview: (id: string) => void;
}

type SortKey = "newest" | "oldest" | "pending";

const SORT_OPTIONS: { value: SortKey; label: string; dot: string }[] = [
  { value: "newest",  label: "Newest first",  dot: "bg-indigo-500"  },
  { value: "oldest",  label: "Oldest first",  dot: "bg-gray-400"    },
  { value: "pending", label: "Pending first", dot: "bg-amber-400"   },
];

const SORT_ACTIVE_COLOR: Record<SortKey, string> = {
  newest:  "bg-indigo-600 text-white",
  oldest:  "bg-gray-600 text-white",
  pending: "bg-amber-500 text-white",
};

// ─── Reusable portal dropdown (same pattern as TaskFilters) ───────────────────
function SortDropdown({ sort, onChange }: { sort: SortKey; onChange: (v: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const btnRef   = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  // Close on outside click — tracks both btn and panel
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!btnRef.current?.contains(t) && !panelRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  // Position panel above or below
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const PANEL_H = 160;
    const below = window.innerHeight - rect.bottom;
    if (below < PANEL_H && rect.top > below) {
      setStyle({ position: "fixed", left: rect.left, bottom: window.innerHeight - rect.top + 6, zIndex: 9999 });
    } else {
      setStyle({ position: "fixed", left: rect.left, top: rect.bottom + 6, zIndex: 9999 });
    }
  }, [open]);

  const current = SORT_OPTIONS.find(o => o.value === sort)!;

  return (
    <div className="relative shrink-0">
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all select-none
          ${SORT_ACTIVE_COLOR[sort]} border-transparent shadow-sm`}
      >
        <ArrowUpDown size={11} className="opacity-80" />
        {current.label}
        <ChevronDown size={11} className={`transition-transform duration-200 ${open ? "rotate-180" : ""} opacity-80`} />
      </button>

      {open && createPortal(
        <div ref={panelRef} style={style}
          className="bg-white rounded-xl border border-gray-200 shadow-2xl shadow-gray-200/80 py-1 overflow-hidden min-w-[160px]">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-left transition-colors
                ${opt.value === sort ? "bg-gray-50 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dot}`} />
              <span className="flex-1">{opt.label}</span>
              {opt.value === sort && <Check size={12} className="text-indigo-500 shrink-0" />}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none group">
      <div
        onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${value ? "bg-indigo-500" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${value ? "translate-x-4" : "translate-x-0.5"}`} />
      </div>
      <span className={`text-xs font-semibold transition-colors ${value ? "text-indigo-600" : "text-gray-500"}`}>
        {label}
      </span>
    </label>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SubmissionList({ submissions, isLoading, onReview }: Props) {
  const [sort,         setSort]         = useState<SortKey>("newest");
  const [showReviewed, setShowReviewed] = useState(true);

  if (isLoading) return <SkeletonLoader type="form" />;

  const sorted = [...submissions]
    .filter(s => showReviewed || !s.review)
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      if (sort === "oldest") return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      return (a.review ? 1 : 0) - (b.review ? 1 : 0); // pending first
    });

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Title + count */}
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-900">Submissions</h3>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold
            ${submissions.length > 0 ? "bg-indigo-50 text-indigo-600" : "bg-gray-100 text-gray-400"}`}>
            {submissions.length}
          </span>
          {submissions.filter(s => !s.review).length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
              {submissions.filter(s => !s.review).length} pending
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Toggle value={showReviewed} onChange={setShowReviewed} label="Show reviewed" />
          <SortDropdown sort={sort} onChange={setSort} />
        </div>
      </div>

      {/* ── List ────────────────────────────────────────────────────────────── */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
            <Inbox size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No submissions yet</p>
          <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
            {showReviewed
              ? "Assignees haven't submitted anything for this task."
              : "All submissions have been reviewed."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map(sub => (
            <SubmissionCard key={sub.id} submission={sub} onReview={onReview} />
          ))}
        </div>
      )}
    </div>
  );
}