import { useNavigate } from "react-router-dom";
import { Plus, ListTodo, Zap, CheckCircle2, Clock3 } from "lucide-react";
import { useEvents } from "../../hooks/useEvents";
import { EVENT_TYPE_CONFIG, EVENT_STATUS_CONFIG } from "../../constants/task.constants";
import type { Task } from "../../Task.types";

interface Props { selectedEventId: string | null; tasks: Task[]; }

export default function TaskHeader({ selectedEventId, tasks }: Props) {
  const navigate = useNavigate();
  const { data: events = [] } = useEvents();
  const event = events.find((e) => e.id === selectedEventId) ?? null;

  const todo       = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed  = tasks.filter((t) => t.status === "completed").length;
  const typeCfg    = event ? EVENT_TYPE_CONFIG[event.type]   : null;
  const statusCfg  = event ? EVENT_STATUS_CONFIG[event.status] : null;

  return (
    <div className="bg-white border-b">
      {/* Top row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
            <ListTodo size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">Task Management</h1>
            {event ? (
              <p className="text-xs text-gray-400 truncate max-w-[180px] sm:max-w-none">
                Tasks for <span className="font-semibold text-indigo-600">{event.name}</span>
              </p>
            ) : (
              <p className="text-xs text-gray-400">Select an event to begin</p>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate(selectedEventId ? `/org/tasks/create?eventId=${selectedEventId}` : "/org/tasks/create")}
          disabled={!selectedEventId}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200 shrink-0"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New Task</span>
          <span className="inline sm:hidden">New</span>
        </button>
      </div>

      {/* Event badges + stats — scrollable on mobile */}
      {event && typeCfg && statusCfg && (
        <div className="px-4 pb-2.5 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg shrink-0 ${typeCfg.bg} ${typeCfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${typeCfg.dot}`} />{typeCfg.label}
          </span>

          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg shrink-0 ${statusCfg.bg} ${statusCfg.text}`}>
            {statusCfg.pulse ? (
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusCfg.dot}`} />
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusCfg.dot}`} />
              </span>
            ) : <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />}
            {event.status}
          </span>

          <div className="w-px h-4 bg-gray-200 shrink-0" />

          <Chip icon={<ListTodo size={11} />}     label="Total"       value={tasks.length}  color="text-gray-600"    bg="bg-gray-100"    />
          <Chip icon={<Clock3 size={11} />}        label="Todo"        value={todo}           color="text-gray-500"    bg="bg-gray-50"     />
          <Chip icon={<Zap size={11} />}           label="In Progress" value={inProgress}     color="text-indigo-600"  bg="bg-indigo-50"   />
          <Chip icon={<CheckCircle2 size={11} />}  label="Done"        value={completed}      color="text-emerald-600" bg="bg-emerald-50"  />
        </div>
      )}
    </div>
  );
}

function Chip({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: number; color: string; bg: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold shrink-0 ${bg} ${color}`}>
      {icon}<span className="font-bold">{value}</span>
      <span className="font-medium opacity-75 hidden sm:inline">{label}</span>
    </span>
  );
}