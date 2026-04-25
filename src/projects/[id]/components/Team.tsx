import { Crown, Users } from "lucide-react";

import type { ProjectRecord } from "../types";

type TeamProps = {
  project: ProjectRecord;
};

export default function Team({ project }: TeamProps) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Team</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">
          {project.teamName || "Solo project"}
        </h2>
      </div>

      <div className="grid gap-3">
        {project.members.map((member, index) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {member.avatarLabel}
              </div>
              <div>
                <p className="font-medium text-slate-900">{member.name}</p>
                <p className="text-sm text-slate-600">{member.role}</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {index === 0 ? <Crown className="size-4 text-amber-500" /> : <Users className="size-4" />}
              {index === 0 ? "Lead" : "Member"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
