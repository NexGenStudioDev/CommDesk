import { useState } from "react";
import type { Comment } from "../../types/task.types";
import { usePermissions } from "../../context/PermissionContext";

interface Props {
  comments: Comment[];
  onAddComment: (content: string) => void;
}

export default function CommentSection({ comments, onAddComment }: Props) {
  const { currentUserName } = usePermissions();
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(text.trim());
    setText("");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Comments</h3>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400">No comments yet.</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-[#306ee8]/10 flex items-center justify-center text-xs font-bold text-[#306ee8] shrink-0">
              {c.authorName[0]}
            </div>
            <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-700">{c.authorName}</span>
                <span className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="w-7 h-7 rounded-full bg-[#306ee8]/10 flex items-center justify-center text-xs font-bold text-[#306ee8] shrink-0 mt-1">
          {currentUserName[0]}
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#306ee8]/30 focus:border-[#306ee8]"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="px-4 py-2 text-sm font-medium bg-[#306ee8] text-white rounded-lg hover:bg-[#2558c9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
