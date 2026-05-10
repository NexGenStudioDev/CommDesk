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
        flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-300
        ${review?.decision === "approved"
          ? "border-[var(--cd-success)] bg-[var(--cd-success-subtle)]"
          : review?.decision === "rejected"
          ? "border-[var(--cd-danger)] bg-[var(--cd-danger-subtle)]"
          : "bg-[var(--cd-surface)] border-[var(--cd-border)] hover:border-[var(--cd-primary)] hover:shadow-md"}
      `}
    >
      {/* ── Member row ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={member.name} src={member.avatar} role={member.role} size="md" showTooltip ring ringColor="ring-[var(--cd-surface)]" />
          <div className="min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: "var(--cd-text)" }}>{member.name}</p>
            <p className="text-xs truncate" style={{ color: "var(--cd-text-muted)" }}>{member.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Timestamp */}
          <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--cd-text-muted)" }}>
            <Clock size={10} />
            {formatDistanceToNow(parseISO(submission.submittedAt), { addSuffix: true })}
          </span>

          {/* Review status chip */}
          {reviewCfg ? (
            <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${reviewCfg.bg} ${reviewCfg.text} ${reviewCfg.border}`}>
              {review!.decision === "approved" ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
              {reviewCfg.label}
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-[var(--cd-warning-subtle)] text-[var(--cd-warning)] border-[var(--cd-warning)]">
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
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--cd-surface-3)] hover:bg-[var(--cd-hover)] border border-[var(--cd-border-subtle)] text-xs font-bold transition-all group/link"
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
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--cd-primary-subtle)] hover:opacity-80 border border-[var(--cd-primary-subtle)] text-xs font-bold transition-all group/link"
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
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--cd-secondary-subtle)] hover:opacity-80 border border-[var(--cd-secondary-subtle)] text-xs font-bold transition-all group/link"
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
        <div className="p-3 rounded-xl border border-[var(--cd-border-subtle)] bg-[var(--cd-surface-2)]">
          <p className="text-xs leading-relaxed" style={{ color: "var(--cd-text-2)" }}>
            {submission.notes}
          </p>
        </div>
      )}

      {/* ── Review details (Existing) ────────────────────────────────────────── */}
      {review && !isReviewing && (
        <div className={`rounded-xl p-4 border flex flex-col gap-2.5 ${reviewCfg!.bg} ${reviewCfg!.border}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${reviewCfg!.text}`}>
              {review.decision === "approved" ? "✓ Approved" : "✗ Rejected"} by {review.reviewedBy}
            </span>
            {review.score !== undefined && (
              <span className="flex items-center gap-1 text-xs font-bold bg-[var(--cd-surface)] px-2 py-1 rounded-full border border-[var(--cd-warning)]" style={{ color: "var(--cd-warning)" }}>
                <Star size={11} fill="currentColor" />
                {review.score}/100
              </span>
            )}
          </div>
          {review.feedback && (
            <p className="text-xs leading-relaxed opacity-90" style={{ color: "var(--cd-text)" }}>{review.feedback}</p>
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
          className="cd-btn cd-btn-primary self-start text-xs font-bold py-2 shadow-sm shadow-[var(--cd-primary-subtle)] active:scale-95 transition-all"
        >
          Review Submission
        </button>
      )}
    </div>
  );
}