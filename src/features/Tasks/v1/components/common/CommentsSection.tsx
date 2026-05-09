import { useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { useComments, useAddComment } from "../../hooks/useComments";

interface Props { taskId: string; }

export default function CommentsSection({ taskId }: Props) {
  const { data: comments = [], isLoading } = useComments(taskId);
  const addComment = useAddComment();
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) { setError("Comment cannot be empty."); return; }
    setError("");
    await addComment.mutateAsync({ taskId, text: text.trim() });
    setText("");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle size={15} className="text-gray-400" />
        <h3 className="text-sm font-bold text-gray-900">Comments</h3>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-500">
          {comments.length}
        </span>
      </div>

      {/* Comment list */}
      {isLoading ? (
        <p className="text-xs text-gray-400">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">No comments yet. Be the first!</p>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <img src={c.avatar} alt={c.author} className="w-8 h-8 rounded-full shrink-0 object-cover" />
              <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-900">{c.author}</span>
                  <span className="text-[10px] text-gray-400">
                    {formatDistanceToNow(parseISO(c.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add comment */}
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); if (error) setError(""); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void handleSubmit(); }
            }}
            rows={2}
            placeholder="Write a comment… (Enter to send, Shift+Enter for new line)"
            className={`flex-1 text-sm rounded-xl border px-3 py-2.5 outline-none resize-none transition-all placeholder-gray-400 text-gray-800
              ${error ? "border-red-300 ring-2 ring-red-100" : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"}`}
          />
          <button
            onClick={() => void handleSubmit()}
            disabled={addComment.isPending || !text.trim()}
            className="self-end flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition"
          >
            {addComment.isPending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            Send
          </button>
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    </div>
  );
}
