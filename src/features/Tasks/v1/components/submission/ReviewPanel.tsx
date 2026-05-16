import { useState } from "react";
import { CheckCircle2, XCircle, Star, X, Loader2, MessageSquare } from "lucide-react";
import { useReviewSubmission } from "../../hooks/useSubmissions";
import type { ReviewDecision } from "../../Task.types";

interface Props {
  submissionId: string;
  taskId: string;
  currentTaskStatus: string;
  onSuccess: () => void;
  onCancel: () => void;
}

function getScoreInfo(score: number) {
  if (score >= 90) return { text: "Excellent", color: "text-emerald-600", bar: "bg-emerald-500" };
  if (score >= 75) return { text: "Good", color: "text-sky-600", bar: "bg-sky-500" };
  if (score >= 50) return { text: "Average", color: "text-amber-600", bar: "bg-amber-400" };
  return { text: "Needs Work", color: "text-red-500", bar: "bg-red-400" };
}

export default function ReviewPanel({ submissionId, onSuccess, onCancel }: Props) {
  const [decision, setDecision] = useState<ReviewDecision>("approved");
  const [score, setScore] = useState<number>(80);
  const [scoreInput, setScoreInput] = useState<string>("80"); // separate string for manual input
  const [useScore, setUseScore] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const { mutateAsync, isPending } = useReviewSubmission();
  const info = getScoreInfo(score);

  // ── Slider moves → update both number and string ──────────────────────────
  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setScore(v);
    setScoreInput(String(v));
  };

  // ── Manual typing → clamp to 0–100, update slider ────────────────────────
  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setScoreInput(raw); // allow typing freely
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.min(100, Math.max(0, parsed));
      setScore(clamped);
    }
  };

  // Sync input box when blurred (clamp display)
  const handleManualBlur = () => {
    setScoreInput(String(score));
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      setError("Please add feedback for the submitter.");
      return;
    }
    setError("");
    try {
      await mutateAsync({
        submissionId,
        payload: { decision, score: useScore ? score : undefined, feedback: feedback.trim() },
      });
      onSuccess();
    } catch {
      setError("Review failed. Please try again.");
    }
  };

  return (
    <div
      className="overflow-hidden rounded-xl border transition-colors duration-200"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border-subtle)",
        boxShadow: "none",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)" }}
      >
        <div className="flex items-center gap-2">
          <MessageSquare size={15} style={{ color: "var(--cd-primary)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--cd-text)" }}>
            Submit Review
          </span>
        </div>
        <button
          onClick={onCancel}
          className="rounded-lg p-1 transition-colors hover:bg-[var(--cd-hover)]"
          style={{ color: "var(--cd-text-muted)" }}
        >
          <X size={15} />
        </button>
      </div>

      <div className="flex flex-col gap-5 p-5">
        {/* Decision */}
        <div className="flex flex-col gap-2">
          <label
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--cd-text-muted)" }}
          >
            Decision
          </label>
          <div
            className="flex overflow-hidden rounded-lg border p-1 gap-1"
            style={{
              backgroundColor: "var(--cd-surface-2)",
              borderColor: "var(--cd-border-subtle)",
            }}
          >
            <button
              onClick={() => setDecision("approved")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors
                ${decision === "approved" ? "bg-[var(--cd-success)] text-white" : "text-[var(--cd-text-muted)] hover:bg-[var(--cd-hover)]"}`}
            >
              <CheckCircle2 size={14} /> Approve
            </button>
            <button
              onClick={() => setDecision("rejected")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors
                ${decision === "rejected" ? "bg-[var(--cd-danger)] text-white" : "text-[var(--cd-text-muted)] hover:bg-[var(--cd-hover)]"}`}
            >
              <XCircle size={14} /> Reject
            </button>
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--cd-text-muted)" }}
            >
              <Star size={11} style={{ color: "var(--cd-warning)" }} /> Score (optional)
            </label>
            <label
              className="flex cursor-pointer select-none items-center gap-1.5 text-xs font-medium"
              style={{ color: "var(--cd-text-muted)" }}
            >
              <div
                onClick={() => setUseScore((v) => !v)}
                className="relative w-8 h-4 rounded-full cursor-pointer transition-colors"
                style={{ backgroundColor: useScore ? "var(--cd-primary)" : "var(--cd-surface-3)" }}
              >
                <span
                  className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${useScore ? "translate-x-4" : "translate-x-0.5"}`}
                />
              </div>
              Enable
            </label>
          </div>

          {useScore && (
            <div className="flex flex-col gap-4">
              {/* Slider + manual input + badge row */}
              <div className="flex items-center gap-4">
                {/* Slider */}
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={score}
                    onChange={handleSlider}
                    className="w-full h-2 rounded-full cursor-pointer accent-[var(--cd-primary)]"
                    style={{ background: "var(--cd-surface-3)" }}
                  />
                  <div
                    className="flex justify-between text-[9px] font-bold"
                    style={{ color: "var(--cd-text-muted)" }}
                  >
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Manual type input */}
                <div className="flex flex-col items-center gap-0.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={scoreInput}
                      onChange={handleManualInput}
                      onBlur={handleManualBlur}
                      className="h-11 w-16 rounded-lg border text-center text-xl font-semibold outline-none transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      style={{
                        backgroundColor: "var(--cd-warning-subtle)",
                        color: "var(--cd-warning)",
                        borderColor: "var(--cd-warning-subtle)",
                      }}
                    />
                    <span className="text-xs font-bold" style={{ color: "var(--cd-text-muted)" }}>
                      /100
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-tighter ${info.color}`}
                  >
                    {info.text}
                  </span>
                </div>
              </div>

              {/* Color progress bar */}
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--cd-surface-3)" }}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${info.bar}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Feedback */}
        <div className="flex flex-col gap-2">
          <label
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--cd-text-muted)" }}
          >
            Feedback <span style={{ color: "var(--cd-danger)" }}>*</span>
          </label>
          <textarea
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
              if (error) setError("");
            }}
            rows={4}
            placeholder={
              decision === "approved"
                ? "Great work! Explain what they did well…"
                : "Explain what needs to be improved…"
            }
            className="w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none transition-colors"
            style={{
              backgroundColor: "var(--cd-surface-2)",
              color: "var(--cd-text)",
              borderColor: error ? "var(--cd-danger)" : "var(--cd-border)",
              boxShadow: error ? "0 0 0 2px var(--cd-danger-subtle)" : "none",
            }}
          />
          <div className="flex items-center justify-between">
            {error && (
              <p className="text-xs font-bold" style={{ color: "var(--cd-danger)" }}>
                ⚠ {error}
              </p>
            )}
            <p className="text-[10px] font-bold ml-auto" style={{ color: "var(--cd-text-muted)" }}>
              {feedback.length}/500
            </p>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex items-center justify-end gap-3 border-t pt-3"
          style={{ borderColor: "var(--cd-border-subtle)" }}
        >
          <button
            onClick={onCancel}
            disabled={isPending}
            className="h-9 rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-[var(--cd-hover)] disabled:opacity-40"
            style={{ color: "var(--cd-text-2)", borderColor: "var(--cd-border)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className={`flex h-9 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white transition-colors disabled:opacity-60
              ${decision === "approved" ? "bg-[var(--cd-success)]" : "bg-[var(--cd-danger)]"}`}
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {decision === "approved" ? "Approve" : "Reject"} Submission
          </button>
        </div>
      </div>
    </div>
  );
}
