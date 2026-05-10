import { Project } from "../types";
import { Button } from "../../../shadcnComponet/ui/button";
import { ShieldAlert, CheckCircle, XCircle, Trash2 } from "lucide-react";

interface ModerationPanelProps {
  project: Project;
  onModerate: (action: "approve" | "reject") => Promise<void>;
  onDelete: () => Promise<void>;
  isProcessing: boolean;
}

export function ModerationPanel({ project, onModerate, onDelete, isProcessing }: ModerationPanelProps) {
  return (
    <div className="flex flex-col gap-6 p-6 bg-red-950/20 border border-red-900/50 rounded-xl backdrop-blur-sm">
      <div className="flex items-center gap-2 text-red-400">
        <ShieldAlert className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Moderation Controls</h2>
      </div>

      <p className="text-sm text-red-200/70">
        These actions are restricted to Organizers and Admins. Please review carefully before taking action.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => onModerate("approve")}
          disabled={isProcessing || project.status === "Approved"}
          className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/50 hover:border-green-500 transition-colors"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Approve Project
        </Button>
        
        <Button
          onClick={() => onModerate("reject")}
          disabled={isProcessing || project.status === "Rejected"}
          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 hover:border-red-500 transition-colors"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Reject Project
        </Button>

        <div className="flex-1" />

        <Button
          onClick={onDelete}
          disabled={isProcessing}
          variant="destructive"
          className="bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Project
        </Button>
      </div>
    </div>
  );
}
