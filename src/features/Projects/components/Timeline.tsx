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

type TimelineProps = {
  events: TimelineEvent[];
};

const iconMap: Record<TimelineEvent["type"], typeof FilePlus2> = {
  created: FilePlus2,
  edited: FileEdit,
  submitted: UploadCloud,
  scored: ClipboardCheck,
  approved: CheckCircle2,
  rejected: ShieldX,
  deleted: Trash2,
};

export default function Timeline({ events }: TimelineProps) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Timeline</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">Activity log</h2>
      </div>

      <div className="relative space-y-5">
        <div className="absolute left-[17px] top-2 bottom-2 w-px bg-slate-200" />
        {events.map((event) => {
          const Icon = iconMap[event.type];

          return (
            <div key={event.id} className="relative flex gap-4">
              <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                <Icon className="size-4" />
              </div>
              <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{event.message}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {event.actorName} {" \u2022 "} {event.actorRole}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500">
                    {format(new Date(event.timestamp), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
