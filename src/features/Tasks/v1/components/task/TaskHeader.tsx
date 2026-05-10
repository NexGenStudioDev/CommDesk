import { useNavigate } from "react-router-dom";
import { Plus, ListTodo, Zap, CheckCircle2, Clock3 } from "lucide-react";
import { useEvents } from "../../hooks/useEvents";
import { EVENT_TYPE_CONFIG, EVENT_STATUS_CONFIG } from "../../constants/task.constants";
import type { Task } from "../../Task.types";

interface Props {
  selectedEventId: string | null;
  tasks: Task[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { key: "all",         label: "All Tasks" },
  { key: "todo",        label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed",   label: "Completed" },
];

export default function TaskHeader({ selectedEventId, tasks, activeTab, onTabChange }: Props) {
  const navigate = useNavigate();
  const { data: events = [] } = useEvents();
  const event     = events.find((e) => e.id === selectedEventId) ?? null;

  const todo        = tasks.filter((t) => t.status === "todo").length;
  const inProgress  = tasks.filter((t) => t.status === "in-progress").length;
  const completed   = tasks.filter((t) => t.status === "completed").length;
  const typeCfg     = event ? EVENT_TYPE_CONFIG[event.type]    : null;
  const statusCfg   = event ? EVENT_STATUS_CONFIG[event.status] : null;

  const tabCount: Record<string, number> = {
    all: tasks.length,
    todo,
    "in-progress": inProgress,
    completed,
  };

  return (
    <div
      className="border-b flex flex-col font-bold justify-between"
      style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}
    >
      {/* ── Top row ─────────────────────────────────────────── */}
      <div className="pt-8 sm:pt-10 flex w-full justify-between items-start px-6 sm:px-10">
        {/* Left: title + subtitle */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--cd-primary)", color: "#fff" }}
            >
              <ListTodo size={16} />
            </div>
            <h1
              className="text-lg sm:text-2xl font-bold"
              style={{ color: "var(--cd-text)" }}
            >
              Task Management
            </h1>
          </div>

          {event ? (
            <div className="flex items-center gap-2 mt-1 ml-0.5 flex-wrap">
              <p className="text-sm font-normal" style={{ color: "var(--cd-text-2)" }}>
                Tasks for{" "}
                <span className="font-semibold" style={{ color: "var(--cd-primary)" }}>
                  {event.name}
                </span>
              </p>
              {typeCfg && (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeCfg.bg} ${typeCfg.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${typeCfg.dot}`} />
                  {typeCfg.label}
                </span>
              )}
              {statusCfg && (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.text}`}
                >
                  {statusCfg.pulse ? (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusCfg.dot}`} />
                      <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusCfg.dot}`} />
                    </span>
                  ) : (
                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                  )}
                  {event.status}
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm font-normal mt-1" style={{ color: "var(--cd-text-2)" }}>
              Manage all tasks for your events in one place.
            </p>
          )}
        </div>

        {/* Right: New Task button */}
        <div className="flex items-center">
          <button
            onClick={() =>
              navigate(
                selectedEventId
                  ? `/org/tasks/create?eventId=${selectedEventId}`
                  : "/org/tasks/create"
              )
            }
            disabled={!selectedEventId}
            className="cd-btn cd-btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            <span className="hidden sm:inline font-semibold text-sm">New Task</span>
          </button>
        </div>
      </div>

      {/* ── Stats row ───────────────────────────────────────── */}
      {event && (
        <div className="flex items-center gap-3 px-6 sm:px-10 mt-5 overflow-x-auto scrollbar-hide">
          <StatChip icon={<ListTodo size={12} />}    label="Total"       value={tasks.length} />
          <StatChip icon={<Clock3 size={12} />}      label="Todo"        value={todo}         accent="amber"   />
          <StatChip icon={<Zap size={12} />}         label="In Progress" value={inProgress}   accent="indigo"  />
          <StatChip icon={<CheckCircle2 size={12} />} label="Done"       value={completed}    accent="emerald" />
        </div>
      )}

      {/* ── Tab navigation (like Events page) ───────────────── */}
      <div className="flex space-x-1 mt-6 sm:mt-10 px-6 sm:px-10">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className="flex items-center gap-1.5 px-4 py-2 border-b-2 text-sm font-medium transition-all duration-200 whitespace-nowrap"
              style={{
                color: isActive ? "var(--cd-primary)" : "var(--cd-text-2)",
                borderColor: isActive ? "var(--cd-primary)" : "transparent",
              }}
            >
              {tab.label}
              {event && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: isActive ? "var(--cd-primary-subtle)" : "var(--cd-surface-2)",
                    color: isActive ? "var(--cd-primary-text)" : "var(--cd-text-muted)",
                  }}
                >
                  {tabCount[tab.key]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Small stat chip ───────────────────────────────────────────────────────────
function StatChip({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: "indigo" | "emerald" | "amber";
}) {
  const accentMap = {
    indigo:  { bg: "var(--cd-primary-subtle)",  color: "var(--cd-primary-text)" },
    emerald: { bg: "rgba(74,222,128,0.12)",      color: "var(--cd-success)"     },
    amber:   { bg: "rgba(250,204,21,0.12)",      color: "var(--cd-warning)"     },
  };
  const style = accent ? accentMap[accent] : { bg: "var(--cd-surface-2)", color: "var(--cd-text-2)" };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {icon}
      <span className="font-bold">{value}</span>
      <span className="font-medium opacity-80 hidden sm:inline">{label}</span>
    </span>
  );
}