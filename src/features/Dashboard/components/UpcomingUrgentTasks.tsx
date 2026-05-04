import { Task } from "@/features/Dashboard/types/dashboard";
import { categorizeTasks } from "@/utils/task.utils";
import TaskRow from "@/features/Dashboard/components/TaskRow";

interface Props {
  tasks: Task[];
}

export default function UpcomingUrgentTasks({ tasks }: Props) {
  if (!tasks || !Array.isArray(tasks)) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <p className="text-gray-400 text-sm">No tasks available</p>
      </div>
    );
  }

  const { urgent, upcoming } = categorizeTasks(tasks);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Upcoming & Urgent Tasks</h3>

        <button className="text-sm text-indigo-500 hover:underline">View All</button>
      </div>

      {/*Urgent Section */}
      <div className="mb-5">
        <p className="text-sm font-medium text-red-500 mb-2">Urgent Tasks</p>

        {urgent.length === 0 ? (
          <p className="text-gray-400 text-sm">No urgent tasks</p>
        ) : (
          <div className="space-y-3">
            {urgent.slice(0, 4).map((task) => (
              <TaskRow key={task.id} task={task} urgent />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Section */}
      <div>
        <p className="text-sm font-medium text-gray-500 mb-2">Upcoming Tasks</p>

        {upcoming.length === 0 ? (
          <p className="text-gray-400 text-sm">No upcoming tasks</p>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 4).map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
