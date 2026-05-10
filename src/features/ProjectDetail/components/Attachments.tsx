import { Project } from "../types";
import { Paperclip, FileText, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

export function Attachments({ project }: { project: Project }) {
  if (project.attachments.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="w-5 h-5 text-blue-400" />;
      case "image": return <ImageIcon className="w-5 h-5 text-purple-400" />;
      case "link": return <LinkIcon className="w-5 h-5 text-green-400" />;
      default: return <Paperclip className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white">Attachments</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {project.attachments.map((att) => (
          <a
            key={att.id}
            href={att.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
          >
            <div className="p-2 bg-slate-800 rounded-md group-hover:bg-slate-900 transition-colors">
              {getIcon(att.type)}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">{att.name}</p>
              <p className="text-xs text-slate-400 capitalize">{att.type}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
