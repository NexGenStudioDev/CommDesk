import React from 'react';
import { MoreVertical, Star, Users, CheckCircle, Clock } from 'lucide-react';
import { Project } from '../types/adminProjects.types';
import ProjectStatusBadge from './ProjectStatusBadge';
import { cn } from '../../../lib/utils';

interface ProjectsGridProps {
  projects: Project[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onViewProject: (project: Project) => void;
  onAction: (id: string, action: string) => void;
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  selectedIds,
  onSelect,
  onViewProject,
  onAction,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className={cn(
            "group relative bg-slate-900/50 border border-slate-800/60 rounded-3xl overflow-hidden transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer",
            selectedIds.includes(project.id) && "ring-2 ring-blue-500/50 border-blue-500/50"
          )}
          onClick={() => onViewProject(project)}
        >
          {/* Checkbox Overlay */}
          <div 
            className="absolute top-4 left-4 z-10"
            onClick={(e) => { e.stopPropagation(); onSelect(project.id); }}
          >
            <div className={cn(
              "w-6 h-6 rounded-lg border flex items-center justify-center transition-all backdrop-blur-md",
              selectedIds.includes(project.id) ? "bg-blue-600 border-blue-600 text-white" : "bg-black/20 border-white/20 group-hover:border-white/40"
            )}>
              {selectedIds.includes(project.id) && <CheckCircle className="w-4 h-4" />}
            </div>
          </div>

          {/* Thumbnail */}
          <div className="aspect-[16/10] overflow-hidden relative">
            <img 
              src={project.thumbnail} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              alt={project.name} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <ProjectStatusBadge status={project.status} className="backdrop-blur-md" />
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-white">{project.avgScore}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                {project.name}
              </h3>
              <button 
                onClick={(e) => { e.stopPropagation(); onAction(project.id, 'menu'); }}
                className="p-1 text-slate-500 hover:text-white transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-slate-500 font-medium mb-4">{project.teamName}</p>
            
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60">
              <div className="flex -space-x-1.5 flex-1">
                {project.assignedJudges.map((judge, i) => (
                  <img 
                    key={i} 
                    src={`https://i.pravatar.cc/150?u=${judge.id}`} 
                    className="w-6 h-6 rounded-full border-2 border-slate-900 object-cover" 
                    alt="" 
                  />
                ))}
                {project.assignedJudges.length === 0 && (
                  <div className="w-6 h-6 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center">
                    <Users className="w-3 h-3 text-slate-600" />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Updated 2h ago</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsGrid;
