import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdEdit, MdDelete } from "react-icons/md";
import type { Task, Submission, Comment, TaskStatus } from "../../types/task.types";
import { usePermissions } from "../../context/PermissionContext";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import ConfirmModal from "../common/ConfirmModal";
import SubmissionForm from "./SubmissionForm";
import CommentSection from "./CommentSection";

interface Props {
  task: Task;
  submissions: Submission[];
  comments: Comment[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onAddSubmission: (taskId: string, content: string) => void;
  onAddComment: (taskId: string, content: string) => void;
  onReview: (submissionId: string, status: "approved" | "rejected", note: string) => void;
}

const STATUS_OPTIONS: TaskStatus[] = ["todo", "in-progress", "review", "completed"];

export default function TaskDetail({
  task,
  submissions,
  comments,
  onDelete,
  onStatusChange,
  onAddSubmission,
  onAddComment,
  onReview,
}: Props) {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [showDelete, setShowDelete] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [reviewTarget, setReviewTarget] = useState<string | null>(null);

  const deadlinePassed = new Date() > new Date(task.deadline);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate("/org/tasks")}
          className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors shrink-0"
        >
          <MdArrowBack />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-gray-900 truncate">{task.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {deadlinePassed && (
              <span className="text-xs text-red-500 font-medium">Deadline passed</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {hasPermission("EDIT_TASK") && (
            <button
              onClick={() => navigate(`/org/tasks/${task.id}/edit`)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <MdEdit className="text-base" /> Edit
            </button>
          )}
          {hasPermission("DELETE_TASK") && (
            <button
              onClick={() => setShowDelete(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            >
              <MdDelete className="text-base" /> Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Task info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
            {task.tags && task.tags.length > 0 && (
              <div className="flex gap-1.5 mt-4 flex-wrap">
                {task.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submission */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <SubmissionForm
              taskId={task.id}
              deadline={task.deadline}
              submissions={submissions}
              onSubmit={(content) => onAddSubmission(task.id, content)}
            />
          </div>

          {/* Review panel */}
          {hasPermission("UPDATE_STATUS") && submissions.filter((s) => s.status === "pending").length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Review Submissions</h3>
              <div className="space-y-3">
                {submissions
                  .filter((s) => s.status === "pending")
                  .map((sub) => (
                    <div key={sub.id} className="border border-gray-100 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{sub.submittedByName}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(sub.submittedAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{sub.content}</p>
                      {reviewTarget === sub.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={reviewNote}
                            onChange={(e) => setReviewNote(e.target.value)}
                            placeholder="Review note (optional)"
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#306ee8]/30"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                onReview(sub.id, "approved", reviewNote);
                                setReviewTarget(null);
                                setReviewNote("");
                              }}
                              className="px-3 py-1.5 text-xs font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                onReview(sub.id, "rejected", reviewNote);
                                setReviewTarget(null);
                                setReviewNote("");
                              }}
                              className="px-3 py-1.5 text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => setReviewTarget(null)}
                              className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReviewTarget(sub.id)}
                          className="text-xs text-[#306ee8] hover:underline"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <CommentSection
              comments={comments}
              onAddComment={(content) => onAddComment(task.id, content)}
            />
          </div>
        </div>

        {/* Right: Meta */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">Details</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Assigned To</span>
                <span className="font-medium text-gray-700">{task.assignedToName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deadline</span>
                <span className={`font-medium ${deadlinePassed ? "text-red-500" : "text-gray-700"}`}>
                  {new Date(task.deadline).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-700">
                  {new Date(task.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </div>

            {/* Status update */}
            {hasPermission("UPDATE_STATUS") && (
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Update Status
                </label>
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#306ee8]/30 focus:border-[#306ee8]"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDelete && (
        <ConfirmModal
          title="Delete Task"
          message="This action cannot be undone. Are you sure?"
          confirmLabel="Delete"
          onConfirm={() => {
            onDelete(task.id);
            navigate("/org/tasks");
          }}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
