import { Project } from "../types";
import { ExternalLink, Github } from "lucide-react";

export function Overview({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white">Project Overview</h2>
      
      <div className="text-slate-300 leading-relaxed text-sm md:text-base">
        {project.description}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-400">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span key={tech} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-md border border-slate-700">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 pt-2">
        {project.githubUrl && (
          <a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
          </a>
        )}
        {project.liveDemoUrl && (
          <a 
            href={project.liveDemoUrl} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Live Demo</span>
          </a>
        )}
      </div>
    </div>
  );
}
