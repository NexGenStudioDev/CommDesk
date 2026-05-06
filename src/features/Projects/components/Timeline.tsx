import { format } from "date-fns";
import {
  CheckCircle2,
  ClipboardCheck,
  FileEdit,
  FilePlus2,
  ShieldX,
  Trash2,
  UploadCloud,
} from "lucide-react";

import type { TimelineEvent } from "@/features/Projects/types/project.types";
import { cn } from "@/lib/utils";

type TimelineProps = {
  events: TimelineEvent[];
};

const iconMap: Record<TimelineEvent["type"], { icon: typeof FilePlus2, color: string, bg: string }> = {
  created: { icon: FilePlus2, color: "text-blue-600", bg: "bg-blue-50" },
  edited: { icon: FileEdit, color: "text-amber-600", bg: "bg-amber-50" },
  submitted: { icon: UploadCloud, color: "text-sky-600", bg: "bg-sky-50" },
  scored: { icon: ClipboardCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
  approved: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  rejected: { icon: ShieldX, color: "text-rose-600", bg: "bg-rose-50" },
  deleted: { icon: Trash2, color: "text-slate-600", bg: "bg-slate-50" },
};

export default function Timeline({ events }: TimelineProps) {
  return (
    <section className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Activity History</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Project Timeline</h2>
          </div>
        </div>

        <div className="relative mt-10 space-y-8">
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-slate-200 via-slate-100 to-transparent" />
          
          {events.map((event) => {
            const config = iconMap[event.type];
            const Icon = config.icon;

            return (
              <div key={event.id} className="relative flex gap-6">
                <div className={cn(
                  "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm ring-4 ring-white transition-transform group-hover:scale-110",
                  config.bg,
                  config.color
                )}>
                  <Icon className="size-5" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm font-black text-slate-900">{event.message}</p>
                    <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest ring-1 ring-slate-100">
                      {format(new Date(event.timestamp), "hh:mm a")}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500">
                        {event.actorName.charAt(0)}
                      </div>
                      <p className="text-[10px] font-bold text-slate-500">
                        {event.actorName}
                      </p>
                    </div>
                    <span className="size-1 rounded-full bg-slate-200" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                      {event.actorRole}
                    </p>
                    <span className="size-1 rounded-full bg-slate-200" />
                    <p className="text-[10px] font-bold text-slate-400">
                      {format(new Date(event.timestamp), "dd MMM yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
