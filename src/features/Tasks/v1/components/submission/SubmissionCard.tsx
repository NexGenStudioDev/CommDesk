import Avatar from "../common/Avatar";
import { ExternalLink, Github, FileUp, Clock, CheckCircle2, XCircle, Star } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { REVIEW_DECISION_CONFIG } from "../../constants/task.constants";
import type { Submission } from "../../Task.types";

interface Props {
  submission: Submission;
  onReview: (id: string) => void;
}

export default function SubmissionCard({ submission, onReview }: Props) {
  const { submittedBy: member, review } = submission;
  const reviewCfg = review ? REVIEW_DECISION_CONFIG[review.decision] : null;

  return (
    <div
      className={`
        flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200
        ${review?.decision === "approved"
          ? "border-emerald-200 bg-emerald-50/40"
          : review?.decision === "rejected"
          ? "border-red-200 bg-red-50/40"
          : "border-gray-200 bg-white hover:border-indigo-200 hover:shadow-sm"}
      `}
    >
      {/* ── Member row ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar name={member.name} src={member.avatar} role={member.role} size="md" showTooltip ring ringColor="ring-white" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{member.name}</p>
            <p className="text-xs text-gray-400 truncate">{member.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Timestamp */}
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <Clock size={10} />
            {formatDistanceToNow(parseISO(submission.submittedAt), { addSuffix: true })}
          </span>

          {/* Review status chip */}
          {reviewCfg ? (
            <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${reviewCfg.bg} ${reviewCfg.text} ${reviewCfg.border}`}>
              {review!.decision === "approved" ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
              {reviewCfg.label}
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
              Pending Review
            </span>
          )}
        </div>
      </div>

      {/* ── Links ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        {submission.githubUrl && (
          <a
            href={submission.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold transition-colors group/link"
          >
            <Github size={13} />
            <span className="flex-1 truncate">{submission.githubUrl.replace("https://", "")}</span>
            <ExternalLink size={11} className="opacity-50 group-hover/link:opacity-100 transition" />
          </a>
        )}
        {submission.fileUrl && (
          <a
            href={submission.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors group/link"
          >
            <FileUp size={13} />
            <span className="flex-1 truncate">{submission.fileUrl}</span>
            <ExternalLink size={11} className="opacity-50 group-hover/link:opacity-100 transition" />
          </a>
        )}
      </div>

      {/* ── Notes ────────────────────────────────────────────────────────────── */}
      {submission.notes && (
        <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
          {submission.notes}
        </p>
      )}

      {/* ── Review details ───────────────────────────────────────────────────── */}
      {review && (
        <div className={`rounded-xl p-3 border flex flex-col gap-2 ${reviewCfg!.bg} ${reviewCfg!.border}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${reviewCfg!.text}`}>
              {review.decision === "approved" ? "✓ Approved" : "✗ Rejected"} by {review.reviewedBy}
            </span>
            {review.score !== undefined && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Star size={10} fill="currentColor" />
                {review.score}/100
              </span>
            )}
          </div>
          {review.feedback && (
            <p className="text-xs text-gray-600 leading-relaxed">{review.feedback}</p>
          )}
        </div>
      )}

      {/* ── Review action (if not yet reviewed) ──────────────────────────────── */}
      {!review && (
        <button
          onClick={() => onReview(submission.id)}
          className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold transition-all"
        >
          Review Submission
        </button>
      )}
    </div>
  );
}