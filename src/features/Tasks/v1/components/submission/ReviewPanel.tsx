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
  if (score >= 90) return { text: "Excellent",  color: "text-emerald-600", bar: "bg-emerald-500" };
  if (score >= 75) return { text: "Good",        color: "text-sky-600",     bar: "bg-sky-500"     };
  if (score >= 50) return { text: "Average",     color: "text-amber-600",   bar: "bg-amber-400"   };
  return               { text: "Needs Work",  color: "text-red-500",     bar: "bg-red-400"     };
}

export default function ReviewPanel({ submissionId, onSuccess, onCancel }: Props) {
  const [decision, setDecision] = useState<ReviewDecision>("approved");
  const [score,    setScore]    = useState<number>(80);
  const [scoreInput, setScoreInput] = useState<string>("80"); // separate string for manual input
  const [useScore, setUseScore] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [error,    setError]    = useState("");

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
    if (!feedback.trim()) { setError("Please add feedback for the submitter."); return; }
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
    <div className="rounded-2xl border-2 overflow-hidden transition-all duration-300"
      style={{ 
        backgroundColor: "var(--cd-surface)", 
        borderColor: "var(--cd-primary-subtle)",
        boxShadow: "0 10px 30px -10px var(--cd-primary-subtle)" 
      }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b"
        style={{ backgroundColor: "var(--cd-primary-subtle)", borderColor: "var(--cd-border)" }}>
        <div className="flex items-center gap-2">
          <MessageSquare size={15} style={{ color: "var(--cd-primary)" }} />
          <span className="text-sm font-bold" style={{ color: "var(--cd-primary-text)" }}>Submit Review</span>
        </div>
        <button onClick={onCancel} className="p-1 rounded-lg transition-all hover:bg-[var(--cd-primary)] hover:text-white active:scale-95" style={{ color: "var(--cd-primary-text)" }}>
          <X size={15} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Decision */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--cd-text-muted)" }}>Decision</label>
          <div className="flex rounded-xl overflow-hidden border p-1 gap-1" style={{ backgroundColor: "var(--cd-surface-2)", borderColor: "var(--cd-border)" }}>
            <button onClick={() => setDecision("approved")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95
                ${decision === "approved" ? "bg-[var(--cd-success)] text-white shadow-md" : "text-[var(--cd-text-muted)] hover:bg-[var(--cd-hover)]"}`}>
              <CheckCircle2 size={14} /> Approve
            </button>
            <button onClick={() => setDecision("rejected")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95
                ${decision === "rejected" ? "bg-[var(--cd-danger)] text-white shadow-md" : "text-[var(--cd-text-muted)] hover:bg-[var(--cd-hover)]"}`}>
              <XCircle size={14} /> Reject
            </button>
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5" style={{ color: "var(--cd-text-muted)" }}>
              <Star size={11} style={{ color: "var(--cd-warning)" }} /> Score (optional)
            </label>
            <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer select-none" style={{ color: "var(--cd-text-muted)" }}>
              <div onClick={() => setUseScore((v) => !v)}
                className="relative w-8 h-4 rounded-full cursor-pointer transition-colors"
                style={{ backgroundColor: useScore ? "var(--cd-primary)" : "var(--cd-surface-3)" }}>
                <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${useScore ? "translate-x-4" : "translate-x-0.5"}`} />
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
                    type="range" min={0} max={100} step={1} value={score}
                    onChange={handleSlider}
                    className="w-full h-2 rounded-full cursor-pointer accent-[var(--cd-primary)]"
                    style={{ background: "var(--cd-surface-3)" }}
                  />
                  <div className="flex justify-between text-[9px] font-bold" style={{ color: "var(--cd-text-muted)" }}>
                    <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
                  </div>
                </div>

                {/* Manual type input */}
                <div className="flex flex-col items-center gap-0.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number" min={0} max={100}
                      value={scoreInput}
                      onChange={handleManualInput}
                      onBlur={handleManualBlur}
                      className="w-16 h-12 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      style={{ 
                        backgroundColor: "var(--cd-warning-subtle)", 
                        color: "var(--cd-warning)",
                        borderColor: "var(--cd-warning-subtle)"
                      }}
                    />
                    <span className="text-xs font-bold" style={{ color: "var(--cd-text-muted)" }}>/100</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${info.color}`}>{info.text}</span>
                </div>
              </div>

              {/* Color progress bar */}
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--cd-surface-3)" }}>
                <div className={`h-full rounded-full transition-all duration-500 ${info.bar}`}
                  style={{ width: `${score}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Feedback */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--cd-text-muted)" }}>
            Feedback <span style={{ color: "var(--cd-danger)" }}>*</span>
          </label>
          <textarea
            value={feedback}
            onChange={(e) => { setFeedback(e.target.value); if (error) setError(""); }}
            rows={4} placeholder={decision === "approved" ? "Great work! Explain what they did well…" : "Explain what needs to be improved…"}
            className="w-full text-sm rounded-xl border px-4 py-3 outline-none resize-none transition-all shadow-inner"
            style={{ 
              backgroundColor: "var(--cd-surface-2)", 
              color: "var(--cd-text)",
              borderColor: error ? "var(--cd-danger)" : "var(--cd-border)",
              boxShadow: error ? "0 0 0 2px var(--cd-danger-subtle)" : "none"
            }}
          />
          <div className="flex items-center justify-between">
            {error && <p className="text-xs font-bold" style={{ color: "var(--cd-danger)" }}>⚠ {error}</p>}
            <p className="text-[10px] font-bold ml-auto" style={{ color: "var(--cd-text-muted)" }}>{feedback.length}/500</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t" style={{ borderColor: "var(--cd-border)" }}>
          <button onClick={onCancel} disabled={isPending}
            className="px-5 py-2.5 rounded-xl border text-sm font-bold transition-all hover:bg-[var(--cd-hover)] disabled:opacity-40"
            style={{ color: "var(--cd-text-2)", borderColor: "var(--cd-border)" }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isPending}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-white transition-all disabled:opacity-60 active:scale-95 shadow-lg
              ${decision === "approved" ? "bg-[var(--cd-success)] shadow-[var(--cd-success-subtle)]" : "bg-[var(--cd-danger)] shadow-[var(--cd-danger-subtle)]"}`}>
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {decision === "approved" ? "Approve" : "Reject"} Submission
          </button>
        </div>
      </div>
    </div>
  );
}