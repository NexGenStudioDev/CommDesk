import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, Github, FileUp, Layers, Link } from "lucide-react";
import { formatDistanceToNow, isPast, parseISO, differenceInHours } from "date-fns";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import { AvatarGroup } from "../common/Avatar";
import TechBadge from "../common/TechBadge";
import { SUBMISSION_STATUS_CONFIG } from "../../constants/task.constants";
import type { Task } from "../../Task.types";

interface Props { task: Task; onDelete: (task: Task) => void; }

const SUB_ICON: Record<string, React.ReactNode> = {
  file: <FileUp size={11} />, 
  github: <Github size={11} />, 
  link: <Link size={11} />,
  all: <Layers size={11} />,
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
      className={`group cursor-pointer border-l-4 ${PRIORITY_BORDER[task.priority]} transition-all duration-200 hover:bg-[var(--cd-hover)] border-b border-[var(--cd-border-subtle)]`}
    >
      {/* Title */}
      <td className="py-3 pr-4 pl-3 min-w-0">
        <div className="flex max-w-[360px] flex-col items-start gap-1.5">
          <StatusBadge status={task.status} size="sm" />
          <span className="w-full truncate text-sm font-semibold group-hover:text-[var(--cd-primary)] transition-colors" style={{ color: "var(--cd-text)" }}>
            {task.title}
          </span>
          <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs" style={{ color: "var(--cd-text-muted)" }}>
            {task.description}
          </span>
        </div>
        {task.technologies && task.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {task.technologies.slice(0, 3).map((tech) => (
              <TechBadge key={tech.id} tech={tech} size="xs" />
            ))}
            {task.technologies.length > 3 && (
              <span
                className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                style={{ backgroundColor: "var(--cd-surface-2)", color: "var(--cd-text-2)" }}
              >
                +{task.technologies.length - 3}
              </span>
            )}
          </div>
        )}
        {task.isMandatory && (
          <span
            className="mt-1 inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
            style={{ backgroundColor: "var(--cd-primary-subtle)", color: "var(--cd-primary-text)" }}
          >
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

      <td className="py-3 pr-4"><PriorityBadge priority={task.priority} size="sm" /></td>

      {/* Deadline */}
      <td className="py-3 pr-4">
        <div className="flex flex-col gap-0.5">
          <span
            className="text-xs font-semibold"
            style={{
              color: isOverdue ? "var(--cd-danger)" : isNear ? "var(--cd-warning)" : "var(--cd-text-2)",
            }}
          >
            {isOverdue
              ? `Overdue ${formatDistanceToNow(deadlineDt, { addSuffix: true })}`
              : formatDistanceToNow(deadlineDt, { addSuffix: true })}
          </span>
          <span className="text-[10px]" style={{ color: "var(--cd-text-muted)" }}>
            {deadlineDt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </div>
        {isOverdue && (
          <span
            className="mt-0.5 inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md animate-pulse"
            style={{ color: "var(--cd-danger)", backgroundColor: "var(--cd-danger-subtle)" }}
          >
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
            <span className="text-[10px] font-semibold" style={{ color: "var(--cd-warning)" }}>
              {task.points} pts
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="py-3 pr-3" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-0.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-150">
          <Btn icon={<Eye size={13}/>}    label="View"   onClick={() => navigate(`/org/tasks/${task.id}`)}       color="indigo" />
          <Btn icon={<Pencil size={13}/>} label="Edit"   onClick={() => navigate(`/org/tasks/${task.id}/edit`)}  color="gray"   />
          <Btn icon={<Trash2 size={13}/>} label="Delete" onClick={() => onDelete(task)}                          color="red"    />
        </div>
      </td>
    </tr>
  );
}

function Btn({ icon, label, onClick, color }: { icon: React.ReactNode; label: string; onClick: () => void; color: "indigo"|"gray"|"red" }) {
  const styles = {
    indigo: "text-[var(--cd-primary-text)] hover:bg-[var(--cd-primary-subtle)]",
    gray: "text-[var(--cd-text-2)] hover:bg-[var(--cd-surface-2)]",
    red: "text-[var(--cd-danger)] hover:bg-[var(--cd-danger-subtle)]",
  }[color];
  
  return (
    <button
      title={label}
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-colors ${styles}`}
    >
      {icon}
    </button>
  );
}

