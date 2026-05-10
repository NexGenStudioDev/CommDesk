import { useState } from "react";
import { Project } from "../types";
import { Button } from "../../../shadcnComponet/ui/button";

interface ScorePanelProps {
  project: Project;
  onSubmitScore: (scoreData: { innovation: number; technical: number; design: number; impact: number; feedback: string }) => Promise<void>;
}

export function ScorePanel({ project, onSubmitScore }: ScorePanelProps) {
  const [scores, setScores] = useState({ innovation: 0, technical: 0, design: 0, impact: 0 });
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitScore({ ...scores, feedback });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-indigo-950/30 border border-indigo-500/30 rounded-xl backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <div className="text-9xl font-bold">{totalScore}</div>
      </div>

      <div className="flex items-center justify-between relative z-10">
        <h2 className="text-xl font-semibold text-indigo-100">Judge Evaluation</h2>
        <div className="bg-indigo-600 px-4 py-1.5 rounded-full text-white font-bold shadow-[0_0_15px_rgba(79,70,229,0.5)]">
          Total: {totalScore} / 40
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {(["innovation", "technical", "design", "impact"] as const).map((criteria) => (
          <div key={criteria} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-indigo-200 capitalize">{criteria} (0-10)</label>
              <span className="text-xs text-indigo-400 font-mono">{scores[criteria]}/10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={scores[criteria]}
              onChange={(e) => setScores(s => ({ ...s, [criteria]: parseInt(e.target.value, 10) }))}
              className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2 relative z-10">
        <label className="text-sm font-medium text-indigo-200">Feedback Details</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Provide constructive feedback for the team..."
          className="w-full h-32 bg-slate-900/50 border border-indigo-500/30 rounded-lg p-3 text-sm text-indigo-100 placeholder:text-indigo-300/50 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
        />
      </div>

      <div className="flex justify-end relative z-10">
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || totalScore === 0}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
        >
          {isSubmitting ? "Submitting Evaluation..." : "Submit Score"}
        </Button>
      </div>
    </div>
  );
}
