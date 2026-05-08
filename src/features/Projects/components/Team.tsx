import { Crown, Users, UserRound } from "lucide-react";

import type { ProjectRecord } from "@/features/Projects/types/project.types";
import { cn } from "@/lib/utils";

type TeamProps = {
  project: ProjectRecord;
};

export default function Team({ project }: TeamProps) {
  return (
    <section className="group overflow-hidden rounded-[32px] border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
      <div className="p-10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-8">
          <div className="flex items-center gap-5">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50/50 text-indigo-600 shadow-sm ring-1 ring-indigo-100/50 transition-transform group-hover:scale-110 duration-500">
              <Users className="size-7" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-500/80 mb-1">Collaborators</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                {project.teamName || "Founding Member"}
              </h2>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5">
          {project.members.map((member, index) => (
            <div
              key={member.id}
              className="group/member flex items-center justify-between rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-5 transition-all duration-300 hover:border-indigo-200 hover:bg-white hover:shadow-[0_10px_30px_rgba(79,70,229,0.05)]"
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white shadow-xl ring-4 ring-white group-hover/member:bg-indigo-600 transition-all duration-300 group-hover/member:scale-105">
                    {member.avatarLabel}
                  </div>
                  {index === 0 && (
                    <div className="absolute -right-2.5 -top-2.5 flex size-7 items-center justify-center rounded-full bg-amber-400 shadow-lg ring-4 ring-white transition-transform duration-300 group-hover/member:rotate-12">
                      <Crown className="size-3.5 text-slate-950" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-base font-black text-slate-900 leading-tight">{member.name}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-indigo-500/70">{member.role}</p>
                </div>
              </div>

              <div className={cn(
                "hidden sm:flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                index === 0 
                  ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200 group-hover/member:bg-amber-100" 
                  : "bg-white text-slate-400 ring-1 ring-slate-100 group-hover/member:text-slate-600 group-hover/member:ring-slate-200"
              )}>
                {index === 0 ? (
                  <>
                    <Crown className="size-3" />
                    Captain
                  </>
                ) : "Engineer"}
              </div>
            </div>
          ))}
        </div>
        
        {project.members.length === 1 && (
          <div className="mt-8 flex items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/30 p-6">
            <div className="flex size-12 items-center justify-center rounded-xl bg-white text-slate-300 shadow-sm ring-1 ring-slate-100">
               <UserRound className="size-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Solo Architect</p>
              <p className="text-xs font-medium text-slate-400">Project currently managed by a single member.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

