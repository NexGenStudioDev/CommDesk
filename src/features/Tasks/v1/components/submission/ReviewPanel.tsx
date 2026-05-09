import { useState, useCallback } from "react";
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
    <div className="rounded-2xl border-2 border-indigo-200 bg-white shadow-lg shadow-indigo-100/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-indigo-50 border-b border-indigo-100">
        <div className="flex items-center gap-2">
          <MessageSquare size={15} className="text-indigo-600" />
          <span className="text-sm font-bold text-indigo-900">Submit Review</span>
        </div>
        <button onClick={onCancel} className="p-1 rounded-lg text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100 transition">
          <X size={15} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Decision */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Decision</label>
          <div className="flex rounded-xl overflow-hidden border border-gray-200 p-1 gap-1 bg-gray-50">
            <button onClick={() => setDecision("approved")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all
                ${decision === "approved" ? "bg-emerald-500 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"}`}>
              <CheckCircle2 size={14} /> Approve
            </button>
            <button onClick={() => setDecision("rejected")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all
                ${decision === "rejected" ? "bg-red-500 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"}`}>
              <XCircle size={14} /> Reject
            </button>
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
              <Star size={11} className="text-amber-500" /> Score (optional)
            </label>
            <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
              <div onClick={() => setUseScore((v) => !v)}
                className={`relative w-8 h-4 rounded-full cursor-pointer transition-colors ${useScore ? "bg-indigo-500" : "bg-gray-200"}`}>
                <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${useScore ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
              Enable
            </label>
          </div>

          {useScore && (
            <div className="flex flex-col gap-3">
              {/* Slider + manual input + badge row */}
              <div className="flex items-center gap-3">
                {/* Slider */}
                <div className="flex-1 flex flex-col gap-1">
                  <input
                    type="range" min={0} max={100} step={1} value={score}
                    onChange={handleSlider}
                    className="w-full h-3 rounded-full cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400 px-0.5">
                    <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
                  </div>
                </div>

                {/* Manual type input */}
                <div className="flex flex-col items-center gap-0.5 shrink-0">
                  <div className="flex items-center gap-1">
                    <input
                      type="number" min={0} max={100}
                      value={scoreInput}
                      onChange={handleManualInput}
                      onBlur={handleManualBlur}
                      className="w-14 h-10 text-center text-xl font-extrabold text-amber-600 rounded-xl bg-amber-50 border-2 border-amber-200 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span className="text-xs text-gray-400 font-semibold">/100</span>
                  </div>
                  <span className={`text-[10px] font-bold ${info.color}`}>{info.text}</span>
                </div>
              </div>

              {/* Color progress bar */}
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-200 ${info.bar}`}
                  style={{ width: `${score}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Feedback */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
            Feedback <span className="text-red-400">*</span>
          </label>
          <textarea
            value={feedback}
            onChange={(e) => { setFeedback(e.target.value); if (error) setError(""); }}
            rows={4} placeholder={decision === "approved" ? "Great work! Explain what they did well…" : "Explain what needs to be improved…"}
            className={`w-full text-sm rounded-xl border px-3 py-2.5 outline-none resize-none transition-all placeholder-gray-400 text-gray-800
              ${error ? "border-red-300 ring-2 ring-red-100 bg-red-50" : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white"}`}
          />
          {error && <p className="text-xs text-red-500 font-medium">⚠ {error}</p>}
          <p className="text-[10px] text-gray-400 text-right">{feedback.length}/500</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-1 border-t">
          <button onClick={onCancel} disabled={isPending}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-40">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isPending}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 active:scale-95
              ${decision === "approved" ? "bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-200" : "bg-red-500 hover:bg-red-600 shadow-sm shadow-red-200"}`}>
            {isPending && <Loader2 size={13} className="animate-spin" />}
            {decision === "approved" ? "Approve" : "Reject"} Submission
          </button>
        </div>
      </div>
    </div>
  );
}