import { Sparkles } from "lucide-react";
import { Task } from "@/features/Dashboard/types/dashboard";
import { getAISuggestions } from "@/utils/aisuggestions";

interface Props {
  tasks: Task[];
}

export default function AISuggestions({ tasks }: Props) {
  const suggestions = getAISuggestions(tasks);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-indigo-500" size={18} />
          <h3 className="font-semibold text-lg">AI Suggestions</h3>
        </div>

        <span className="text-xs text-indigo-500">Smart Insights</span>
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className={`
              p-3 rounded-xl text-sm
              transition-all duration-200
              hover:bg-indigo-50 hover:shadow-sm break-words
              ${i === 0 ? "bg-green-50 border border-green-100" : "bg-gray-50"}
            `}
          >
            <span className="text-gray-800">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
