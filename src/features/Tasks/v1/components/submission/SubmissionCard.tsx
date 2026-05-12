import { useState } from "react";
import Avatar from "../common/Avatar";
import { ExternalLink, Github, FileUp, Clock, CheckCircle2, XCircle, Star } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { REVIEW_DECISION_CONFIG } from "../../constants/task.constants";
import ReviewPanel from "./ReviewPanel";
import type { Submission } from "../../Task.types";

interface Props {
  submission: Submission;
  onReview: (id: string) => void;
}

export default function SubmissionCard({ submission, onReview }: Props) {
  const [isReviewing, setIsReviewing] = useState(false);
  const { submittedBy: member, review } = submission;
  const reviewCfg = review ? REVIEW_DECISION_CONFIG[review.decision] : null;

  return (
    <div
      className={`
        flex flex-col gap-4 rounded-xl border p-4 transition-colors duration-200 sm:p-5
        ${review?.decision === "approved"
          ? "border-[var(--cd-success-subtle)] bg-[var(--cd-success-subtle)]"
          : review?.decision === "rejected"
          ? "border-[var(--cd-danger-subtle)] bg-[var(--cd-danger-subtle)]"
          : "bg-[var(--cd-surface)] border-[var(--cd-border-subtle)] hover:bg-[var(--cd-hover)]"}
      `}
    >
      {/* ── Member row ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={member.name} src={member.avatar} role={member.role} size="md" showTooltip={false} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold" style={{ color: "var(--cd-text)" }}>{member.name}</p>
            <p className="text-xs truncate" style={{ color: "var(--cd-text-muted)" }}>{member.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Timestamp */}
          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--cd-text-muted)" }}>
            <Clock size={10} />
            {formatDistanceToNow(parseISO(submission.submittedAt), { addSuffix: true })}
          </span>

          {/* Review status chip */}
          {reviewCfg ? (
            <span className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium ${reviewCfg.bg} ${reviewCfg.text} ${reviewCfg.border}`}>
              {review!.decision === "approved" ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
              {reviewCfg.label}
            </span>
          ) : (
            <span className="rounded-md border px-2 py-1 text-[11px] font-medium bg-[var(--cd-warning-subtle)] text-[var(--cd-warning)] border-[var(--cd-warning-subtle)]">
              Pending Review
            </span>
          )}
        </div>
      </div>

      {/* ── Links ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        {submission.githubUrl && (
          <a
            href={submission.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="group/link flex items-center gap-2 rounded-lg border border-[var(--cd-border-subtle)] bg-[var(--cd-surface-2)] px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--cd-hover)]"
            style={{ color: "var(--cd-text)" }}
          >
            <Github size={14} className="text-[var(--cd-text-muted)] group-hover/link:text-[var(--cd-primary)]" />
            <span className="flex-1 truncate">{submission.githubUrl.replace("https://", "")}</span>
            <ExternalLink size={11} className="opacity-40 group-hover/link:opacity-100 transition" />
          </a>
        )}
        {submission.fileUrl && (
          <a
            href={submission.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="group/link flex items-center gap-2 rounded-lg border border-[var(--cd-primary-subtle)] bg-[var(--cd-primary-subtle)] px-3 py-2.5 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--cd-primary-text)" }}
          >
            <FileUp size={14} />
            <span className="flex-1 truncate">{submission.fileUrl}</span>
            <ExternalLink size={11} className="opacity-60 group-hover/link:opacity-100 transition" />
          </a>
        )}
        {submission.linkUrl && (
          <a
            href={submission.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="group/link flex items-center gap-2 rounded-lg border border-[var(--cd-secondary-subtle)] bg-[var(--cd-secondary-subtle)] px-3 py-2.5 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--cd-secondary)" }}
          >
            <ExternalLink size={14} />
            <span className="flex-1 truncate">{submission.linkUrl}</span>
            <ExternalLink size={11} className="opacity-60 group-hover/link:opacity-100 transition" />
          </a>
        )}
      </div>

      {/* ── Notes ────────────────────────────────────────────────────────────── */}
      {submission.notes && (
        <div className="rounded-lg border border-[var(--cd-border-subtle)] bg-[var(--cd-surface-2)] p-3">
          <p className="text-sm leading-relaxed" style={{ color: "var(--cd-text-2)" }}>
            {submission.notes}
          </p>
        </div>
      )}

      {/* ── Review details (Existing) ────────────────────────────────────────── */}
      {review && !isReviewing && (
        <div className={`flex flex-col gap-2.5 rounded-lg border p-4 ${reviewCfg!.bg} ${reviewCfg!.border}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${reviewCfg!.text}`}>
              {review.decision === "approved" ? "Approved" : "Rejected"} by {review.reviewedBy}
            </span>
            {review.score !== undefined && (
              <span className="flex items-center gap-1 rounded-md border border-[var(--cd-warning-subtle)] bg-[var(--cd-surface)] px-2 py-1 text-xs font-medium" style={{ color: "var(--cd-warning)" }}>
                <Star size={11} fill="currentColor" />
                {review.score}/100
              </span>
            )}
          </div>
          {review.feedback && (
            <p className="text-sm leading-relaxed opacity-90" style={{ color: "var(--cd-text)" }}>{review.feedback}</p>
          )}
        </div>
      )}

      {/* ── Inline Review Panel ──────────────────────────────────────────────── */}
      {isReviewing && (
        <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <ReviewPanel
            submissionId={submission.id}
            taskId={submission.taskId}
            currentTaskStatus="todo" // Fallback status
            onSuccess={() => {
              setIsReviewing(false);
              onReview(submission.id); // Trigger parent refresh
            }}
            onCancel={() => setIsReviewing(false)}
          />
        </div>
      )}

      {/* ── Review action (if not yet reviewed & not currently reviewing) ─────── */}
      {!review && !isReviewing && (
        <button
          onClick={() => setIsReviewing(true)}
          className="cd-btn cd-btn-primary h-9 self-start rounded-lg px-4 text-sm font-medium shadow-none"
        >
          Review Submission
        </button>
      )}
    </div>
  );
}
