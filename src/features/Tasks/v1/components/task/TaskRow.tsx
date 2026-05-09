import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, Github, FileUp, Layers } from "lucide-react";
import { formatDistanceToNow, isPast, parseISO, differenceInHours } from "date-fns";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import { AvatarGroup } from "../common/Avatar";
import { SUBMISSION_STATUS_CONFIG } from "../../constants/task.constants";
import type { Task } from "../../Task.types";

interface Props { task: Task; onDelete: (task: Task) => void; }

const SUB_ICON: Record<string, React.ReactNode> = {
  file: <FileUp size={11} />, github: <Github size={11} />, both: <Layers size={11} />,
};
const PRIORITY_BORDER: Record<string, string> = {
  high: "border-l-red-500", medium: "border-l-amber-400", low: "border-l-sky-400",
};

export default function TaskRow({ task, onDelete }: Props) {
  const navigate     = useNavigate();
  const subStatusCfg = SUBMISSION_STATUS_CONFIG[task.submissionStatus];
  const deadlineDt   = parseISO(task.deadline);
  const isOverdue    = isPast(deadlineDt) && task.status !== "completed";
  const isNear       = !isOverdue && differenceInHours(deadlineDt, new Date()) < 24;

  return (
    <tr onClick={() => navigate(`/org/tasks/${task.id}`)}
      className={`group cursor-pointer border-b border-gray-100 border-l-4 ${PRIORITY_BORDER[task.priority]} hover:bg-indigo-50/40 transition-colors duration-100`}>

      {/* Title */}
      <td className="py-3 pr-4 pl-3 min-w-0 max-w-[280px]">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-700 transition-colors">
            {task.title}
          </span>
          <span className="text-xs text-gray-400 truncate">{task.description.slice(0, 60)}…</span>
        </div>
        {task.technologies && task.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {task.technologies.slice(0, 3).map(tech => (
              <span key={tech.id} className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${tech.color}`}>
                {tech.label}
              </span>
            ))}
            {task.technologies.length > 3 && (
              <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500">
                +{task.technologies.length - 3}
              </span>
            )}
          </div>
        )}
        {task.isMandatory && (
          <span className="mt-1 inline-block text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">
            Mandatory
          </span>
        )}
      </td>

      {/* Avatar group */}
      <td className="py-3 pr-4">
        <AvatarGroup
          members={task.assignedTo}
          max={3}
          size="sm"
        />
      </td>

      <td className="py-3 pr-4"><StatusBadge status={task.status} size="sm" /></td>
      <td className="py-3 pr-4"><PriorityBadge priority={task.priority} size="sm" /></td>

      {/* Deadline */}
      <td className="py-3 pr-4">
        <div className="flex flex-col gap-0.5">
          <span className={`text-xs font-semibold ${isOverdue ? "text-red-500" : isNear ? "text-amber-500" : "text-gray-700"}`}>
            {isOverdue ? `Overdue ${formatDistanceToNow(deadlineDt, { addSuffix: true })}` : formatDistanceToNow(deadlineDt, { addSuffix: true })}
          </span>
          <span className="text-[10px] text-gray-400">
            {deadlineDt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </div>
        {isOverdue && (
          <span className="mt-0.5 inline-block text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md animate-pulse">
            OVERDUE
          </span>
        )}
      </td>

      {/* Submission */}
      <td className="py-3 pr-4">
        <div className="flex flex-col gap-1">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${subStatusCfg.bg} ${subStatusCfg.text}`}>
            {SUB_ICON[task.submissionType]}{subStatusCfg.label}
          </span>
          {task.points !== undefined && (
            <span className="text-[10px] text-amber-600 font-semibold">★ {task.points} pts</span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="py-3 pr-3" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <Btn icon={<Eye size={13}/>}    label="View"   onClick={() => navigate(`/org/tasks/${task.id}`)}       color="indigo" />
          <Btn icon={<Pencil size={13}/>} label="Edit"   onClick={() => navigate(`/org/tasks/${task.id}/edit`)}  color="gray"   />
          <Btn icon={<Trash2 size={13}/>} label="Delete" onClick={() => onDelete(task)}                          color="red"    />
        </div>
      </td>
    </tr>
  );
}

function Btn({ icon, label, onClick, color }: { icon: React.ReactNode; label: string; onClick: () => void; color: "indigo"|"gray"|"red" }) {
  const cls = { indigo:"hover:bg-indigo-100 hover:text-indigo-700", gray:"hover:bg-gray-100 hover:text-gray-700", red:"hover:bg-red-100 hover:text-red-600" };
  return (
    <button title={label} onClick={onClick} className={`p-1.5 rounded-lg text-gray-400 transition-colors ${cls[color]}`}>{icon}</button>
  );
}