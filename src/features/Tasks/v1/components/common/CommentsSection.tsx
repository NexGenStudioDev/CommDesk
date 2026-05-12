import { useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { useComments, useAddComment } from "../../hooks/useComments";

interface Props {
  taskId: string;
}

export default function CommentsSection({ taskId }: Props) {
  const { data: comments = [], isLoading } = useComments(taskId);
  const addComment = useAddComment();
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    setError("");
    await addComment.mutateAsync({ taskId, text: text.trim() });
    setText("");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle size={16} className="text-[var(--cd-text-muted)]" />
        <h3 className="text-sm font-semibold text-[var(--cd-text)]">Comments</h3>
        <span className="rounded-md px-1.5 py-0.5 text-[11px] font-medium bg-[var(--cd-surface-3)] text-[var(--cd-text-muted)]">
          {comments.length}
        </span>
      </div>

      {/* Comment list */}
      {isLoading ? (
        <p className="text-xs text-[var(--cd-text-muted)]">Loading comments…</p>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--cd-border-subtle)] bg-[var(--cd-surface-2)] px-4 py-10">
          <p className="text-xs text-[var(--cd-text-muted)] text-center font-medium">
            No comments yet. Be the first to start the conversation!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3 items-start">
              <img
                src={c.avatar}
                alt={c.author}
                className="h-9 w-9 shrink-0 rounded-full border border-[var(--cd-border-subtle)] object-cover"
              />
              <div className="flex-1 rounded-xl border border-[var(--cd-border-subtle)] bg-[var(--cd-surface)] px-4 py-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-[var(--cd-text)]">{c.author}</span>
                  <span className="text-[10px] text-[var(--cd-text-muted)]">
                    {formatDistanceToNow(parseISO(c.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-[var(--cd-text-2)] leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add comment */}
      <div className="flex flex-col gap-2.5 mt-2">
        <div className="flex gap-3">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSubmit();
              }
            }}
            rows={2}
            placeholder="Write a comment… (Enter to send)"
            className={`flex-1 resize-none rounded-xl border bg-[var(--cd-surface)] px-4 py-3 text-sm text-[var(--cd-text)] outline-none transition-colors
              ${error ? "border-[var(--cd-danger)] ring-2 ring-[var(--cd-danger-subtle)]" : "border-[var(--cd-border)] focus:border-[var(--cd-primary)] focus:ring-2 focus:ring-[var(--cd-primary-subtle)]"}`}
          />
          <button
            onClick={() => void handleSubmit()}
            disabled={addComment.isPending || !text.trim()}
            className="flex h-11 w-11 items-center justify-center self-end rounded-lg bg-[var(--cd-primary)] text-white transition-colors hover:opacity-90 disabled:opacity-40"
          >
            {addComment.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
        {error && <p className="text-[11px] font-medium text-[var(--cd-danger)]">{error}</p>}
      </div>
    </div>
  );
}
