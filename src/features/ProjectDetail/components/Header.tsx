import { Project } from "../types";
import { Button } from "../../../shadcnComponet/ui/button";

interface HeaderProps {
  project: Project;
  userRole: "Participant" | "Judge" | "Organizer" | "Admin";
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function Header({ project, userRole, onSubmit, isSubmitting }: HeaderProps) {
  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "Draft": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "Submitted": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Under Review": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Approved": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Rejected": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const isOwner = userRole === "Participant"; // Simplified

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{project.title}</h1>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
          <span>{project.eventName}</span>
          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
          <span>{project.eventType}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        {isOwner && project.status === "Draft" && (
          <>
            <Button variant="outline" className="w-full md:w-auto border-slate-700 text-slate-300 hover:bg-slate-800">
              Edit Project
            </Button>
            <Button 
              onClick={onSubmit} 
              disabled={isSubmitting}
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Project"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
