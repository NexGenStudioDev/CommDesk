import { Crown, Users, UserRound } from "lucide-react";

import type { ProjectRecord } from "@/features/Projects/types/project.types";
import { cn } from "@/lib/utils";

type TeamProps = {
  project: ProjectRecord;
};

export default function Team({ project }: TeamProps) {
  return (
    <section className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Collaborators</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              {project.teamName || "Founding Member"}
            </h2>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
            <Users className="size-6" />
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {project.members.map((member, index) => (
            <div
              key={member.id}
              className="group/member flex items-center justify-between rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 transition-all hover:border-indigo-100 hover:bg-white hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-950 text-base font-black text-white shadow-xl ring-4 ring-white group-hover/member:bg-indigo-600 transition-colors">
                    {member.avatarLabel}
                  </div>
                  {index === 0 && (
                    <div className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-amber-400 shadow-lg ring-2 ring-white">
                      <Crown className="size-3 text-slate-950" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{member.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{member.role}</p>
                </div>
              </div>

              <div className={cn(
                "hidden sm:flex items-center gap-2 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors",
                index === 0 
                  ? "bg-amber-50 text-amber-700 ring-1 ring-amber-100" 
                  : "bg-white text-slate-400 ring-1 ring-slate-100"
              )}>
                {index === 0 ? "Captain" : "Engineer"}
              </div>
            </div>
          ))}
        </div>
        
        {project.members.length === 1 && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-dashed border-slate-100 p-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-50 text-slate-300">
               <UserRound className="size-5" />
            </div>
            <p className="text-xs font-bold text-slate-400">Project currently managed by a solo architect.</p>
          </div>
        )}
      </div>
    </section>
  );
}
