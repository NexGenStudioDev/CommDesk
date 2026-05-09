import { Task } from "@/features/Dashboard/types/dashboard";
import { categorizeTasks } from "@/utils/task.utils";
import TaskRow from "@/features/Dashboard/components/TaskRow";

interface Props {
  tasks: Task[];
}

export default function UpcomingUrgentTasks({ tasks }: Props) {
  if (!tasks || !Array.isArray(tasks)) {
    return (
      <div className="cd-card">
        <p className="text-sm" style={{ color: "var(--cd-text-muted)" }}>
          No tasks available
        </p>
      </div>
    );
  }

  const { urgent, upcoming } = categorizeTasks(tasks);

  return (
    <div className="cd-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="cd-section-title" style={{ marginBottom: 0 }}>
          Upcoming & Urgent Tasks
        </h3>
        <button className="text-xs font-medium" style={{ color: "var(--cd-primary)" }}>
          View All
        </button>
      </div>

      <div className="mb-5">
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--cd-danger)" }}>
          Urgent Tasks
        </p>
        {urgent.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--cd-text-muted)" }}>
            No urgent tasks
          </p>
        ) : (
          <div className="space-y-2">
            {urgent.slice(0, 4).map((task) => (
              <TaskRow key={task.id} task={task} urgent />
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--cd-text-2)" }}>
          Upcoming Tasks
        </p>
        {upcoming.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--cd-text-muted)" }}>
            No upcoming tasks
          </p>
        ) : (
          <div className="space-y-2">
            {upcoming.slice(0, 4).map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
