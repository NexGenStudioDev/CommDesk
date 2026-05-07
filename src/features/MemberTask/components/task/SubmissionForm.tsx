import { useState } from "react";
import type { Submission } from "../../types/task.types";
import { usePermissions } from "../../context/PermissionContext";
import { MdCheckCircle, MdCancel, MdHourglassEmpty } from "react-icons/md";

interface Props {
  taskId: string;
  deadline: string;
  submissions: Submission[];
  onSubmit: (content: string) => void;
}

const statusIcon = {
  pending: <MdHourglassEmpty className="text-yellow-500" />,
  approved: <MdCheckCircle className="text-green-500" />,
  rejected: <MdCancel className="text-red-500" />,
};

export default function SubmissionForm({ deadline, submissions, onSubmit }: Props) {
  const { hasPermission, currentUserId } = usePermissions();
  const [content, setContent] = useState("");

  const deadlinePassed = new Date() > new Date(deadline);
  const mySubmissions = submissions.filter((s) => s.submittedBy === currentUserId);
  const hasSubmitted = mySubmissions.length > 0;

  const canSubmit =
    (!hasSubmitted || hasPermission("MULTIPLE_SUBMISSION")) &&
    (!deadlinePassed || hasPermission("LATE_SUBMISSION"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !canSubmit) return;
    onSubmit(content.trim());
    setContent("");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Submissions</h3>

      {/* Submission history */}
      {mySubmissions.length > 0 && (
        <div className="space-y-2">
          {mySubmissions.map((sub) => (
            <div key={sub.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                {statusIcon[sub.status]}
                <span className="text-xs font-medium text-gray-600 capitalize">{sub.status}</span>
                <span className="text-xs text-gray-400 ml-auto">
                  {new Date(sub.submittedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700">{sub.content}</p>
              {sub.reviewNote && (
                <p className="text-xs text-gray-500 mt-1 italic">Review: {sub.reviewNote}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit form */}
      {canSubmit ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe your submission or paste a link..."
            rows={3}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#306ee8]/30 focus:border-[#306ee8]"
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className="px-4 py-2 text-sm font-medium bg-[#306ee8] text-white rounded-lg hover:bg-[#2558c9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Submit Work
          </button>
        </form>
      ) : (
        <div className="text-sm text-gray-400 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
          {deadlinePassed && !hasPermission("LATE_SUBMISSION")
            ? "Deadline has passed. Late submissions are not allowed."
            : "You have already submitted. Multiple submissions are not allowed."}
        </div>
      )}
    </div>
  );
}
