import React from 'react';
import { MoreVertical, ExternalLink, Shield, Trash2, CheckCircle, XCircle, Users } from 'lucide-react';
import { Project } from '../types/adminProjects.types';
import ProjectStatusBadge from './ProjectStatusBadge';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';

interface ProjectsTableProps {
  projects: Project[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewProject: (project: Project) => void;
  onAction: (id: string, action: string) => void;
  pagination: { page: number; pageSize: number };
  setPagination: (pagination: { page: number; pageSize: number }) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  selectedIds,
  onSelect,
  onSelectAll,
  onViewProject,
  onAction,
  pagination,
  setPagination,
}) => {
  const isAllSelected = projects.length > 0 && selectedIds.length === projects.length;

  return (
    <div className="relative bg-slate-900/40 border border-slate-800/60 rounded-3xl overflow-hidden backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/40 border-b border-slate-800/60 transition-colors">
              <th className="px-6 py-4 w-10">
                <div 
                  onClick={onSelectAll}
                  className={cn(
                    "w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all",
                    isAllSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-700 hover:border-slate-500 bg-slate-900"
                  )}
                >
                  {isAllSelected && <div className="w-2.5 h-2.5 bg-white rounded-[1px]" />}
                </div>
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Project Name</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Team</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest hidden lg:table-cell">Event</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest hidden xl:table-cell">Track</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Avg Score</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest hidden 2xl:table-cell">Judges</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {projects.map((project) => (
              <tr 
                key={project.id}
                className={cn(
                  "group hover:bg-slate-800/30 transition-all duration-200 cursor-pointer",
                  selectedIds.includes(project.id) && "bg-blue-500/[0.03]"
                )}
                onClick={() => onViewProject(project)}
              >
                <td className="px-6 py-4" onClick={(e) => { e.stopPropagation(); onSelect(project.id); }}>
                  <div 
                    className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center transition-all",
                      selectedIds.includes(project.id) ? "bg-blue-600 border-blue-600 text-white" : "border-slate-700 group-hover:border-slate-500 bg-slate-900"
                    )}
                  >
                    {selectedIds.includes(project.id) && <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      <img src={project.thumbnail} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{project.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-medium">{format(new Date(project.submissionDate), 'MMM d, h:mm a')}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-400 font-medium">{project.teamName}</span>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <span className="text-xs text-slate-500">{project.eventName}</span>
                </td>
                <td className="px-6 py-4 hidden xl:table-cell">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {project.track}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <ProjectStatusBadge status={project.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{project.avgScore}</span>
                    <span className="text-[10px] text-slate-500">/10</span>
                  </div>
                </td>
                <td className="px-6 py-4 hidden 2xl:table-cell">
                  <div className="flex -space-x-2">
                    {project.assignedJudges.map((judge, i) => (
                      <img 
                        key={i} 
                        src={`https://i.pravatar.cc/150?u=${judge.id}`} 
                        className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover" 
                        title={judge.name}
                        alt=""
                      />
                    ))}
                    {project.assignedJudges.length === 0 && <span className="text-[10px] text-slate-600 font-medium">Unassigned</span>}
                  </div>
                </td>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                   <div className="relative group/menu">
                      <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      <div className="absolute right-0 top-10 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 hidden group-hover/menu:block z-50 animate-in fade-in zoom-in-95 duration-150">
                        <button onClick={() => onAction(project.id, 'approve')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-emerald-500 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => onAction(project.id, 'reject')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-rose-500 flex items-center gap-2">
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                        <button onClick={() => onAction(project.id, 'assign')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2">
                          <Users className="w-4 h-4" /> Assign Judge
                        </button>
                        <div className="h-[1px] bg-slate-800 my-1" />
                        <button onClick={() => onAction(project.id, 'suspend')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2">
                          <Shield className="w-4 h-4" /> Suspend
                        </button>
                        <button onClick={() => onAction(project.id, 'delete')} className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-500/10 flex items-center gap-2">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Placeholder */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-800/20 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Page <span className="text-slate-300 font-bold">{pagination.page}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
            disabled={pagination.page === 1}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={projects.length < pagination.pageSize}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTable;
