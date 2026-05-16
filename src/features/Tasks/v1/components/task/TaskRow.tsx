import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, Github, FileUp, Layers, Link } from "lucide-react";
import { formatDistanceToNow, isPast, parseISO, differenceInHours } from "date-fns";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import { AvatarGroup } from "../common/Avatar";
import TechBadge from "../common/TechBadge";
import { SUBMISSION_STATUS_CONFIG } from "../../constants/task.constants";
import type { Task } from "../../Task.types";

interface Props {
  task: Task;
  onDelete: (task: Task) => void;
}

const SUB_ICON: Record<string, React.ReactNode> = {
  file: <FileUp size={11} />,
  github: <Github size={11} />,
  link: <Link size={11} />,
  all: <Layers size={11} />,
};

export default function TaskRow({ task, onDelete }: Props) {
  const navigate = useNavigate();
  const subStatusCfg = SUBMISSION_STATUS_CONFIG[task.submissionStatus];
  const deadlineDt = parseISO(task.deadline);
  const isOverdue = isPast(deadlineDt) && task.status !== "completed";
  const isNear = !isOverdue && differenceInHours(deadlineDt, new Date()) < 24;

  return (
    <tr
      onClick={() => navigate(`/org/tasks/${task.id}`)}
      className="group cursor-pointer border-b border-[var(--cd-border-subtle)] transition-colors duration-150 hover:bg-[var(--cd-hover)]"
    >
      {/* Title */}
      <td className="min-w-0 py-3.5 pl-5 pr-5">
        <div className="flex max-w-[520px] flex-col gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <StatusBadge status={task.status} size="sm" />
            {task.isMandatory && (
              <span
                className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                style={{ backgroundColor: "transparent", color: "var(--cd-text-muted)" }}
              >
                Required
              </span>
            )}
          </div>
          <div className="min-w-0">
            <span
              className="block w-full truncate text-sm font-semibold transition-colors group-hover:text-[var(--cd-primary)]"
              style={{ color: "var(--cd-text)" }}
            >
              {task.title}
            </span>
            <span
              className="mt-1 block w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-5"
              style={{ color: "var(--cd-text-muted)" }}
            >
              {task.description}
            </span>
          </div>
        </div>
        {task.technologies && task.technologies.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {task.technologies.slice(0, 3).map((tech) => (
              <TechBadge key={tech.id} tech={tech} size="xs" />
            ))}
            {task.technologies.length > 3 && (
              <span
                className="inline-block rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                style={{ backgroundColor: "var(--cd-surface-2)", color: "var(--cd-text-2)" }}
              >
                +{task.technologies.length - 3}
              </span>
            )}
          </div>
        )}
      </td>

      {/* Avatar group */}
      <td className="py-3.5 pr-5">
        <AvatarGroup members={task.assignedTo} max={3} size="sm" />
      </td>

      <td className="py-3.5 pr-5">
        <PriorityBadge priority={task.priority} size="sm" />
      </td>

      {/* Deadline */}
      <td className="py-3.5 pr-5">
        <div className="flex flex-col gap-0.5">
          <span
            className="text-xs font-medium"
            style={{
              color: isOverdue
                ? "var(--cd-danger)"
                : isNear
                  ? "var(--cd-warning)"
                  : "var(--cd-text-2)",
            }}
          >
            {isOverdue
              ? `Overdue ${formatDistanceToNow(deadlineDt, { addSuffix: true })}`
              : formatDistanceToNow(deadlineDt, { addSuffix: true })}
          </span>
          <span className="text-[10px]" style={{ color: "var(--cd-text-muted)" }}>
            {deadlineDt.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </td>

      {/* Submission */}
      <td className="py-3.5 pr-5">
        <div className="flex flex-col gap-1.5">
          <span
            className={`inline-flex w-fit items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium ${subStatusCfg.bg} ${subStatusCfg.text}`}
          >
            {SUB_ICON[task.submissionType]}
            {subStatusCfg.label}
          </span>
          {task.points !== undefined && (
            <span className="text-[10px] font-medium" style={{ color: "var(--cd-text-muted)" }}>
              {task.points} pts
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="py-3.5 pr-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity duration-150 lg:opacity-0 lg:group-hover:opacity-100">
          <Btn
            icon={<Eye size={13} />}
            label="View"
            onClick={() => navigate(`/org/tasks/${task.id}`)}
            color="indigo"
          />
          <Btn
            icon={<Pencil size={13} />}
            label="Edit"
            onClick={() => navigate(`/org/tasks/${task.id}/edit`)}
            color="gray"
          />
          <Btn
            icon={<Trash2 size={13} />}
            label="Delete"
            onClick={() => onDelete(task)}
            color="red"
          />
        </div>
      </td>
    </tr>
  );
}

function Btn({
  icon,
  label,
  onClick,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: "indigo" | "gray" | "red";
}) {
  const styles = {
    indigo: "text-[var(--cd-primary-text)] hover:bg-[var(--cd-primary-subtle)]",
    gray: "text-[var(--cd-text-2)] hover:bg-[var(--cd-surface-2)]",
    red: "text-[var(--cd-danger)] hover:bg-[var(--cd-danger-subtle)]",
  }[color];

  return (
    <button
      title={label}
      onClick={onClick}
      className={`rounded-lg p-1.5 transition-colors ${styles}`}
    >
      {icon}
    </button>
  );
}
