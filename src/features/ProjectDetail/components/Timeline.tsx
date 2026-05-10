import { Project, TimelineEvent } from "../types";
import { Circle, FileEdit, UploadCloud, Star, ShieldCheck, ShieldX } from "lucide-react";

export function Timeline({ project }: { project: Project }) {
  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "created": return <Circle className="w-4 h-4 text-slate-400" />;
      case "edited": return <FileEdit className="w-4 h-4 text-blue-400" />;
      case "submitted": return <UploadCloud className="w-4 h-4 text-indigo-400" />;
      case "scored": return <Star className="w-4 h-4 text-yellow-400" />;
      case "approved": return <ShieldCheck className="w-4 h-4 text-green-400" />;
      case "rejected": return <ShieldX className="w-4 h-4 text-red-400" />;
    }
  };

  // Sort timeline newest first
  const sortedTimeline = useMemo(() => 
    [...project.timeline].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ), [project.timeline]);

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white">Activity Timeline</h2>

      <div className="relative border-l border-slate-700 ml-3 space-y-6">
        {sortedTimeline.map((event, index) => (
          <div key={event.id} className="relative pl-6">
            <span className="absolute -left-[11px] top-1 bg-slate-900 p-1 rounded-full border border-slate-700">
              {getEventIcon(event.type)}
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{event.title}</span>
                <span className="text-xs text-slate-500">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-400">{event.description}</p>
              <p className="text-xs text-slate-500 font-medium">by {event.actorName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
