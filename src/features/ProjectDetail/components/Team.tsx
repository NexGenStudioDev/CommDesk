import { Project } from "../types";
import { Users } from "lucide-react";

export function Team({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-indigo-400" />
        <h2 className="text-xl font-semibold text-white">
          Team: <span className="text-indigo-300">{project.teamName}</span>
        </h2>
        {project.isSolo && (
          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-slate-800 text-slate-300 rounded-md border border-slate-700">
            Solo
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {project.members.map((member) => (
          <div key={member.id} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            {member.avatarUrl ? (
              <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full bg-slate-700 object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-slate-300">
                {member.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-white">{member.name}</p>
              <p className="text-xs text-slate-400">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
