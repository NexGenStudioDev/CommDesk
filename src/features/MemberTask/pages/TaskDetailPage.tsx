import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { mockTasks, mockSubmissions, mockComments } from "../mock/taskMock";
import { usePermissions } from "../context/PermissionContext";
import TaskDetail from "../components/task/TaskDetail";
import type { Task, Submission, Comment, TaskStatus } from "../types/task.types";

export default function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const { currentUserId, currentUserName } = usePermissions();

  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [comments, setComments] = useState<Comment[]>(mockComments);

  const task = tasks.find((t) => t.id === taskId);
  if (!task) return <Navigate to="/org/tasks" replace />;

  const taskSubmissions = submissions.filter((s) => s.taskId === taskId);
  const taskComments = comments.filter((c) => c.taskId === taskId);

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const handleAddSubmission = (_taskId: string, content: string) => {
    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      taskId: _taskId,
      submittedBy: currentUserId,
      submittedByName: currentUserName,
      content,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
    setSubmissions((prev) => [...prev, newSub]);
  };

  const handleAddComment = (_taskId: string, content: string) => {
    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      taskId: _taskId,
      authorId: currentUserId,
      authorName: currentUserName,
      content,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
  };

  const handleReview = (
    submissionId: string,
    status: "approved" | "rejected",
    note: string
  ) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId ? { ...s, status, reviewNote: note } : s
      )
    );
  };

  return (
    <div className="flex-1 p-6 min-w-0">
      <TaskDetail
        task={task}
        submissions={taskSubmissions}
        comments={taskComments}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onAddSubmission={handleAddSubmission}
        onAddComment={handleAddComment}
        onReview={handleReview}
      />
    </div>
  );
}
