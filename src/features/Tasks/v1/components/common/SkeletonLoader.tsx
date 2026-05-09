// ─── Shimmer base ─────────────────────────────────────────────────────────────
function Shimmer({ className }: { className: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-100 rounded ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

// ─── Table skeleton ───────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b bg-gray-50">
        <Shimmer className="h-3 w-40" />
        <Shimmer className="h-3 w-24 ml-auto" />
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-3 w-16" />
      </div>
      {/* Rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-4 border-b border-gray-50 border-l-4 border-l-gray-100"
        >
          {/* Title */}
          <div className="flex-1 flex flex-col gap-1.5">
            <Shimmer className="h-3.5 w-[60%]" />
            <Shimmer className="h-2.5 w-[40%]" />
          </div>
          {/* Avatars */}
          <div className="flex -space-x-1.5">
            <Shimmer className="w-7 h-7 rounded-full" />
            <Shimmer className="w-7 h-7 rounded-full" />
          </div>
          {/* Status badge */}
          <Shimmer className="h-5 w-20 rounded-full" />
          {/* Priority */}
          <Shimmer className="h-5 w-14 rounded-full" />
          {/* Deadline */}
          <div className="flex flex-col gap-1">
            <Shimmer className="h-3 w-20" />
            <Shimmer className="h-2.5 w-14" />
          </div>
          {/* Submission */}
          <Shimmer className="h-5 w-20 rounded-full" />
          {/* Actions */}
          <div className="flex gap-1">
            <Shimmer className="w-7 h-7 rounded-lg" />
            <Shimmer className="w-7 h-7 rounded-lg" />
            <Shimmer className="w-7 h-7 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Detail skeleton ──────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left panel */}
      <div className="w-[420px] shrink-0 border-r bg-white p-6 flex flex-col gap-5">
        <Shimmer className="h-3 w-28" />
        <Shimmer className="h-6 w-4/5" />
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-3/4" />
        <div className="flex gap-2">
          <Shimmer className="h-6 w-20 rounded-full" />
          <Shimmer className="h-6 w-14 rounded-full" />
          <Shimmer className="h-6 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Shimmer className="h-3 w-24" />
          {Array.from({ length: 2 }).map((_, i) => (
            <Shimmer key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </div>
      {/* Right panel */}
      <div className="flex-1 p-6 flex flex-col gap-4">
        <div className="flex gap-4 border-b pb-4">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-4 w-20" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Shimmer className="w-8 h-8 rounded-full" />
              <div className="flex flex-col gap-1">
                <Shimmer className="h-3 w-28" />
                <Shimmer className="h-2.5 w-16" />
              </div>
            </div>
            <Shimmer className="h-3 w-full" />
            <Shimmer className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Form skeleton ────────────────────────────────────────────────────────────
function FormSkeleton() {
  return (
    <div className="flex flex-col gap-5 p-6 max-w-2xl">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Shimmer className="h-3 w-24" />
          <Shimmer className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
type SkeletonType = "table" | "detail" | "form";

export default function SkeletonLoader({ type = "table" }: { type?: SkeletonType }) {
  if (type === "detail") return <DetailSkeleton />;
  if (type === "form")   return <FormSkeleton />;
  return <TableSkeleton />;
}